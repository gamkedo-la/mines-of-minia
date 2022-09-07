export { RagingBull };

import { AiChargeDirective } from '../ai/aiChargeDirective.js';
import { AiEnergizeDirective } from '../ai/aiEnergizeDirective.js';
import { AiMeleeTargetDirective } from '../ai/aiMeleeTargetDirective.js';
import { AiMoveToAlign } from '../ai/aiMoveToAlign.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Prng } from '../base/prng.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { DazedCharm } from '../charms/dazed.js';
import { Enemy } from './enemy.js';

/**
 * mechanical bull type enemy
 * -- charges player pushing them to wall and does significant damage
 * -- will try to align with player along cardinals, energizes, then charges
 * -- if player engages in melee combat, behavior will change to reduce energize/charge timers and will charge on diagonals
 * -- if charge fails to hit player, bull will be dazed for X rounds
 * -- if charge hits player, player will be dazed for X rounds (and bull will engage in melee)
 */
class RagingBull extends Enemy{
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // parse lvl
        let lvl = spec.lvl || 1;
        // health
        let health = Prng.rangeInt(3,8);
        for (let i=1; i<lvl; i++) health += Prng.rangeInt(1,3);
        // final spec
        return Object.assign( {}, this.spec, {
            xp: 5,
            healthMax: health,
            x_sketch: Assets.get('bull'),
            maxSpeed: Config.tileSize/.3/1000,
            losRange: Config.tileSize*14,
            aggroRange: Config.tileSize*14,
            deathTTL: 1000,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.enraged = false;
        if (spec.elvl) this.linkLevel(spec.elvl);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        this.linkLevel(evt.lvl);
    }

    onAggro(evt) {
        if (!this.active) return;
        //console.log(`${this} aggrod ${Fmt.ofmt(evt)}}`);
        this.move.target = evt.target;
        this.energize.target = evt.target;
        this.charge.target = evt.target;
        this.attack.target = evt.target;
        UpdateSystem.eUpdate(this, {state: 'align'});
        this.actionStream = this.run();
    }

    onAggroLost(evt) {
        if (!this.active) return;
        //console.log(`${this} aggro lost ${Fmt.ofmt(evt)}}`);
        //this.search.targetIdx = evt.lastIdx;
        UpdateSystem.eUpdate(this, {state: 'idle'});
        this.actionStream = this.run();
    }

    onDamaged(evt) {
        super.onDamaged(evt);
        // -- enrage (if not stunned)
        if (!this.enraged && !DazedCharm.isDazed(this)) {
            console.log(`-- setting enraged`);
            UpdateSystem.eUpdate(this, {enraged: true});
            // stop current directive
            this.move.stop();
            this.energize.stop();
            this.attack.stop();
            // set charge to include diagonals
            this.charge.diagonal = true;
        }
    }

    onIntentForAnimState(evt) {
        if (!evt.update) return;
        // keep track of last index
        if (evt.update.hasOwnProperty('idx') && this.lastIdx !== evt.update.idx) {
            this.lastIdx = this.idx;
        }
        // determine base animation state
        let state = evt.update.state || this.state;
        let baseAnim;
        // dazed?
        if (DazedCharm.isDazed(this)) {
            baseAnim = 'stun';
        // moving?
        } else if (evt.update.speed || this.speed && !evt.update.hasOwnProperty('speed')) {
            if (state === 'charge') {
                baseAnim = 'charge';
            } else {
                baseAnim = 'move';
            }
        // change anim based on state
        } else {
            switch (state) {
                case 'energize':
                    baseAnim = 'energize';
                    break;
                case 'charge':
                    baseAnim = 'charge';
                    break;
                default:
                    baseAnim = 'idle';
                    break;
            }
        }
        let facing = evt.update.facing || this.facing;
        let rl = (facing === Direction.east) ? 'r' : 'l';
        let wantAnim = `${baseAnim}${rl}`;
        if (wantAnim !== this.animState) {
            evt.update.animState = wantAnim;
        }
        /*
        // transition to idle state
        let update = {};
        if (evt.update && evt.update.hasOwnProperty('idx')) {
            //console.log(`-- ${this} idx update idx: ${evt.update.idx} last: ${this.lastIdx}`);
            if (this.lastIdx !== evt.update.idx) {
                let wantAnimState = (this.facing === Direction.east) ? 'idler' : 'idlel';
                if (wantAnimState !== this.animState) update.animState = wantAnimState;
                this.lastIdx = this.idx;
            }
        // transition to idle state
        } else if (evt.update && evt.update.hasOwnProperty('speed') && evt.update.speed === 0) {
            let wantAnimState = (this.facing === Direction.east) ? 'idler' : 'idlel';
            if (wantAnimState !== this.animState) update.animState = wantAnimState;
        // transition to move state
        } else if (evt.update && evt.update.xform && (evt.update.xform.hasOwnProperty('x') || evt.update.xform.hasOwnProperty('y'))) {
            let wantAnimState = (this.facing === Direction.east) ? 'mover' : 'movel';
            if (wantAnimState !== this.animState) update.animState = wantAnimState;
        }
        if (!Util.empty(update)) {
            //console.log(`-- ${this} trigger evt update: state: ${Fmt.ofmt(update)}`);
            Object.assign(evt.update, update);
        }
        */
    }

    // METHODS -------------------------------------------------------------

    linkLevel(lvl) {
        if (!lvl) return;
        // setup directives
        let x_dir = {
            lvl: lvl,
            actor: this,
        }
        this.move = new AiMoveToAlign(x_dir);
        this.energize = new AiEnergizeDirective(x_dir);
        this.charge = new AiChargeDirective(x_dir);
        this.attack = new AiMeleeTargetDirective(x_dir);
        this.actionStream = this.run();
        // activate
        //this.active = true;
    }

    // run state action generator
    *run() {
        while (!this.done) {
            switch (this.state) {
            case 'idle':
                yield null;
                break;

            case 'align':
                // attempt to move within range
                yield *this.move.run();
                // -- enraged
                if (this.enraged) {
                    console.log(`-- bull move stopped, enraged`);
                    UpdateSystem.eUpdate(this, {state: 'charge'});
                // -- within range
                } else if (this.move.getTargetRange() <= this.meleeRange) {
                    console.log(`-- bull move within range, running melee`);
                    UpdateSystem.eUpdate(this, {state: 'melee'});
                } else if (this.move.ok) {
                // -- move ok
                    console.log(`-- bull move ok, running energize`);
                    UpdateSystem.eUpdate(this, {state: 'energize', animState: 'energize'});
                // -- move failed
                } else {
                    console.log(`-- bull move failed`);
                    // FIXME: shouldn't go back to idle here... create a wait state?
                    UpdateSystem.eUpdate(this, {state: 'idle'});
                    yield null;
                }
                break;

            case 'energize':
                // energize charge
                yield *this.energize.run();
                console.log(`-- energize done`);
                if (this.enraged || this.energize.ok) {
                    console.log(`-- bull energize enraged or ok`);
                    UpdateSystem.eUpdate(this, {state: 'charge'});
                } else {
                    console.log(`-- bull energize failed`);
                    UpdateSystem.eUpdate(this, {state: 'align'});
                }
                break;

            case 'charge':
                // perform charge
                yield *this.charge.run();
                console.log(`-- charge done start align again`);
                // transition to melee, reset enraged
                UpdateSystem.eUpdate(this, {state: 'melee', enraged: false});
                // reset charge direction
                this.charge.diagonal = false;
                break;

            case 'melee':
                // perform charge
                yield *this.attack.run();
                console.log(`-- attack done start align again`);
                UpdateSystem.eUpdate(this, {state: 'align'});
                break;

            default:
                yield null;
            }
        }
    }

}