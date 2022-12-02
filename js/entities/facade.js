export { Facade };

    import { Fmt } from '../base/fmt.js';
import { Tile } from './tile.js';

/**
 * Facade: same as a tile, except that it gets serialized/saved as it is destructable
 */
class Facade extends Tile {
    as_kv() {
        let kvs = {
            cls: this.cls,
            tag: this.tag,
            gid: this.gid,
            idx: this.idx,
            kind: this.kind,
            z: this.z,
            blockedBy: this.blockedBy,
            blocks: this.blocks,
            tileSize: this.tileSize,
            halfSize: this.halfSize,
            baseAssetTag: this.baseAssetTag,
        };
        return kvs;
    }
}