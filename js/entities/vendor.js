export { Vendor };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Character } from './character.js';

class Vendor extends Character {

    static xspec(spec={}) {
        // final spec
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get('stealthbot'),
            maxSpeed: Config.tileSize/.3/1000,
            losRange: Config.tileSize*14,
            aggroRange: Config.tileSize*14,
        }, spec);
    }

}