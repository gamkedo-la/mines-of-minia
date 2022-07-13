export { Discovery };

import { Gem } from '../entities/gem.js';

class Discovery {

    static *generator(template={}, pstate={}) {
        // -- gems
        Gem.initFromPrng();
        yield;
    }

}