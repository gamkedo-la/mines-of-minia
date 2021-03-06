export { Character };

import { DropLootAction } from "../actions/loot.js";
import { DestroyAction } from "../base/actions/destroy.js";
import { Config } from "../base/config.js";
import { Direction } from "../base/dir.js";
import { Fmt } from "../base/fmt.js";
import { Rect } from "../base/rect.js";
import { ActionSystem } from "../base/systems/actionSystem.js";
import { UpdateSystem } from "../base/systems/updateSystem.js";
import { Util } from "../base/util.js";
import { MiniaModel } from "./miniaModel.js";
import { RangedWeapon } from "./rangedWeapon.js";
import { Weapon } from "./weapon.js";

class Character extends MiniaModel {
    // STATIC VARIABLES ----------------------------------------------------
    static evtAggroGained = 'character.aggroGained';
    static evtAggroLost = 'character.aggroLost';
    static evtDamaged = 'character.damaged';
    static evtAttacked = 'character.attacked';
    static evtDeath = 'character.death';
    static dfltAggroTag = 'player';
    static dfltState = 'idle';
    static dfltAnimState = 'idler';
    static dfltTeam = 'passive';
    static dfltLvl = 1;
    static dfltAttackRolls = 1;
    static dfltDefenseRolls = 1;
    static dfltDamageReduction = 0;
    static dfltDeathTTL = 200;
    static dfltHealth = 1;
    static mobile = true;

    static get dfltMaxSpeed() {
        // distance over time
        // -- how long to traverse configured tile size
        return Config.tileSize/.3/1000;
    }

    static get dfltLosRange() {
        return Config.tileSize * 5;
    }

    static get dfltAggroRange() {
        return Config.tileSize * 5;
    }

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return new Rect({ width: 16, height: 16, color: 'rgba(255,255,0,.75)' });
    }
    static get dfltResistances() {
        let r = {}
        for (const kind of Weapon.kinds) {
            r[kind] = 0;
        }
        for (const kind of RangedWeapon.kinds) {
            r[kind] = 0;
        }
        return r;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        // -- sketch
        this._linkSketch('_sketch', spec.sketch || this.constructor.dfltSketch, false);
        this._sketch.link(this);
        // -- sync xform to match sketch dimensions
        this.xform.width = this.sketch.width;
        this.xform.height = this.sketch.height;
        // -- movement
        this.maxSpeed = spec.maxSpeed || this.constructor.dfltMaxSpeed;
        this.speed = 0;
        this.heading = Direction.asHeading(Direction.south);
        this.facing = Direction.east;
        // -- health
        this.healthMax = spec.healthMax || this.constructor.dfltHealth;
        this.health = spec.health || this.healthMax;
        this.deathTTL = spec.deathTTL || this.constructor.dfltDeathTTL;
        // -- attack/defense
        this.attackRolls = spec.attackRolls || this.constructor.dfltAttackRolls;
        this.defenseRolls = spec.defenseRolls || this.constructor.dfltDefenseRolls;
        this._damageReduction = spec.damageReduction || this.constructor.dfltDamageReduction;
        this.resistances = Object.assign(this.constructor.dfltResistances, spec.resistances);
        // -- line of sight
        this.losRange = spec.losRange || this.constructor.dfltLosRange;
        this.losIdxs = [];
        // -- aggro
        this.aggroRange = spec.aggroRange || this.constructor.dfltAggroRange;
        this.aggroTag = spec.aggroTag || this.constructor.dfltAggroTag;
        this.aggroIdx = -1;
        this.team = spec.team || this.constructor.dfltTeam;
        this.lvl = spec.lvl || this.constructor.dfltLvl;
        // -- action stream
        this.actionStream = this.dfltActionGenerator();
        // -- state management
        this.state = spec.state || this.constructor.dfltState;
        this.animState = spec.animState || this.constructor.dfltAnimState;
        // -- charms (buffs/debuffs)
        this.charms = [];
        if (spec.charms) spec.charms.map((this.addCharm.bind(this)));
        // -- loot
        this.loot = spec.loot || [];
        // -- events
        this.onDamaged = this.onDamaged.bind(this);
        this.onDeath = this.onDeath.bind(this);
        this.onIntentForAnimState = this.onIntentForAnimState.bind(this);
        this.evt.listen(this.constructor.evtDamaged, this.onDamaged);
        this.evt.listen(this.constructor.evtDeath, this.onDeath);
        this.evt.listen(this.constructor.evtIntent, this.onIntentForAnimState);
    }

    destroy() {
        console.log(`=== ${this} destroy called`)
        this._unlinkSketch('_sketch');
        for (const charm of this.charms) {
            charm.unlink();
        }
        this.charms = [];
        super.destroy();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            x_sketch: { cls: 'AssetRef', tag: this._sketch.tag },
            maxSpeed: this.maxSpeed,
            healthMax: this.healthMax,
            health: this.health,
            deathTTL: this.deathTTL,
            attackRolls: this.attackRolls,
            defenseRolls: this.defenseRolls,
            damageReduction: this._damageReduction,
            resistances: this.resistances,
            losRange: this.losRange,
            aggroRange: this.aggroRange,
            aggroTag: this.aggroTag,
            team: this.team,
            lvl: this.lvl,
            state: this.state,
            animState: this.animState,
            x_charms: this.charms.map((v) => v.as_kv()),
            loot: this.loot,
        });
    }

    // PROPERTIES ----------------------------------------------------------
    get damageReduction() {
        return this._damageReduction;
    }
    get sketch() {
        return this._sketch;
    }
    set sketch(v) {
        if (!v) return;
        if (v !== this._sketch) {
            this._linkSketch('_sketch', v);
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onDamaged(evt) {
        let health = this.health - evt.damage;
        //console.log(`${this} onDamaged: ${Fmt.ofmt(evt)} health: ${health}`);
        if (health > 0) {
            UpdateSystem.eUpdate(this, { health: health });
        } else {
            if (this.state !== 'dying') this.evt.trigger(this.constructor.evtDeath, { actor: this });
        }
        //console.log(`player health after damage: ${this.health}`);
    }

    onDeath(evt) {
        if (this.state !== 'dying') {
            let wantAnimState = (this.facing === Direction.east) ? 'dyingr' : 'dyingl';
            UpdateSystem.eUpdate(this, { state: 'dying', health: 0, animState: wantAnimState });
            // spawn any loot
            for (let loot of (this.loot || [])) {
                ActionSystem.assign(this, new DropLootAction({
                    lootSpec: loot,
                }));
            }
            // destroy
            ActionSystem.assign(this, new DestroyAction({
                ttl: this.deathTTL,
            }));
        }
    }

    onIntentForAnimState(evt) {
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
    }

    // METHODS -------------------------------------------------------------
    *dfltActionGenerator() {
        return null;
    }

    show() {
        this._sketch.show();
    }

    hide() {
        this._sketch.hide();
    }

    addCharm(charm) {
        this.charms.push(charm);
        charm.link(this);
    }
    removeCharm(charm) {
        let idx = this.charms.indexOf(charm);
        if (idx !== -1) this.charms.splice(idx, 1);
        charm.unlink();
    }

    _render(ctx) {
        // update sketch dimensions
        this._sketch.width = this.xform.width;
        this._sketch.height = this.xform.height;
        // render
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}