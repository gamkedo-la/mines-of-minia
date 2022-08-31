export { ThumpBot }

import { AiBombTargetDirective } from '../ai/aiBombTargetDirective.js';
import { AiThumpTargetDirective } from '../ai/aiThumpTargetDirective.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Prng } from '../base/prng.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Enemy } from './enemy.js';


/**
 * stationary boss that throws bombs and thumps players in melee range
 * -- bombs thrown at player will take several turns to explode, giving player time to get out of blast radius
 * -- if player is in melee range, thump attack will charge
 * -- once charged, thump attack triggers and if it hits player will thump player back a few tiles with significant damage
 */
class ThumpBot extends Enemy {
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
            attackRating: 75,
            x_sketch: Assets.get('thumpBot'),
            maxSpeed: Config.tileSize/.3/1000,
            losRange: Config.tileSize*14,
            aggroRange: Config.tileSize*14,
            deathTTL: 1000,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.bombRange = spec.bombRange || Config.tileSize*3;
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
        this.active = true;
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