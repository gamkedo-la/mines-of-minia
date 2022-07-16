export { Golem };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Prng } from '../base/prng.js';
import { Enemy } from './enemy.js';

class Golem extends Enemy{
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
            x_sketch: Assets.get('golem'),
            maxSpeed: .2,
            losRange: Config.tileSize*5,
            aggroRange: Config.tileSize*5,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
    }

}