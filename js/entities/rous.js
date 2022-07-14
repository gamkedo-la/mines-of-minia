export { Rous };

import { Assets } from '../base/assets.js';
import { Prng } from '../base/prng.js';
import { Enemy } from './enemy.js';

class Rous extends Enemy{
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // parse lvl
        let lvl = spec.lvl || 1;
        // health
        let health = Prng.rangeInt(3,8);
        for (let i=1; i<lvl; i++) health += Prng.rangeInt(1,3);
        // final spec
        return Object.assign( this.spec, {
            xp: 5,
            healthMax: health,
            x_sketch: Assets.get('enemy'),
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
    }

}