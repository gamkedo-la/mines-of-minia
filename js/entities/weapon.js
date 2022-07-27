export { Weapon };

import { Fmt } from '../base/fmt.js';
import { Rect } from '../base/rect.js';
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
    static dfltBrawn = 10;
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
        if (skill <= 20) return 'medium';
        return 'high';
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- general properties
        this.kind = spec.kind || this.constructor.dfltKind;
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.constructor.dfltLvl;
        // -- required strength
        this.brawn = spec.brawn || this.constructor.dfltBrawn;
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
            brawn: this.brawn,
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

    get description() {
        let d = `a *tier ${this.tier}* weapon that does *${this.kind}* damage. `
        if (this.identifiable) {
            d += `requires a *${this.constructor.getSkillLevel(this.brawn)}* level of brawn to wield effectively and does a *${this.constructor.getDamageLevel(this.damageMin)}* amount of damage. `;
            d += `it has a *level* but you're not sure what it is. `
            d += `it may or may not have a *charm* applied. `
            d += `...identify to determine exact stats...`
        } else {
            d += `requires *${this.brawn}* brawn to wield effectively and does *${this.damageMin}-${this.damageMax}* damage. `;
            d += `it is a level *${this.lvl}* weapon. `
            // append charm descriptions
            for (const charm of this.charms) {
                d += charm.description;
            }
        }
        return d;
    }

    // METHODS -------------------------------------------------------------

}