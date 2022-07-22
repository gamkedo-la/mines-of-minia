export { Projectile };

import { Item } from './item.js';

class Projectile extends Item {
    static lootable = false;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
    }

}