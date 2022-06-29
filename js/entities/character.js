export { Character };

import { Direction } from "../base/dir.js";
import { Fmt } from "../base/fmt.js";
import { Rect } from "../base/rect.js";
import { UpdateSystem } from "../base/systems/updateSystem.js";
import { Timer } from "../base/timer.js";
import { MiniaModel } from "./miniaModel.js";
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
    static dfltTeam = 'passive';
    static dfltLvl = 1;
    static dfltAttackRolls = 1;
    static dfltDefenseRolls = 1;
    static dfltDamageReduction = 0;
    static dfltDeathTTL = 200;
    static dfltHealth = 1;

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return new Rect({ width: 16, height: 16, color: 'rgba(255,255,0,.75)' });
    }
    static get dfltResistances() {
        let r = {}
        for (const kind of Weapon.kinds) {
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
        this.maxSpeed = spec.maxSpeed || 0;
        this.speed = 0;
        this.heading = Direction.asHeading(Direction.south);
        // -- health
        this.healthMax = spec.healthMax || this.constructor.dfltHealth;
        this.health = spec.health || this.healthMax;
        this.deathTTL = spec.deathTTL || this.constructor.dfltDeathTTL;
        // -- attack/defense
        this.attackRolls = spec.attackRolls || this.constructor.dfltAttackRolls;
        this.defenseRolls = spec.defenseRolls || this.constructor.dfltDefenseRolls;
        this.damageReduction = spec.damageReduction || this.constructor.dfltDamageReduction;
        this.resistances = Object.assign(this.constructor.dfltResistances, spec.resistances);
        // -- line of sight
        this.losRange = spec.losRange || 0;
        // -- aggro
        this.aggroRange = spec.aggroRange || 0;
        this.aggroTag = spec.aggroTag || this.constructor.dfltAggroTag;
        this.team = spec.team || this.constructor.dfltTeam;
        this.lvl = spec.lvl || this.constructor.dfltLvl;
        // -- action stream
        this.actionStream = this.dfltActionGenerator();
        // -- state management
        this.states = {};
        this.state = spec.state || this.constructor.dfltState;
        // -- charms (buffs/debuffs)
        this.charms = [];
        // -- events
        this.onDamaged = this.onDamaged.bind(this);
        this.onDeath = this.onDeath.bind(this);
        this.evt.listen(this.constructor.evtDamaged, this.onDamaged);
        this.evt.listen(this.constructor.evtDeath, this.onDeath);
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
            damageReduction: this.damageReduction,
            resistances: this.resistances,
            losRange: this.losRange,
            aggroRange: this.aggroRange,
            aggroTag: this.aggroTag,
            team: this.team,
            lvl: this.lvl,
            state: this.state,
        });
    }

    // PROPERTIES ----------------------------------------------------------
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
        console.log(`${this} onDamaged: ${Fmt.ofmt(evt)} health: ${health}`);
        if (health > 0) {
            UpdateSystem.eUpdate(this, { health: health });
        } else {
            this.evt.trigger(this.constructor.evtDeath, { actor: this });
        }
        console.log(`player health after damage: ${this.health}`);
    }

    onDeath(evt) {
        if (this.state !== 'dying') {
            UpdateSystem.eUpdate(this, { state: 'dying', health: 0 });
            this.deathTimer = new Timer({ttl: this.deathTTL, cb: this.destroy.bind(this)});
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