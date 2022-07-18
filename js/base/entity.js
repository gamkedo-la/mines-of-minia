export { Entity }

import { EvtStream } from './event.js';
import { Gizmo } from './gizmo.js';

/** ========================================================================
 * Entity is the base class for all game model objects.
 * - includes event stream for all individual entity events
 */
class Entity extends Gizmo {

    // STATIC VARIABLES ----------------------------------------------------
    static cat = 'Entity';
    static evtUpdated = 'e.updated';
    static evtIntent = 'e.intent';
    static evtAdopted = 'e.adopted';
    static evtOrphaned = 'e.orphaned';
    static evtRooted = 'e.rooted';
    static evtCreated = 'e.created';
    static evtDestroyed = 'e.destroyed';
    static evtCollided = 'e.collided';

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        //if (!spec.hasOwnProperty('xform')) spec.xform = new XForm({left: 0, right: 1, top:0, bottom: 1});
        super.cpost(spec);
        // -- event handling
        this.evt = new EvtStream();
    }
    destroy() {
        // superclass sends global destroy signal
        super.destroy();
        // send instance destroy signal
        this.evt.trigger(this.constructor.evtDestroyed, {actor: this});
    }

}
