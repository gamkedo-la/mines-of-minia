export { Enemy };

import { AiMeleeTargetDirective } from '../ai/aiMeleeTargetDirective.js';
import { AiMoveToIdxDirective } from '../ai/aiMoveToIdxDirective.js';
import { AiMoveTowardsTargetDirective } from '../ai/aiMoveTowardsTargetDirective.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { LvlVar } from '../lvlVar.js';
import { Character } from './character.js';

class Enemy extends Character {
    // default aggro range (in pixels)
    static dfltMeleeRange = 31;
    static dfltAttackRating = 10;
    static dfltDefenseRating = 10;
    static dfltAttackKind = 'bonk';
    static dfltHealth = 1;
    static dfltDamage = 1;
    static dfltXp= 1;
    static dfltDamageScale = 1.25;
    // generator info
    static gHealth = new LvlVar({ base: 1 });
    static gXp = new LvlVar({ base: 1 });
    static gAttackRating = new LvlVar({ base: 10 });
    static gDefenseRating = new LvlVar({ base: 10 });
    static gDamageMin = new LvlVar({ base: 1 });
    static gDamageMax = new LvlVar({ base: 1 });

    // STATIC METHODS ------------------------------------------------------

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this.meleeRange = spec.meleeRange || this.constructor.dfltMeleeRange;
        this.attackRating = spec.attackRating || this.constructor.dfltAttackRating;
        this.defenseRating = spec.defenseRating || this.constructor.dfltDefenseRating;
        // -- xp value
        this.xp = spec.xp || this.constructor.dfltXp;
        // -- damage
        this.attackKind = spec.attackKind || this.constructor.dfltAttackKind;
        this.baseDamageMin = spec.baseDamageMin || this.constructor.dfltDamage;
        this.baseDamageMax = spec.baseDamageMax || this.constructor.dfltDamage;
        this.damageScale = spec.damageScale || this.constructor.dfltDamageScale;
        // -- bind event handlers
        this.onLevelLoaded = this.onLevelLoaded.bind(this);
        this.onAggro = this.onAggro.bind(this);
        this.onAggroLost = this.onAggroLost.bind(this);
        Events.listen('lvl.loaded', this.onLevelLoaded, Events.once);
        this.evt.listen(this.constructor.evtAggroGained, this.onAggro);
        this.evt.listen(this.constructor.evtAggroLost, this.onAggroLost);
        this.active = false;
        this.activateOnLoad = (spec.hasOwnProperty('activateOnLoad')) ? spec.activateOnLoad : true;
        this.actions;
    }

    destroy() {
        this.evt.ignore(this.constructor.evtAggroGained, this.onAggro);
        super.destroy();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            meleeRange: this.meleeRange,
            attackRating: this.attackRating,
            defenseRating: this.defenseRating,
            xp: this.xp,
            attackKind: this.attackKind,
            baseDamageMin: this.baseDamageMin,
            baseDamageMax: this.baseDamageMax,
            damageScale: this.damageScale,
        });
    }

    // PROPERTIES ----------------------------------------------------------
    get damageMin() {
        return Math.round(this.baseDamageMin*this.lvl*(this.damageScale-1));
    }
    get damageMax() {
        return Math.round(this.baseDamageMax*this.lvl*(this.damageScale-1));
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        let lvl = evt.lvl;
        // setup directives
        let x_dir = {
            lvl: lvl,
            actor: this,
        }
        this.move = new AiMoveTowardsTargetDirective(x_dir);
        this.search = new AiMoveToIdxDirective(x_dir);
        this.attack = new AiMeleeTargetDirective(x_dir);
        //if (this.cls === 'Scarab') this.move.dbg = true;
        //if (this.cls === 'Scarab') this.attack.dbg = true;
        this.actionStream = this.run();
        // activate
        if (this.activateOnLoad) this.active = true;
    }

    // METHODS -------------------------------------------------------------
    // run state action generator
    *run() {
        while (!this.done) {
            switch (this.state) {
            case 'idle':
                yield null;
                break;
            case 'search':
                // attempt to move within range
                yield *this.search.run();
                // go back to idle state if search ends
                if (this.search.done) {
                    UpdateSystem.eUpdate(this, {state: 'idle'});
                    this.actionStream = this.run();
                    yield null;
                }
                break;
            case 'melee':
                // attempt to move within range
                yield *this.move.run();
                // attack while in range
                yield *this.attack.run();
                // prevent tight loops in run loop if move/attack both fail
                if (!this.move.ok && !this.attack.ok) yield null;
                break;
            default:
                yield null;
            }
        }
    }

    onDeath(evt) {
        if (this.state !== 'dying') {
            //console.log(`=== resetting action stream`);
            this.actionStream = this.run();
        }
        super.onDeath(evt);
    }

    onAggro(evt) {
        if (!this.active) return;
        //console.log(`${this} aggrod ${Fmt.ofmt(evt)}}`);
        this.move.target = evt.target;
        this.attack.target = evt.target;
        UpdateSystem.eUpdate(this, {state: 'melee'});
        this.actionStream = this.run();
    }

    onAggroLost(evt) {
        if (!this.active) return;
        //console.log(`${this} aggro lost ${Fmt.ofmt(evt)}}`);
        this.search.targetIdx = evt.lastIdx;
        UpdateSystem.eUpdate(this, {state: 'search'});
        this.actionStream = this.run();
    }

}