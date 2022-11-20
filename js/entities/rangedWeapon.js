export { RangedWeapon };

import { Assets } from '../base/assets.js';
import { Item } from './item.js';

class RangedWeapon extends Item {
    static slot = 'belt';
    static usable = true;
    static shootable = true;

    static kinds = [
        'fire',
        'ice',
        'shock',
        'dark',
    ];
    static dfltKind = 'fire';
    static dfltTier = 1;
    static dfltBaseDamageMin = 1;
    static dfltBaseDamageMax = 2;
    static dfltSavvy = 10;
    static dfltPower = 5;
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
            x_sketch: Assets.get(`${kind}.gun.${tier}`),
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
        this.lvl = spec.lvl || 1;
        this.tier = spec.tier || 1;
        // -- required savvy
        this._savvy = spec.savvy || this.constructor.dfltSavvy;
        this.savvyReductionPerLvl = spec.savvyReductionPerLvl || 0;
        // -- damage
        this.damageScale = spec.damageScale || this.constructor.damageScaleByTier[this.tier];
        this.baseDamageMin = spec.baseDamageMin || this.constructor.dfltBaseDamageMin;
        this.baseDamageMax = spec.baseDamageMax || this.constructor.dfltBaseDamageMax;
        // -- power requirements
        this.power = spec.power || this.constructor.dfltPower;
        // -- projectile
        this.projectileSpec = spec.projectileSpec;
        // -- shoot sfx
        this.sfx = spec.sfx || Assets.get(`shoot.${this.kind}`, true);
    }

    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            kind: this.kind,
            lvl: this.lvl,
            tier: this.tier,
            savvy: this._savvy,
            savvyReductionPerLvl: this.savvyReductionPerLvl,
            damageScale: this.damageScale,
            baseDamageMin: this.baseDamageMin,
            baseDamageMax: this.baseDamageMax,
            power: this.power,
            projectileSpec: this.projectileSpec,
        });
    }

    // PROPERTIES ----------------------------------------------------------
    get damageMin() {
        return Math.round(this.baseDamageMin*this.lvl*(this.damageScale-1));
    }
    get damageMax() {
        return Math.round(this.baseDamageMax*this.lvl*(this.damageScale-1));
    }

    get savvy() {
        let b = Math.round(this._savvy - this.lvl*this.savvyReductionPerLvl);
        return b;
    }

    get description() {
        let d = `a *tier ${this.tier}* ranged weapon that does *${this.kind}* damage. `
        if (this.purgeable) {
            d += `requires a *${this.constructor.getSkillLevel(this.savvy)}* level of savvy to wield effectively and does a *${this.constructor.getDamageLevel(this.damageMin)}* amount of damage. `;
            d += `it has a *level* but you're not sure what it is. `
            d += `it may or may not have a *charm* or *curse* applied. `
            d += `...identify to determine exact stats...`
        } else if (this.identifiable) {
            d += `requires a *${this.constructor.getSkillLevel(this.savvy)}* level of savvy to wield effectively and does a *${this.constructor.getDamageLevel(this.damageMin)}* amount of damage. `;
            d += `it has a *level* but you're not sure what it is. `
            d += `it may or may not have a *charm* applied. `
            if (Charm.cursed(this)) {
                d += `this item is *cursed* with an unknown affliction.  `
            } else {
                d += `this item is free from any *curses*. `
            }
            d += `...identify to determine exact stats...`
        } else {
            d += `requires *${this.savvy}* savvy to wield effectively and does *${this.damageMin}-${this.damageMax}* damage. `;
            d += `it is a level *${this.lvl}* weapon. `
            if (this.charms.length) d += `\n -- charms --\n`;
            // append charm descriptions
            for (const charm of this.charms) {
                d += charm.description + '\n';
            }
        }
        return d;
    }

}