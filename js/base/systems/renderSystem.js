export { RenderSystem };

import { Events } from '../event.js';
import { System } from '../system.js';
import { UxCanvas } from '../uxCanvas.js';

class RenderSystem extends System {

    // STATIC VARIABLES ----------------------------------------------------
    static dfltIterateTTL = 0;
    static evtRenderNeeded = 'render.needed';

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- canvas/context
        let cvsid = spec.cvsid || 'game.canvas';
        this.canvas = UxCanvas.getCanvas(cvsid);
        this.ctx = this.canvas.getContext('2d');
        this.smoothing = spec.hasOwnProperty('smoothing') ? spec.smoothing : false;
        // -- bind event handlers
        this.onEntityUpdated = this.onEntityUpdated.bind(this);
        this.onRenderNeeded = this.onRenderNeeded.bind(this);
        // -- listen on events
        Events.listen(this.constructor.evtRenderNeeded, this.onRenderNeeded);
        this.stayActive = false;
    }
    destroy() {
        super.destroy();
        Events.ignore(this.constructor.evtRenderNeeded, this.onRenderNeeded);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEntityAdded(evt) {
        //console.log(`entity added: ${evt.actor} parent: ${evt.actor.parent}`);
        let actor = evt.actor;
        if (actor && this.matchPredicate(actor)) {
            this.store.set(evt.actor.gid, evt.actor);
            actor.evt.listen(actor.constructor.evtUpdated, this.onEntityUpdated);
            this.active = true;
            if (this.iterating) this.stayActive = true;
        }
    }
    onEntityRemoved(evt) {
        let actor = evt.actor;
        //console.log(`on entityremoved: ${actor}`);
        if (actor && this.matchPredicate(actor)) {
            actor.evt.ignore(actor.constructor.evtUpdated, this.onEntityUpdated);
            this.store.delete(evt.actor.gid);
            this.active = true;
            if (this.iterating) this.stayActive = true;
        }
    }
    onEntityUpdated(evt) {
        if (evt.actor && this.matchPredicate(evt.actor)) {
            //console.log('onEntityUpdated');
            this.active = true;
            if (this.iterating) this.stayActive = true;
        }
    }
    onRenderNeeded(evt) {
        this.active = true;
    }

    // METHODS -------------------------------------------------------------
    matchPredicate(e) {
        return e.cls === 'UxCanvas';
    }

    prepare(evt) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    iterate(evt, e) {
        // enable smoothing
        this.ctx.imageSmoothingEnabled = this.smoothing;
        // ignore entities that are not a root
        if (e.parent) return;
        e.render(this.ctx);
    }

    finalize() {
        if (this.stayActive) {
            this.stayActive = false;
        } else {
            this.active = false;
        }
    }

}
