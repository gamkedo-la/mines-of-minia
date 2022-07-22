export { RangedWeapon };

import { Item } from './item.js';

class RangedWeapon extends Item {
    static slot = 'belt';
    static usable = true;
    static shootable = true;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
    }

}