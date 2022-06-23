export { MouseSystem };

import { System } from '../system.js';
import { UxCanvas } from '../uxCanvas.js';

class MouseSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static evtClicked = 'mouse.clicked';
    static evtMoved = 'mouse.moved';
    static dfltIterateTTL = 0;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        // -- mouse is associated w/ doc canvas element...
        let cvsid = spec.cvsid || UxCanvas.dfltCanvasID;
        this.canvas = spec.canvas || UxCanvas.getCanvas(cvsid);
        // -- mouse state
        this.x = 0;
        this.y = 0;
        this.down = false;
        this.clicked = false;
        this.dbg = spec.dbg;
        // -- events
        this.evtMoved = spec.evtMoved || this.constructor.evtMoved;
        this.evtClicked = spec.evtClicked || this.constructor.evtClicked;
        // -- bind event handlers
        this.onClicked = this.onClicked.bind(this);
        this.onMoved = this.onMoved.bind(this);
        this.onPressed = this.onPressed.bind(this);
        this.onUnpressed = this.onUnpressed.bind(this);
        // -- register event handlers
        this.canvas.addEventListener('mousemove', this.onMoved.bind(this));
        this.canvas.addEventListener('click', this.onClicked.bind(this));
        this.canvas.addEventListener('mousedown', this.onPressed.bind(this));
        this.canvas.addEventListener('mouseup', this.onUnpressed.bind(this));
    }
    destroy() {
        this.canvas.removeEventListener('mousemove', this.onMoved);
        this.canvas.removeEventListener('click', this.onClicked);
        this.canvas.removeEventListener('mousedown', this.onPressed);
        this.canvas.removeEventListener('mouseup', this.onUnpressed);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onClicked(evt) {
        // capture event data...
        let data = {
            actor: this,
            old_x: this.x,
            old_y: this.y,
            x: evt.offsetX,
            y: evt.offsetY,
        }
        // update mouse state
        this.x = evt.offsetX;
        this.y = evt.offsetY;
        this.active = true;
        this.clicked = true;
        // trigger event
        this.evt.trigger(this.evtClicked, data);
    }
    onMoved(evt) {
        // capture event data...
        let data = {
            actor: this,
            old_x: this.x,
            old_y: this.y,
            x: evt.offsetX,
            y: evt.offsetY,
        }
        // update mouse state
        this.x = evt.offsetX;
        this.y = evt.offsetY;
        this.active = true;
        // trigger event
        this.evt.trigger(this.evtMoved, data);
    }

    onPressed(evt) {
        this.down = true;
        this.active = true;
    }
    onUnpressed(evt) {
        this.down = false;
        this.active = true;
    }

    // METHODS -------------------------------------------------------------
    matchPredicate(e) {
        // FIXME: flags are broken in entity
        //return e.flags.has('interactable');
        return e.cat === 'View';
    }

    iterate(evt, e) {
        // skip inactive entities
        if (!e.active) return;
        // determine if view bounds contains mouse point (bounds is in world coords)
        const contains = e.xform.wbounds.containsXY(this.x, this.y);
        if (e.mouseOver && !contains) {
            e.mouseOver = false;
            if (e.constructor.evtMouseLeft) e.evt.trigger(e.constructor.evtMouseLeft, {actor: e, mouse: {x: this.x, y: this.y}});
            if (this.dbg) console.log(`mouse left: ${e}`);
        }
        if (!e.mouseOver && contains) {
            e.mouseOver = true;
            if (e.constructor.evtMouseEntered) e.evt.trigger(e.constructor.evtMouseEntered, {actor: e, mouse: {x: this.x, y: this.y}});
            if (this.dbg) console.log(`mouse entered: ${e}`);
        }
        if (contains && this.clicked) {
            if (e.constructor.evtMouseClicked) e.evt.trigger(e.constructor.evtMouseClicked, {actor: e, mouse: {x: this.x, y: this.y}});
            if (this.dbg) console.log(`mouse clicked: ${e}`);
        }
        if (!e.mouseDown && contains && this.down) {
            e.mouseDown = true;
            if (e.constructor.evtMouseDown) e.evt.trigger(e.constructor.evtMouseDown, {actor: e, mouse: {x: this.x, y: this.y}});
            if (this.dbg) console.log(`mouse down: ${e}`);
        }
        if (e.mouseDown && (!contains || !this.down)) {
            e.mouseDown = false;
            if (e.constructor.evtMouseUp) e.evt.trigger(e.constructor.evtMouseUp, {actor: e, mouse: {x: this.x, y: this.y}});
            if (this.dbg) console.log(`mouse up: ${e}`);
        }
    }

    finalize(evt) {
        // mouse system is only active if a mouse event is received
        this.active = false;
        this.clicked = false;
    }

}