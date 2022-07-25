export { Clutter };
import { Item } from './item.js';

/**
 * clutter is for non-interactable items that get put into the level
 */
class Clutter extends Item {
    static mobile = false;
    static lootable = false;
}