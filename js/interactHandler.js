export { InteractHandler };

import { MeleeAttackAction } from './actions/attack.js';
import { InteractAction } from './actions/interact.js';
import { OpenAction } from './actions/open.js';
import { PickupAction } from './actions/pickup.js';
import { TakeStairsAction } from './actions/takeStairs.js';
import { AiMoveToIdxDirective } from './ai/aiMoveToIdxDirective.js';
import { MoveAction } from './base/actions/move.js';
import { WaitAction } from './base/actions/wait.js';
import { Assets } from './base/assets.js';
import { Direction } from './base/dir.js';
import { Entity } from './base/entity.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Keys } from './base/keys.js';
import { Pathfinder } from './base/pathfinder.js';
import { MouseSystem } from './base/systems/mouseSystem.js';
import { Vect } from './base/vect.js';
import { Enemy } from './entities/enemy.js';
import { Stairs } from './entities/stairs.js';
import { LevelGraph } from './lvlGraph.js';
import { TurnSystem } from './systems/turnSystem.js';

/**
 * A mini-state to handle inputs during player turn
 */
class InteractHandler extends Entity {
    cpost(spec) {
        super.cpost(spec);
        this.lvl = spec.lvl;
        this.player = spec.player;
        this.overlay = spec.overlay;
        this.doInventory = spec.doInventory;
        this.doTalents = spec.doTalents;
        this.doOptions = spec.doOptions

        // -- pathfinding
        this.lvlgraph = new LevelGraph({
            lvl: this.lvl,
        })
        this.pathfinder = new Pathfinder({
            graph: this.lvlgraph,
            heuristicFcn: this.lvl.idxdist.bind(this.lvl),
            dbg: false,
        });

        // bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onLevelClick = this.onLevelClick.bind(this);
        this.onMouseMoved = this.onMouseMoved.bind(this);
        this.lvl.evt.listen(this.lvl.constructor.evtMouseClicked, this.onLevelClick);
        Events.listen(Keys.evtDown, this.onKeyDown);
        Events.listen(MouseSystem.evtMoved, this.onMouseMoved);
    }

    destroy() {
        super.destroy();
        //this.reticle.destroy();
        this.lvl.evt.ignore(this.lvl.constructor.evtMouseClicked, this.onLevelClick);
        Events.ignore(Keys.evtDown, this.onKeyDown);
        Events.ignore(MouseSystem.evtMoved, this.onMouseMoved);
    }

    onKeyDown(evt) {
        //console.log(`-- ${this.constructor.name} onKeyDown: ${Fmt.ofmt(evt)}`);
        switch (evt.key) {

            case 'q': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.northWest);
                this.interactIdx(nidx);
                break;
            }

            case 'w': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.north);
                this.interactIdx(nidx);
                break;
            }

            case 'e': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.northEast);
                this.interactIdx(nidx);
                break;
            }

            case 'a': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.west);
                this.interactIdx(nidx);
                break;
            }

            case 'd': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.east);
                this.interactIdx(nidx);
                break;
            }

            case 'z': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.southWest);
                this.interactIdx(nidx);
                break;
            }

            case 'x': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.south);
                this.interactIdx(nidx);
                break;
            }

            case 'c': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.southEast);
                this.interactIdx(nidx);
                break;
            }

            case 'i': {
                this.doInventory();
                break;
            }

            case 't': {
                this.doTalents();
                break;
            }

            case ' ': {
                this.wait();
                console.log(`-- player health: ${this.player.health}/${this.player.healthMax} fuel: ${this.player.fuel} power: ${this.player.power} xp: ${this.player.xp}`);
                break;
            }

            case 'Escape': {
                this.doOptions();
                break;
            }

        }
    }

    onLevelClick(evt) {
        console.log(`================================================================================`);
        console.log(`-- state onLevelClick`);
        let lmouse = this.lvl.xform.getLocal(new Vect(evt.mouse.x, evt.mouse.y));
        let idx = this.lvl.idxfromxy(lmouse.x, lmouse.y);
        console.log(`-- local: ${lmouse} idx: ${idx}`);
        this.dbg = true;

        let directive = new AiMoveToIdxDirective({
            lvl: this.lvl,
            actor: this.player,
            targetIdx: idx,
        });

        Events.trigger('handler.wanted', {which: 'directive', directive: directive});
        this.destroy();
    }

    onMouseMoved(evt) {
        /*
        //console.log(`-- ${this} onMouseMoved: ${Fmt.ofmt(evt)}`);

        let lmouse = this.lvl.xform.getLocal(new Vect(evt.x, evt.y));
        let idx = this.lvl.idxfromxy(lmouse.x, lmouse.y);

        // update reticle
        // index in player los?
        let aimok = this.player.losIdxs.includes(idx);
        if (aimok !== this.aimok) {
            let sketch = Assets.get((aimok) ? 'reticle.aim.ok' : 'reticle.aim.nok', true);
            this.reticle.sketch = sketch;
            this.aimok = aimok;
        }

        //console.log(`-- ${this} aimok: ${aimok} idx: ${idx} los: ${this.player.losIdxs}`);

        // update position
        let x = this.lvl.grid.xfromidx(idx, true);
        let y = this.lvl.grid.yfromidx(idx, true);
        if (x !== this.reticle.xform.x || y !== this.reticle.xform.y) {
            UpdateSystem.eUpdate(this.reticle, {
                xform: {
                    x: x,
                    y: y,
                },
            });
        }
        */

    }

    interactIdx(idx) {
        let x = this.lvl.xfromidx(idx, true);
        let y = this.lvl.yfromidx(idx, true);
        let facing = (x > this.player.xform.x) ? Direction.east : (x < this.player.xform.x) ? Direction.west : 0;
        // what's at index?
        let others = Array.from(this.lvl.findidx(idx, (v) => v.idx === idx));
        let tookAction = true;
        if (others.some((v) => v.active && v instanceof Enemy && v.state !== 'dying')) {
            let target = others.find((v) => v instanceof Enemy);
            TurnSystem.postLeaderAction( new MeleeAttackAction({
                target: target,
                points: this.player.pointsPerTurn,
            }));
        } else if (others.some((v) => v.constructor.lootable)) {
            let target = others.find((v) => v.constructor.lootable);
            TurnSystem.postLeaderAction( new PickupAction({ points: this.player.pointsPerTurn, target: target, sfx: Assets.get('player.pickup', true)}));
        } else if (others.some((v) => v.constructor.interactable)) {
            let target = others.find((v) => v.constructor.interactable);
            TurnSystem.postLeaderAction( new InteractAction({ points: this.player.pointsPerTurn, target: target }));
        } else if (others.some((v) => v instanceof Stairs)) {
            let target = others.find((v) => v instanceof Stairs);
            TurnSystem.postLeaderAction( new MoveAction({ points: this.player.pointsPerTurn, x:x, y:y, accel: .001, snap: true, facing: facing, update: { idx: idx }, sfx: this.player.moveSfx }));
            TurnSystem.postLeaderAction( new TakeStairsAction({ points: this.player.pointsPerTurn, stairs: target }));
        } else if (others.some((v) => v.constructor.openable)) {
            let target = others.find((v) => v.constructor.openable);
            if (target.state === 'close') {
                TurnSystem.postLeaderAction( new OpenAction({ points: this.player.pointsPerTurn, target: target }));
            } else {
                TurnSystem.postLeaderAction( new MoveAction({ points: this.player.pointsPerTurn, x:x, y:y, accel: .001, snap: true, facing: facing, update: { idx: idx }, sfx: this.player.moveSfx }));
            }
        } else if (others.some((v) => this.player.blockedBy & v.blocks)) {
            tookAction = false;
        } else {
            TurnSystem.postLeaderAction( new MoveAction({ points: this.player.pointsPerTurn, x:x, y:y, accel: .001, snap: true, facing: facing, update: { idx: idx }, sfx: this.player.moveSfx }));
        }

        if (tookAction) this.destroy();
    }

    wait() {
        TurnSystem.postLeaderAction(new WaitAction({ points: this.player.pointsPerTurn }));
        this.destroy();
    }

    
}