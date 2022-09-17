export { Scarab };

import { Assets } from '../base/assets.js';
import { Fmt } from '../base/fmt.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';

class Scarab extends Enemy{
    static gHealth = new LvlVar({ baseMin: 1, baseMax: 5, perLvlMin: 1, perLvlMax: 2 } );
    static gXp = new LvlVar({ base: 2, perLvl: 1 } );
    static dfltDeathTTL = 700;
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( this.spec, {
            meleeHitSfx: Assets.get('scarab.attack', true),
            meleeMissSfx: Assets.get('scarab.attack', true),
            x_sketch: Assets.get('scarab'),
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        //console.log(`Rous spec: ${Fmt.ofmt(spec)}`);
    }

}