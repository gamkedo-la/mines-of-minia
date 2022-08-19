export { Machinery };
import { Item } from './item.js';
import { MiniaModel } from './miniaModel.js';

/**
 * machinery is for non-interactable items that get put into the level that block movement
 */
class Machinery extends Item {
    // STATIC VARIABLES ----------------------------------------------------
    static mobile = false;
    static lootable = false;

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        return Object.assign( this.spec, {
            blockedBy: MiniaModel.block.all,
            blocks: MiniaModel.block.all,
        }, spec);
    }
}