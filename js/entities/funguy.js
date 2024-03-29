export { Funguy };

import { AiMoveToIdxDirective } from '../ai/aiMoveToIdxDirective.js';
import { AiMoveToRangeDirective } from '../ai/aiMoveToRangeDirective.js';
import { AiRangeTargetDirective } from '../ai/aiRangeTargetDirective.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';

class Funguy extends Enemy{
    static gHealth = new LvlVar({ baseMin: 4, baseMax: 8, perLvlMin: 1, perLvlMax: 3 } );
    static gXp = new LvlVar({ base: 3, perLvl: 1.5 } );

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get('funguy'),
            deathTTL: 700,
            attackKind: 'dark',
            baseDamageMin: 2,
            baseDamageMax: 4,
            pointsPerTurn: 13,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.rangeMin = spec.rangeMin || Config.tileSize*3;
        this.rangeMax = spec.rangeMax || Config.tileSize*5;
    }
    
    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            rangeMin: this.rangeMin,
            rangeMax: this.rangeMax,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        let lvl = evt.lvl;
        // setup directives
        let x_dir = {
            lvl: lvl,
            actor: this,
            rangeMin: this.rangeMin,
            rangeMax: this.rangeMax,
        }
        this.move = new AiMoveToRangeDirective(x_dir);
        this.search = new AiMoveToIdxDirective(x_dir);
        this.attack = new AiRangeTargetDirective(x_dir);
        this.actionStream = this.run();
        // activate
        this.active = true;
    }


}