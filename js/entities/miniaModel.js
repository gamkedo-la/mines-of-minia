export { MiniaModel };

import { Bits } from '../base/bits.js';
import { Fmt } from '../base/fmt.js';
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
        this.blockedBy = spec.hasOwnProperty('blockedBy') ? spec.blockedBy : this.constructor.block.all;
        this.blocks = spec.hasOwnProperty('blocks') ? spec.blocks : this.constructor.block.all;
    }

    as_kv() {
        return {
            cls: this.cls,
            tag: this.tag,
            gid: this.gid,
            idx: this.idx,
            z: this.z,
            blockedBy: this.blockedBy,
            blocks: this.blocks,
        };
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.gid, this.tag, this.x, this.y, this.z, this.idx);
    }

}