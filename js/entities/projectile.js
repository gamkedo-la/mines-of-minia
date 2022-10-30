export { Projectile };

import { Rect } from '../base/rect.js';
import { Item } from './item.js';


class Projectile extends Item {
    static lootable = true;
    static stackable = true;

    static get dfltSketch() {
        return new Rect({ width: 4, height: 4, color: 'rgba(255,255,0,.75)' });
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
    }

}