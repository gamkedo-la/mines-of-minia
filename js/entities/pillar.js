export { Pillar };
import { Item } from './item.js';
import { MiniaModel } from './miniaModel.js';

/**
 * pillar for bio boss interaction
 */
class Pillar extends Item {
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