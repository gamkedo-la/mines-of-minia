export { Overbearer };

    import { ThrowAction } from '../actions/throw.js';
    import { ApplyAction } from '../base/actions/apply.js';
import { GeneratorAction } from '../base/actions/generatorAction.js';
import { MoveAction } from '../base/actions/move.js';
import { PanToActorAction } from '../base/actions/pan.js';
import { WaitAction } from '../base/actions/wait.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Random } from '../base/random.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { LevelSystem } from '../systems/levelSystem.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { Enemy } from './enemy.js';
import { Key } from './key.js';

class Overbearer extends Enemy{
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( this.spec, {
            x_sketch: Assets.get('overbearer'),
            blocks: 0,
            blockedBy: 0,
            maxSpeed: Config.tileSize/.4/1000,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        if (spec.elvl) this.linkLevel(spec.elvl);
        this.startIdx = this.idx;
        this.onBossDeath = this.onBossDeath.bind(this);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        this.linkLevel(evt.lvl);
        if (this.activateOnLoad) this.active = true;
    }

    onAggro(evt) {
        if (!this.active) return;
        if (this.state !== 'idle') return;
        console.log(`${this} aggrod ${Fmt.ofmt(evt)}}`);
        UpdateSystem.eUpdate(this, {state: 'powerup.bull'});
        this.actionStream = this.run();
    }

    onAggroLost(evt) {
        if (!this.active) return;
        console.log(`${this} aggro lost ${Fmt.ofmt(evt)}}`);
    }

    onBossDeath(evt) {
        console.log(`${this} onBossDeath`);
        let x = evt.actor.xform.x;
        let y = evt.actor.xform.y;
        let nextState = (evt.actor.tag === 'boss.bull') ? 'powerup.stealth' : (evt.actor.tag === 'boss.stealth') ? 'powerup.thump' : 'finale';
        //let nextState = (evt.actor.tag === 'boss.bull') ? 'finale' : (evt.actor.tag === 'boss.stealth') ? 'powerup.thump' : 'finale';
        console.log(`nextState: ${nextState}`);
        UpdateSystem.eUpdate(this, {active: true, visible: true, state: nextState, idx: evt.actor.idx, xform: { x:x, y:y}});
    }

    // METHODS -------------------------------------------------------------
    linkLevel(lvl) {
        this.elvl = lvl;
    }

    *run() {
        while (!this.done) {
            switch (this.state) {
            case 'idle':
            case 'inactive':
                yield null;
                break;
            case 'powerup.bull':
                console.log(`state is: ${this.state}`);
                yield new PowerupBullAction({
                    lvl: this.elvl,
                });
                UpdateSystem.eUpdate(this, {state: 'inactive'});
                break;
            case 'powerup.stealth':
                console.log(`-- starting power up stealth`);
                yield new PowerupStealthAction({
                    lvl: this.elvl,
                });
                UpdateSystem.eUpdate(this, {state: 'inactive'});
                break;
            case 'powerup.thump':
                yield new PowerupThumpAction({
                    lvl: this.elvl,
                });
                UpdateSystem.eUpdate(this, {state: 'inactive'});
                break;
            case 'finale':
                yield new FinaleAction({
                    lvl: this.elvl,
                });
                UpdateSystem.eUpdate(this, {state: 'inactive'});
                break;
            default:
                yield null;
                break;
            }
        }
    }

}

class PowerupBullAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
        this.lvl = spec.lvl;
    }
    *run() {
        console.log(`running power up bull`);
        // lock the room
        for (const door of this.lvl.find((v) => v.cls === 'Door' && v.boss)) {
            console.log(`-- locking ${door}`);
            door.locked = true;
        }
        let camera = this.lvl.camera;
        let player = this.lvl.player;
        // focus camera on overbearer
        yield new PanToActorAction({camera: camera});
        camera.trackTarget(this.actor);
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'you know... you\'re really messing things up'});
        yield new WaitAction({ttl: 2000});
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'you really leave me no choice'});
        yield new WaitAction({ttl: 2000});
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'i\'ll have to deal with you myself...'});
        yield new WaitAction({ttl: 2000});
        // -- lookup raging bull
        let boss = this.lvl.first((v) => v.tag === 'boss.bull');
        if (!boss) return;
        // -- move to boss
        let path = this.lvl.pathfinder.find(this.actor, this.actor.idx, boss.idx);
        for (const action of path.actions) {
            if (action.x !== boss.xform.x && action.y !== boss.xform.y) {
                action.snap = false;
                action.stopAtTarget = false;
            }
            yield action;
        }
        //yield *path.actions;
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'pardon me if i feel a little bullish'});
        yield new WaitAction({ttl: 2000});
        // -- deactivate overbearer
        this.actor.active = false;
        this.actor.visible = false;
        // -- activate boss
        boss.active = true;
        // -- listen for boss death
        boss.evt.listen(boss.constructor.evtDeath, this.actor.onBossDeath, Events.once);
        yield new ApplyAction({
            target: player,
            action: new PanToActorAction({camera: camera}),
        }) 
        camera.trackTarget(player);


    }
}


class PowerupStealthAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
        this.lvl = spec.lvl;
    }
    *run() {
        console.log(`-- running power up stealth`);
        let camera = this.lvl.camera;
        let player = this.lvl.player;
        yield new PanToActorAction({camera: camera});
        camera.trackTarget(this.actor);
        // -- jump out of bull
        let choices = Random.shuffle(Direction.all);
        let jumpIdx;
        for (const dir of choices) {
            // anything at position?
            let idx = this.lvl.idxfromdir(this.actor.idx, dir);
            if (!this.lvl.anyidx(idx, (v) => v.blocks)) {
                jumpIdx = idx;
                break;
            }
        }
        if (jumpIdx !== undefined) {
            let x = this.lvl.xfromidx(jumpIdx, true);
            let y = this.lvl.yfromidx(jumpIdx, true);
            let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
            yield new MoveAction({
                x: x,
                y: y,
                accel: .001, 
                range: 2,
                stopAtTarget: true,
                facing: facing, 
                update: { idx: jumpIdx }, sfx: this.actor.moveSfx 
            });
        }
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'tis but a scratch'});
        yield new WaitAction({ttl: 2000});
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'do you really think you can stop me?'});
        yield new WaitAction({ttl: 2000});
        // -- lookup stealth bot
        let boss = this.lvl.first((v) => v.tag === 'boss.stealth');
        if (!boss) return;
        // -- move to boss
        let path = this.lvl.pathfinder.find(this.actor, this.actor.idx, boss.idx);
        for (const action of path.actions) {
            if (action.x !== boss.xform.x && action.y !== boss.xform.y) {
                action.snap = false;
                action.stopAtTarget = false;
            }
            yield action;
        }
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'now you see me... now you don\'t'});
        yield new WaitAction({ttl: 2000});
        // -- deactivate overbearer
        this.actor.active = false;
        this.actor.visible = false;
        // -- activate boss
        boss.active = true;
        // -- listen for boss death
        boss.evt.listen(boss.constructor.evtDeath, this.actor.onBossDeath, Events.once);
        yield new ApplyAction({
            target: player,
            action: new PanToActorAction({camera: camera}),
        }) 
        camera.trackTarget(player);
    }
}

class PowerupThumpAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
        this.lvl = spec.lvl;
    }
    *run() {
        console.log(`-- running power up thump`);
        let camera = this.lvl.camera;
        let player = this.lvl.player;
        yield new PanToActorAction({camera: camera});
        camera.trackTarget(this.actor);
        // -- jump out of last boss
        let choices = Random.shuffle(Direction.all);
        let jumpIdx;
        for (const dir of choices) {
            // anything at position?
            let idx = this.lvl.idxfromdir(this.actor.idx, dir);
            if (!this.lvl.anyidx(idx, (v) => v.blocks)) {
                jumpIdx = idx;
                break;
            }
        }
        if (jumpIdx !== undefined) {
            let x = this.lvl.xfromidx(jumpIdx, true);
            let y = this.lvl.yfromidx(jumpIdx, true);
            let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
            yield new MoveAction({
                x: x,
                y: y,
                accel: .001, 
                range: 2,
                stopAtTarget: true,
                facing: facing, 
                update: { idx: jumpIdx }, sfx: this.actor.moveSfx 
            });
        }
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'seriously?'});
        yield new WaitAction({ttl: 2000});
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'this is getting old...'});
        yield new WaitAction({ttl: 2000});
        // -- lookup boss bot
        let boss = this.lvl.first((v) => v.tag === 'boss.thump');
        console.log(`boss: ${boss}`);
        if (!boss) return;
        // -- move to boss
        let path = this.lvl.pathfinder.find(this.actor, this.actor.idx, boss.idx);
        for (const action of path.actions) {
            if (action.x !== boss.xform.x && action.y !== boss.xform.y) {
                action.snap = false;
                action.stopAtTarget = false;
            }
            yield action;
        }
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'can\'t listen to reason?'});
        yield new WaitAction({ttl: 2000});
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 2000, msg: 'maybe, you will listen to this...'});
        yield new WaitAction({ttl: 2000});
        // -- deactivate overbearer
        this.actor.active = false;
        this.actor.visible = false;
        // -- activate boss
        boss.active = true;
        // -- listen for boss death
        boss.evt.listen(boss.constructor.evtDeath, this.actor.onBossDeath, Events.once);
        yield new ApplyAction({
            target: player,
            action: new PanToActorAction({camera: camera}),
        }) 
        camera.trackTarget(player);
    }
}

class FinaleAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
        this.lvl = spec.lvl;
    }
    *run() {
        console.log(`-- running finale`);
        let camera = this.lvl.camera;
        let player = this.lvl.player;
        yield new PanToActorAction({camera: camera});
        camera.trackTarget(this.actor);
        // -- jump out of last boss
        let choices = Random.shuffle(Direction.all);
        let jumpIdx;
        for (const dir of choices) {
            // anything at position?
            let idx = this.lvl.idxfromdir(this.actor.idx, dir);
            if (!this.lvl.anyidx(idx, (v) => v.blocks)) {
                jumpIdx = idx;
                break;
            }
        }
        if (jumpIdx !== undefined) {
            let x = this.lvl.xfromidx(jumpIdx, true);
            let y = this.lvl.yfromidx(jumpIdx, true);
            let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
            yield new MoveAction({
                x: x,
                y: y,
                accel: .001, 
                range: 2,
                stopAtTarget: true,
                facing: facing, 
                update: { idx: jumpIdx }, sfx: this.actor.moveSfx 
            });
        }
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 1200, msg: 'wait, please... mercy!'});
        yield new WaitAction({ttl: 1500});

        // -- move to startIdx
        let path = this.lvl.pathfinder.find(this.actor, this.actor.idx, this.actor.startIdx);
        let tx = this.lvl.xfromidx(this.actor.startIdx, true);
        let ty = this.lvl.yfromidx(this.actor.startIdx, true);
        for (const action of path.actions) {
            console.log(`action: ${action} ${action.x},${action.y} target: ${tx},${ty}`);
            if (action.x !== tx && action.y !== ty) {
                action.snap = false;
                action.stopAtTarget = false;
            }
            yield action;
        }

        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 1200, msg: 'you don\'t understand!'});
        yield new WaitAction({ttl: 1500});
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 1000, msg: 'the machines...'});
        yield new WaitAction({ttl: 1200});
        Events.trigger(OverlaySystem.evtNotify, {which: 'dialog', actor: this.actor, ttl: 1000, msg: 'they need me...'});
        yield new WaitAction({ttl: 1200});

        
        // key
        // -- instantiate final key
        let x_key = Key.xspec({
            kind: 'blue',
            idx: this.actor.idx,
            z: Config.template.fgZed,
        });
        let key = LevelSystem.addEntity(x_key);
        
        // throw key at player
        let targetIdx = player.idx;
        console.log(`-- throw ${key}`);
        let action = new ThrowAction({
            needsDrop: false,
            needsDestroy: false,
            item: key,
            idx: targetIdx,
            //throwsfx: Assets.get('throw.shoot', true),
            //hitsfx: Assets.get('bomb.lands', true),
            x: this.lvl.xfromidx(targetIdx, true),
            y: this.lvl.yfromidx(targetIdx, true),
        });
        yield action;

        // unlock the room
        for (const door of this.lvl.find((v) => v.cls === 'Door' && v.boss)) {
            console.log(`-- unlocking ${door}`);
            door.locked = false;
        }
        
        // pan back to player
        yield new ApplyAction({
            target: player,
            action: new PanToActorAction({camera: camera}),
        }) 
        camera.trackTarget(player);
    }
}