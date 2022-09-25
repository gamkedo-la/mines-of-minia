export { Vfx };

import { Hierarchy } from './hierarchy.js';
import { UpdateSystem } from './systems/updateSystem.js';
import { UxView } from './uxView.js';

class Vfx extends UxView {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.actor;

        // -- event handlers
        this.onActorUpdate = this.onActorUpdate.bind(this);
        this.onActorDestroyed = this.onActorDestroyed.bind(this);

        if (spec.actor) this.linkActor(spec.actor);
    }

    destroy() {
        for (const child of Hierarchy.children(this)) {
            child.destroy();
        }
        if (this.actor) {
            this.actor.evt.ignore(this.actor.constructor.evtUpdated, this.onActorUpdate);
            this.actor.evt.ignore(this.actor.constructor.evtDestroyed, this.onActorDestroyed);
        }
        super.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onActorUpdate(evt) {
        if (evt.update && evt.update.xform && (evt.update.xform.hasOwnProperty('x') || evt.update.xform.hasOwnProperty('y'))) {
            if (this.xform.x !== evt.update.xform.x || this.xform.y !== evt.update.xform.y) {
                UpdateSystem.eUpdate(this, { xform: { x: evt.update.xform.x, y: evt.update.xform.y }});
            }
        }
    }

    onActorDestroyed(evt) {
        if (this.actor) {
            this.actor.evt.ignore(this.actor.constructor.evtUpdated, this.onActorUpdate);
            this.actor.evt.ignore(this.actor.constructor.evtDestroyed, this.onActorDestroyed);
        }
        this.destroy();
    }

    // METHODS -------------------------------------------------------------
    linkActor(actor) {
        if (this.actor) {
            this.actor.evt.ignore(this.actor.constructor.evtUpdated, this.onActorUpdate);
            this.actor.evt.ignore(this.actor.constructor.evtDestroyed, this.onActorDestroyed);
        }
        this.actor = actor;
        this.actor.evt.listen(this.actor.constructor.evtUpdated, this.onActorUpdate);
        this.actor.evt.listen(this.actor.constructor.evtDestroyed, this.onActorDestroyed);
        this.xform.x = actor.xform.x;
        this.xform.y = actor.xform.y;
    }

}