export { Shielding };

import { Assets } from '../base/assets.js';
import { Fmt } from '../base/fmt.js';
import { Random } from '../base/random.js';
import { Charm } from '../charms/charm.js';
import { Item } from './item.js';

// =========================================================================
class Shielding extends Item {
    // STATIC VARIABLES ----------------------------------------------------
    static slot = 'shielding';
    static dfltTier = 1;
    static dfltDamageReduction = 1;
    static dfltBrawn = 10;
    static dfltLvl = 1;
    static dfltDamageReductionScale = 1;

    static getReductionLevel(value) {
        if (value < 8) return 'low';
        if (value < 20) return 'medium';
        return 'high';
    }

    static getSkillLevel(skill) {
        if (skill <= 10) return 'low';
        if (skill <= 15) return 'medium';
        return 'high';
    }

    static xspec(spec={}) {
        let tier = spec.tier || this.dfltTier;
        // final spec
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get(`shielding.${tier}`),
        }, spec);
    }

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.dfltLvl;
        this._damageReductionMin = spec.damageReductionMin || this.constructor.dfltDamageReduction;
        this._damageReductionMax = spec.damageReductionMax || this.constructor.dfltDamageReduction;
        this.damageReductionScale = spec.damageReductionScale || this.constructor.dfltDamageReductionScale;
        this._brawn = spec.brawn || this.constructor.dfltBrawn;
        this.brawnReductionPerLvl = spec.brawnReductionPerLvl || 0;
        this.target;
        // event handlers
        this.onEquip = this.onEquip.bind(this);
        this.onUnequip = this.onUnequip.bind(this);
        this.evt.listen(this.constructor.evtEquipped, this.onEquip);
        this.evt.listen(this.constructor.evtUnequipped, this.onUnequip);
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            tier: this.tier,
            lvl: this.lvl,
            damageReductionMin: this._damageReductionMin,
            damageReductionMax: this._damageReductionMax,
            damageReductionScale: this.damageReductionScale,
            brawn: this._brawn,
            brawnReductionPerLvl: this.brawnReductionPerLvl,
        });
    }

    // PROPERTIES ----------------------------------------------------------
    get brawn() {
        let b = Math.round(this._brawn - this.lvl*this.brawnReductionPerLvl);
        return b;
    }

    get damageReductionMin() {
        let v = this._damageReductionMin * Math.pow(this.damageReductionScale, this.lvl);
        console.log(`v: ${v} drm: ${this._damageReductionMin} lvl: ${this.lvl} scale: ${this.damageReductionScale}`)
        // if player does not meet requirements scale value based on delta
        if (this.target && this.target.brawn < this.brawn) {
            let delta = this.brawn - this.target.brawn;
            if (delta <= 1) {
                v *= .9;
            } else if (delta <= 2) {
                v *= .7;
            } else if (delta <= 3) {
                v *= .5;
            } else {
                v = 0;
            }
        }
        return Math.round(v);
    }
    get damageReductionMax() {
        let v = this._damageReductionMax * Math.pow(this.damageReductionScale, this.lvl);
        // if player does not meet requirements scale value based on delta
        if (this.target && this.target.brawn < this.brawn) {
            let delta = this.brawn - this.target.brawn;
            if (delta <= 1) {
                v *= .9;
            } else if (delta <= 2) {
                v *= .7;
            } else if (delta <= 3) {
                v *= .5;
            } else {
                v = 0;
            }
        }
        return Math.round(v);
    }
    get damageReduction() {
        return Random.rangeInt(this.damageReductionMin, this.damageReductionMax);
    }

    get description() {
        let d = `a *tier ${this.tier}* shielding unit providing damage reduction to your bot. `
        if (this.purgeable) {
            d += `provides a *${this.constructor.getReductionLevel(this.damageReduction)}* amount of general damage reduction. `;
            d += `requires a *${this.constructor.getSkillLevel(this.brawn)}* level of brawn to use effectively. `;
            d += `it has a *level* but you're not sure what it is. `
            d += `it may or may not have a *charm* or *curse* applied. `
            d += `...identify to determine exact stats...`
        } else if (this.identifiable) {
            d += `provides a *${this.constructor.getReductionLevel(this.damageReduction)}* amount of general damage reduction. `;
            d += `requires a *${this.constructor.getSkillLevel(this.brawn)}* level of brawn to use effectively. `;
            d += `it has a *level* but you're not sure what it is. `
            d += `it may or may not have a *charm* applied. `
            if (Charm.cursed) {
                d += `this item is *cursed* with an unknown affliction.  `
            } else {
                d += `this item is free from any *curses*. `
            }
            d += `...identify to determine exact stats...`
        } else {
            d += `provides *${this.damageReductionMin}-${this.damageReductionMax}* of general damage reduction. `;
            d += `requires *${this.brawn}* brawn to use effectively. `;
            d += `it is a level *${this.lvl}* shielding unit. `
            if (this.charms) d += `\n -- charms --\n`;
            // append charm descriptions
            for (const charm of this.charms) {
                d += charm.description + '\n';
            }
        }
        return d;
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEquip(evt) {
        console.log(`${this} onEquip: ${Fmt.ofmt(evt)}`);
        let player = evt.actor;
        if (!player) return;
        // set target
        this.target = player;
        // apply charms
        for (const charm of this.charms) {
            charm.link(player);
        }
    }

    onUnequip(evt) {
        console.log(`${this} onUnequip: ${Fmt.ofmt(evt)}`);
        let player = evt.actor;
        if (!player) return;
        // clear target
        this.target = null;
        // remove charms
        for (const charm of this.charms) {
            charm.unlink(player);
        }
    }

}