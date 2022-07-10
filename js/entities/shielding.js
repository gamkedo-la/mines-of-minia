export { Shielding };

import { Item } from './item.js';

class Shielding extends Item {
    static slot = 'shielding';
    static dfltTier = 1;
    static dfltDamageReduction = 1;
    static dfltBrawn = 10;
    static dfltLvl = 1;
    static dfltDamageReductionScale = 1;

    cpost(spec) {
        super.cpost(spec);
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.dfltLvl;
        this.damageReduction = spec.damageReduction || this.constructor.dfltDamageReduction;
        this.damageReductionScale = spec.damageReductionScale || this.constructor.dfltDamageReductionScale;
        this.brawn = spec.brawn || this.dfltBrawn;
        this.identified = spec.hasOwnProperty('identified') ? spec.identified : false;
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            tier: this.tier,
            lvl: this.lvl,
            damageReduction: this.damageReduction,
            damageReductionScale: this.damageReductionScale,
            brawn: this.brawn,
            identified: this.identified,
        });
    }

}