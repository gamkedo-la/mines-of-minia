export { Rous };

import { Assets } from '../base/assets.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';

class Rous extends Enemy{
    static gHealth = new LvlVar({ baseMin: 2, baseMax: 7, perLvlMin: 1, perLvlMax: 3 } );
    static gXp = new LvlVar({ base: 2, perLvl: 1 } );
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( this.spec, {
            x_sketch: Assets.get('enemy'),
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
    }

}