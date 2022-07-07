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
        'chuck',
        'fling',
        'strung',
        'charged',
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

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- general properties
        this.kind = spec.kind || this.constructor.dfltKind;
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.constructor.dfltLvl;
        this.description = spec.description || this.constructor.dfltDescription;
        this.identified = spec.hasOwnProperty('identified') ? spec.identified : false;
        this.slot = 'weapon';
        // -- required strength
        this.brawn = spec.brawn || this.constructor.dfltBrawn;
        // -- damage
        this.baseDamageMin = spec.baseDamageMin || this.constructor.dfltBaseDamageMin;
        this.baseDamageMax = spec.baseDamageMax || this.constructor.dfltBaseDamageMax;
        this.damageScalePerLvl = spec.damageScale || this.constructor.damageScaleByTier[this.tier];
        // -- enhancement
        this.enhancement = spec.enhancement || null;

    }

    // PROPERTIES ----------------------------------------------------------
    get damageMin() {
        return Math.round(this.baseDamageMin*this.lvl*(this.damageScalePerLvl-1));
    }
    get damageMax() {
        return Math.round(this.baseDamageMax*this.lvl*(this.damageScalePerLvl-1));
    }

    // METHODS -------------------------------------------------------------

}