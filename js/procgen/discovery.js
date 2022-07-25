export { Discovery };

import { Cog } from '../entities/cog.js';
import { Gem } from '../entities/gem.js';

class Discovery {

    static *generator(template={}, pstate={}) {
        // -- gems
        Gem.initFromPrng();
        Cog.initFromPrng();
        yield;
    }

}