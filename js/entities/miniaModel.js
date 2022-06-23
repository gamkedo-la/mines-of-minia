export { MiniaModel };

import { Bits } from '../base/bits.js';
import { Model } from '../base/model.js';

class MiniaModel extends Model {
    // STATIC VARIABLES ----------------------------------------------------
    static block = new Bits({something: 1});
    static dfltZ = 0;

    cpost(spec={}) {
        super.cpost(spec);
        // base minia model values
        // -- level position
        this.idx = spec.idx || 0;
        // -- render depth
        this.z = spec.z || this.constructor.dfltZ;
        // -- collider interaction
        this.blockedBy = spec.hasOwnProperty("blockedBy") ? spec.blockedBy : this.constructor.block.all;
        this.blocks = spec.hasOwnProperty("blocks") ? spec.blocks : this.constructor.block.all;
    }
}