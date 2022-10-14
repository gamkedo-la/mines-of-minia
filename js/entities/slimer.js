export { Slimer };

import { Assets } from '../base/assets.js';
import { Fmt } from '../base/fmt.js';
import { PoisonCharm } from '../charms/poison.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';

class Slimer extends Enemy{
    static gHealth = new LvlVar({ baseMin: 1, baseMax: 5, perLvlMin: 1, perLvlMax: 2 } );
    static gXp = new LvlVar({ base: 2, perLvl: 1 } );
    static dfltDeathTTL = 1000;
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( this.spec, {
            //meleeHitSfx: Assets.get('scarab.attack', true),
            //meleeMissSfx: Assets.get('scarab.attack', true),
            //moveSfx: Assets.get('scarab.move', true),
            x_sketch: Assets.get('slimer'),
            pointsPerTurn: 10,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        //console.log(`Rous spec: ${Fmt.ofmt(spec)}`);
        // slimer attacks are poison
        let charm = new PoisonCharm();
        this.addCharm(charm);
    }

}