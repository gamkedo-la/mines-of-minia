export { Pillar };
    import { Events } from '../base/event.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { Item } from './item.js';
import { MiniaModel } from './miniaModel.js';

/**
 * pillar for bio boss interaction
 */
class Pillar extends Item {
    // STATIC VARIABLES ----------------------------------------------------
    static mobile = false;
    static lootable = false;
    static interactable = true;
    static dfltKind = 'fire';

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        return Object.assign( this.spec, {
            blockedBy: MiniaModel.block.all,
            blocks: MiniaModel.block.all,
        }, spec);
    }

    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
    }

    show() {
        Events.trigger(OverlaySystem.evtNotify, {which: 'sparkle', actor: this});
    }

    interact(actor) {
        console.log(`${actor} interacts with ${this}`);
    }

}