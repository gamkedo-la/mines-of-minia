export { Weapon };

import { Assets } from '../base/assets.js';
import { Fmt } from '../base/fmt.js';
import { Rect } from '../base/rect.js';
import { Charm } from '../charms/charm.js';
import { Item } from './item.js';

class Weapon extends Item {
    // STATIC VARIABLES ----------------------------------------------------
    static slot = 'weapon';

    static kinds = [
        'bonk',
        'poke',
        'hack',
    ];

    static dfltKind = 'bonk';
    static dfltTier = 1;
    static dfltLvl = 1;
    static dfltSpry = 10;
    static dfltBaseDamageMin = 1;
    static dfltBaseDamageMax = 2;
    static dfltDescription = 'a rather basic weapon';
    static damageScaleByTier = {
        1: 1.5,
        2: 2,
        3: 2.5,
    };

    static getSkillLevel(skill) {
        if (skill <= 10) return 'low';
        if (skill <= 15) return 'medium';
        return 'high';
    }

    static getDamageLevel(damage) {
        if (damage <= 10) return 'low';
        if (damage <= 20) return 'medium';
        return 'high';
    }

    static xspec(spec={}) {
        let kind = spec.kind || this.dfltKind;
        let tier = spec.tier || this.dfltTier;
        // final spec
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get(`${kind}.${tier}`),
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- general properties
        this.kind = spec.kind || this.constructor.dfltKind;
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.constructor.dfltLvl;
        // -- required strength
        this._spry = spec.spry || this.constructor.dfltSpry;
        this.spryReductionPerLvl = spec.spryReductionPerLvl || 0;
        // -- damage
        this.baseDamageMin = spec.baseDamageMin || this.constructor.dfltBaseDamageMin;
        this.baseDamageMax = spec.baseDamageMax || this.constructor.dfltBaseDamageMax;
        this.damageScale = spec.damageScale || this.constructor.damageScaleByTier[this.tier];
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            kind: this.kind,
            tier: this.tier,
            lvl: this.lvl,
            spry: this._spry,
            spryReductionPerLvl: this.spryReductionPerLvl,
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

    get spry() {
        let b = Math.round(this._spry - this.lvl*this.spryReductionPerLvl);
        return b;
    }

    get description() {
        let d = `a *tier ${this.tier}* weapon that does *${this.kind}* damage. `
        if (this.purgeable) {
            d += `requires a *${this.constructor.getSkillLevel(this.spry)}* level of spry to wield effectively and does a *${this.constructor.getDamageLevel(this.damageMin)}* amount of damage. `;
            d += `it has a *level* but you're not sure what it is. `
            d += `it may or may not have a *charm* or *curse* applied. `
            d += `...identify to determine exact stats...`
        } else if (this.identifiable) {
            d += `requires a *${this.constructor.getSkillLevel(this.spry)}* level of spry to wield effectively and does a *${this.constructor.getDamageLevel(this.damageMin)}* amount of damage. `;
            d += `it has a *level* but you're not sure what it is. `
            d += `it may or may not have a *charm* applied. `
            if (Charm.cursed(this)) {
                d += `this item is *cursed* with an unknown affliction.  `
            } else {
                d += `this item is free from any *curses*. `
            }
            d += `...identify to determine exact stats...`
        } else {
            d += `requires *${this.spry}* spry to wield effectively and does *${this.damageMin}-${this.damageMax}* damage. `;
            d += `it is a level *${this.lvl}* weapon. `
            if (this.charms.length) d += `\n -- charms --\n`;
            // append charm descriptions
            for (const charm of this.charms) {
                d += charm.description + '\n';
            }
        }
        return d;
    }

    // METHODS -------------------------------------------------------------

}