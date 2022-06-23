
export { VarSprite };
import { Sprite } from "./sprite.js";
import { Prng } from "./prng.js";

/** ========================================================================
 * A variable sprite is a sketch used to render a JS image.
 */
class VarSprite extends Sprite {
    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        // pick sprite from variations
        let choice = Prng.choose(spec.variations || [])
        if (choice) spec.img = choice;
        super.cpre(spec);
    }
}