export { Rous };

import { Assets } from '../base/assets.js';
import { Prng } from '../base/prng.js';
import { Enemy } from './enemy.js';

class Rous extends Enemy{
    // STATIC METHODS ------------------------------------------------------
    static attsByLevel(lvl) {
        // base health
        let health = Prng.rangeInt(3,8);
        // health boost per lvl
        for (let i=1; i<lvl; i++) {
            health += Prng.rangeInt(1,3);
        }
        return {
            maxHealth: health,
            x_sketch: Assets.get('enemy'),
        };
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
    }

}