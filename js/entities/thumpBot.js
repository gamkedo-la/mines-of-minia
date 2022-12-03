export { ThumpBot }

import { AiBombTargetDirective } from '../ai/aiBombTargetDirective.js';
import { AiThumpTargetDirective } from '../ai/aiThumpTargetDirective.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';


/**
 * stationary boss that throws bombs and thumps players in melee range
 * -- bombs thrown at player will take several turns to explode, giving player time to get out of blast radius
 * -- if player is in melee range, thump attack will charge
 * -- once charged, thump attack triggers and if it hits player will thump player back a few tiles with significant damage
 */
class ThumpBot extends Enemy {
    static dfltAnimState = 'idle.west';
    static mobile = false;
    static gHealth = new LvlVar({ baseMin: 40, baseMax: 50, perLvlMin: 3, perLvlMax: 6 } );
    static gXp = new LvlVar({ base: 50, perLvl: 10 } );
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( {}, this.spec, {
            attackRating: 75,
            x_sketch: Assets.get('thumpBot'),
            maxSpeed: Config.tileSize/.3/1000,
            losRange: Config.tileSize*14,
            aggroRange: Config.tileSize*14,
            deathTTL: 1000,
            attackKind: 'bonk',
            baseDamageMin: 5,
            baseDamageMin: 15,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.bombRange = spec.bombRange || Config.tileSize*3;
        this.xform.offx = -this.xform.width*.5;
        this.xform.offy = -Config.tileSize*.5-this.xform.height*.5;
        // event handlers
        if (spec.elvl) this.linkLevel(spec.elvl);
    }
    destroy(spec) {
        super.destroy();
        this.evt.ignore(this.constructor.evtAttacked, this.onAttackTarget);
    }
 
    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            bombRange: this.bombRange,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        this.linkLevel(evt.lvl);
        // activate
        if (this.activateOnLoad) this.active = true;
    }

    onAggro(evt) {
        if (!this.active) return;
        this.bomb.target = evt.target;
        this.attack.target = evt.target;
        UpdateSystem.eUpdate(this, {state: 'bomb'});
    }

    onAggroLost(evt) {
        if (!this.active) return;
        UpdateSystem.eUpdate(this, {state: 'idle'});
        this.actionStream = this.run();
    }

    onIntentForAnimState(evt) {
        /*
        if (!evt.update) return;
        // keep track of last index
        if (evt.update.hasOwnProperty('idx') && this.lastIdx !== evt.update.idx) {
            this.lastIdx = this.idx;
        }
        // determine base animation state
        let state = evt.update.state || this.state;
        let baseAnim;
        // dazed?
        let update = {};
        if (DazedCharm.isDazed(this)) {
            baseAnim = 'stun';
            if (this.state !== 'align') update.state = 'align';
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
            update.animState = wantAnim;
            //console.log(`want anim: ${wantAnim} current: ${this.animState} trigger`);
        }
        if (!Util.empty(update)) {
            UpdateSystem.eUpdate(this, update);
        }
        */
    }

    // METHODS -------------------------------------------------------------
    linkLevel(lvl) {
        this.elvl = lvl;
        // setup directives
        let x_dir = {
            lvl: lvl,
            actor: this,
        }
        this.bomb = new AiBombTargetDirective(x_dir);
        this.attack = new AiThumpTargetDirective(Object.assign({knockback: 3}, x_dir));
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

            case 'bomb':
                // attempt to move within range
                yield *this.bomb.run();
                // -- bomb is done... attempt melee
                UpdateSystem.eUpdate(this, {state: 'melee'});
                break;

            case 'melee':
                // attempt to move within range
                yield *this.attack.run();
                // -- bomb is done... attempt melee
                UpdateSystem.eUpdate(this, {state: 'bomb'});
                break;

            default:
                yield null;
            }
        }
    }
}