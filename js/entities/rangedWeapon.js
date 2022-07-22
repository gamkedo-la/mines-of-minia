export { RangedWeapon };

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
    static dfltBaseDamageMin = 1;
    static dfltBaseDamageMax = 2;
    static dfltSavvy = 10;
    static dfltPower = 5;
    static damageScaleByTier = {
        1: 1.5,
        2: 2,
        3: 2.5,
    };

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
        this.lvl = spec.lvl || 1;
        this.tier = spec.tier || 1;
        // -- required savvy
        this.savvy = spec.savvy || this.constructor.dfltSavvy;
        // -- damage
        this.damageScale = spec.damageScale || this.constructor.damageScaleByTier[this.tier];
        this.baseDamageMin = spec.baseDamageMin || this.constructor.dfltBaseDamageMin;
        this.baseDamageMax = spec.baseDamageMax || this.constructor.dfltBaseDamageMax;
        // -- power requirements
        this.power = spec.power || this.constructor.dfltPower;
        // -- projectile
        this.projectileSpec = spec.projectileSpec;
    }

    // PROPERTIES ----------------------------------------------------------
    get damageMin() {
        return Math.round(this.baseDamageMin*this.lvl*(this.damageScale-1));
    }
    get damageMax() {
        return Math.round(this.baseDamageMax*this.lvl*(this.damageScale-1));
    }

}