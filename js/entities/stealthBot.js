export { StealthBot }

import { RevealAction } from '../actions/reveal.js';
import { AiHideDirective } from '../ai/aiHideDirective.js';
import { AiMeleeTargetDirective } from '../ai/aiMeleeTargetDirective.js';
import { AiMoveToRangeDirective } from '../ai/aiMoveToRangeDirective.js';
import { AiMoveTowardsTargetDirective } from '../ai/aiMoveTowardsTargetDirective.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Fmt } from '../base/fmt.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { DazedCharm } from '../charms/dazed.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';

/**
 * boss that uses stealth to sneak up on player
 * -- slips into stealth
 * -- will proceed directly to player (in stealth)
 * -- if revealed, will continue attack run, but player can get in first hit
 * -- if not revealed, will attack from stealth, dazing the player for a turn
 * -- after attacking or being attacked, will move to range and re-enter stealth
 */
class StealthBot extends Enemy {
    static gHealth = new LvlVar({ baseMin: 20, baseMax: 25, perLvlMin: 2, perLvlMax: 4 } );
    static gXp = new LvlVar({ base: 30, perLvl: 8 } );

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( {}, this.spec, {
            attackRating: 75,
            x_sketch: Assets.get('sneak'),
            maxSpeed: Config.tileSize/.3/1000,
            losRange: Config.tileSize*14,
            aggroRange: Config.tileSize*14,
            baseDamageMin: 4,
            baseDamageMin: 8,
            attackKind: 'hack',
            deathTTL: 1000,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.rangeMin = spec.rangeMin || Config.tileSize*3;
        this.rangeMax = spec.rangeMax || Config.tileSize*8;
        // event handlers
        this.onAttackTarget = this.onAttackTarget.bind(this);
        this.evt.listen(this.constructor.evtAttacked, this.onAttackTarget);
        this.attackFromStealth = false;
        if (spec.elvl) this.linkLevel(spec.elvl);
    }
    destroy(spec) {
        super.destroy();
        this.evt.ignore(this.constructor.evtAttacked, this.onAttackTarget);
    }
 
    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            rangeMin: this.rangeMin,
            rangeMax: this.rangeMax,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        this.linkLevel(evt.lvl);
        if (this.activateOnLoad) this.active = true;
    }

    onAggro(evt) {
        if (!this.active) return;
        //console.log(`${this} aggrod ${Fmt.ofmt(evt)}}`);
        this.approach.target = evt.target;
        this.stealth.target = evt.target;
        this.retreat.target = evt.target;
        this.attack.target = evt.target;
        UpdateSystem.eUpdate(this, {state: 'stealth'});
    }

    onDamaged(evt) {
        super.onDamaged(evt);
        if (this.hidden) ActionSystem.assign(this, new RevealAction({lvl: this.elvl}));
        // if attacking, stop attack
        if (this.state === 'approach') {
            let dazed = new DazedCharm();
            this.addCharm(dazed);
            console.log(`-- caught by player, stun applied`);
            this.approach.stop(false);
        } else {
            this.attack.stop();
        }
    }

    onAttackTarget(evt) {
        if (evt.target && this.attackFromStealth) {
            let dazed = new DazedCharm();
            console.log(`-- attack from stealth: apply ${dazed} to ${evt.target}`);
            evt.target.addCharm(dazed);
        }
        this.attackFromStealth = false;
    }

    // METHODS -------------------------------------------------------------

    linkLevel(lvl) {
        this.elvl = lvl;
        // setup directives
        let x_dir = {
            lvl: lvl,
            actor: this,
        }
        this.approach = new AiMoveTowardsTargetDirective(x_dir);
        this.stealth = new AiHideDirective(x_dir);
        this.retreat = new AiMoveToRangeDirective(x_dir);
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

            case 'stealth':
                // attempt to move within range
                yield *this.stealth.run();
                // -- if stealth ok...
                if (this.stealth.ok) {
                    // move to engage
                    console.log(`-- stealth ok, approach`);
                    UpdateSystem.eUpdate(this, {state: 'approach'});
                } else {
                    console.log(`-- stealth failed, retreat`);
                    UpdateSystem.eUpdate(this, {state: 'retreat'});
                }
                break;

            case 'approach':
                yield *this.approach.run();
                if (this.approach.ok) {
                    // approach transitions to attack
                    console.log(`-- approach is done, melee`);
                    UpdateSystem.eUpdate(this, {state: 'melee'});
                } else {
                    console.log(`-- approach failed, retreat`);
                    UpdateSystem.eUpdate(this, {state: 'retreat'});
                }
                break;

            case 'melee':
                if (this.hidden) {
                    ActionSystem.assign(this, new RevealAction({lvl: this.elvl}));
                    this.attackFromStealth = true;
                } else {
                    this.attackFromStealth = false;
                }
                yield *this.attack.run();
                console.log(`-- melee done, retreat`);
                UpdateSystem.eUpdate(this, {state: 'retreat'});
                break;

            case 'retreat':
                yield *this.retreat.run();
                console.log(`-- retreat done, hide`);
                UpdateSystem.eUpdate(this, {state: 'stealth'});
                break;

            default:
                yield null;
            }
        }
    }

}