export { Digger };

import { Assets } from '../base/assets.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';

class Digger extends Enemy{

    static gHealth = new LvlVar({ baseMin: 5, baseMax: 8, perLvlMin: 2, perLvlMax: 3 } );
    static gXp = new LvlVar({ base: 4, perLvl: 2 } );
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( this.spec, {
            x_sketch: Assets.get('digger'),
            deathTTL: 1000,
        }, spec);
    }

}