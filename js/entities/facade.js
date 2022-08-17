export { Facade };

import { Tile } from './tile.js';

/**
 * Facade: same as a tile, except that it gets serialized/saved as it is destructable
 */
class Facade extends Tile {
    as_kv() {
        return {
            cls: this.cls,
            tag: this.tag,
            gid: this.gid,
            idx: this.idx,
            z: this.z,
            blockedBy: this.blockedBy,
            blocks: this.blocks,
            tileSize: this.tileSize,
            halfSize: this.halfSize,
            baseAssetTag: this.baseAssetTag,
        };
    }
}