export { Gadget };

import { Item } from './item.js';

class Gadget extends Item {
    static slot = 'gadget';
    static dfltTier = 1;
    static dfltLvl = 1;

    cpost(spec) {
        super.cpost(spec);
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.dfltLvl;
        this.identified = spec.hasOwnProperty('identified') ? spec.identified : false;
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            tier: this.tier,
            lvl: this.lvl,
            identified: this.identified,
        });
    }

}