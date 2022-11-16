export { Golem };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Prng } from '../base/prng.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';

class Golem extends Enemy{
    static gHealth = new LvlVar({ baseMin: 8, baseMax: 12, perLvlMin: 3, perLvlMax: 5 } );
    static gXp = new LvlVar({ base: 8, perLvl: 2.5 } );

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get('golem'),
            maxSpeed: Config.tileSize/.3/1000,
            losRange: Config.tileSize*5,
            aggroRange: Config.tileSize*5,
            deathTTL: 1000,
            baseDamageMin: 5,
            baseDamageMin: 15,
            attackKind: 'bonk',
            pointsPerTurn: 14,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
    }

}