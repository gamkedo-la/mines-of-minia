export { UxView };

import { Bounds } from './bounds.js';
import { Entity } from './entity.js';
import { Fmt } from './fmt.js';
import { Hierarchy } from './hierarchy.js';
import { XForm } from './xform.js';

/** ========================================================================
 * The base ui primitive.
 * -- derives from Gizmo
 * -- views can have parent/child relationships
 */
class UxView extends Entity {

    // STATIC VARIABLES ----------------------------------------------------
    static cat = 'View';
    static evtMouseEntered = 'view.mouseEntered';
    static evtMouseLeft = 'view.mouseLeft';
    static evtMouseClicked = 'view.mouseClicked';
    static evtMouseDown = 'view.mouseDown';
    static evtMouseUp = 'view.mouseUp';
    static evtResized = 'view.resized';
    static evtUpdated = 'view.updated';
    static updateOnMouse = false;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this._visible = spec.hasOwnProperty('visible') ? spec.visible : true;
        this._active = spec.hasOwnProperty('active') ? spec.active : true;
        this.depth = spec.hasOwnProperty('depth') ? spec.depth : ((spec.hasOwnProperty('dfltDepth')) ? spec.dfltDepth : 0);
        this.layer = spec.hasOwnProperty('layer') ? spec.layer : ((spec.hasOwnProperty('dfltLayer')) ? spec.dfltLayer : 0);
        this.autocenter = spec.hasOwnProperty('autocenter') ? spec.autocenter : false;
        this.mouseOver = false;
        this.mouseDown = false;
        this.xform = spec.hasOwnProperty('xform') ? spec.xform : XForm.identity;
        if (spec.dbg) this.dbg = spec.dbg;
        // -- autosize element based on resize events
        this.autosize = (spec.hasOwnProperty('autosize')) ? spec.autosize : true;
        // -- hierarchy (finalized in cfinal)
        this.parent = null;
        this.children = [];
        // -- update xform hierarchy
        if (spec.parent) {
            Hierarchy.adopt(spec.parent.xform, this.xform);
        }
        for (const child of (spec.children || [])) {
            Hierarchy.adopt(this.xform, child.xform);
        }
        // -- mouse handling
        this.updateOnMouse = spec.hasOwnProperty('updateOnMouse') ? spec.updateOnMouse : this.constructor.updateOnMouse;
        // -- setup event handlers
        this.onMouseEntered = this.onMouseEntered.bind(this);
        this.onMouseLeft = this.onMouseLeft.bind(this);
        this.onMouseClicked = this.onMouseClicked.bind(this);
        this.onChildUpdate = this.onChildUpdate.bind(this);
        this.onSketchUpdate = this.onSketchUpdate.bind(this);
        this.onSketchDone = this.onSketchDone.bind(this);
        this.onResized = this.onResized.bind(this);
        this.evt.listen(this.constructor.evtMouseEntered, this.onMouseEntered);
        this.evt.listen(this.constructor.evtMouseLeft, this.onMouseLeft);
        this.evt.listen(this.constructor.evtMouseClicked, this.onMouseClicked);
        this.evt.listen(this.constructor.evtResized, this.onResized);
    }
    cfinal(spec) {
        super.cfinal(spec);
        // finalize hierarchy
        if (spec.parent) {
            Hierarchy.adopt(spec.parent, this);
        }
        for (const child of (spec.children || [])) {
            Hierarchy.adopt(this, child);
            child.evt.listen(child.constructor.evtUpdated, this.onChildUpdate);
        }
        // show view if visible
        if (this.visible) this.show();
    }

    destroy() {
        //console.log(`== ${this} view destroy`);
        Hierarchy.orphan(this.xform);
        if (this.parent) Hierarchy.orphan(this);
        for (const child of this.children) {
            Hierarchy.orphan(child);
            child.evt.ignore(child.constructor.evtUpdated, this.onChildUpdate);
        }
        this.evt.ignore(this.constructor.evtMouseEntered, this.onMouseEntered);
        this.evt.ignore(this.constructor.evtMouseLeft, this.onMouseLeft);
        this.evt.ignore(this.constructor.evtMouseClicked, this.onMouseClicked);
        this.hide();
        super.destroy();
    }

    // PROPERTIES ----------------------------------------------------------

    // retrieve view min coords in world position
    
    get minx() {
        return this.xform.minx;
    }
    get miny() {
        return this.xform.miny;
    }

    get x() {
        return this.xform.centerx;
    }
    get y() {
        return this.xform.centery;
    }

    get maxx() {
        return this.xform.maxx;
    }
    get maxy() {
        return this.xform.maxy;
    }

    get width() {
        return this.xform.width;
    }

    get height() {
        return this.xform.height;
    }

    get bounds() {
        return new Bounds(this.xform.minx, this.xform.miny, this.xform.width, this.xform.height);
    }

    get visible() {
        return this._visible;
    }
    set visible(v) {
        v = (v) ? true : false;
        if (v !== this._visible) {
            this._visible = v;
            // show if transitioning to visible
            if (v && (!this.parent || this.parent.visible)) {
                this.evt.trigger(this.constructor.evtUpdated, {actor: this, update: {visible: v}});
                this.show();
                for (const child of Hierarchy.children(this)) {
                    if (child._visible) {
                        child.evt.trigger(child.constructor.evtUpdated, {actor: child, update: {visible: v}});
                        child.show();
                    }
                }
            // hide if transitioning to not visible
            } else if (!v && (!this.parent || this.parent.visible)) {
                this.evt.trigger(this.constructor.evtUpdated, {actor: this, update: {visible: v}});
                this.hide();
                for (const child of Hierarchy.children(this)) {
                    if (!child._visible) {
                        child.evt.trigger(child.constructor.evtUpdated, {actor: child, update: {visible: v}});
                        child.hide();
                    }
                }
            }
        }
    }

    get active() {
        return this._active;
    }
    set active(v) {
        v = (v) ? true : false;
        if (v !== this._active) {
            this._active = v;
            this.evt.trigger(this.constructor.evtUpdated, {actor: this, update: {active: v}});
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onMouseEntered(evt) {
        if (!this.active) return;
        if (evt.actor !== this) return;
        if (this.mouseEnteredSound) this.mouseEnteredSound.play();
        if (this.updateOnMouse) this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }
    onMouseLeft(evt) {
        if (!this.active) return;
        if (evt.actor !== this) return;
        if (this.mouseLeftSound) this.mouseLeftSound.play();
        if (this.updateOnMouse) this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }
    onMouseClicked(evt) {
        if (!this.active) return;
        if (evt.actor !== this) return;
        if (this.mouseClickedSound) this.mouseClickedSound.play();
        if (this.updateOnMouse) this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }
    onChildUpdate(evt) {
        if (!this.active) return;
        if (!evt.actor || evt.actor.parent !== this) return;
        this.evt.trigger(this.constructor.evtUpdated, {actor: this, child: evt.actor});
    }
    onSketchUpdate(evt) {
        if (!this.active) return;
        // propagate update
        this.evt.trigger(this.constructor.evtUpdated, {actor: this, update: { sketch: evt.actor }});
    }
    onSketchDone(evt) {
        if (!this.active) return;
        // handle event
        this.destroy();
    }
    onResized(evt) {
        if (this.autocenter) {
            if (this.autocenter && this.parent) {
                let offx = Math.max(0, (this.parent.xform.width - this.xform.width)/2);
                this.xform.offx = offx;
                let offy = Math.max(0, (this.parent.xform.height - this.xform.height)/2);
                this.xform.offy = offy;
            }
        }
    }

    // METHODS -------------------------------------------------------------
    show() {
    }
    hide() {
    }

    _prerender(ctx) {
    }
    _render(ctx) {
    }
    _childrender(ctx) {
        for (const child of this.children) {
            child.render(ctx);
        }
    }
    _postrender(ctx) {
    }

    render(ctx) {
        // don't render if not visible
        if (!this.visible) return;
        if (this.dbg && this.dbg.xform) this.xform.render(ctx);
        // apply transform
        this.xform.apply(ctx, false);
        // pre render, specific to subclass
        this._prerender(ctx);
        // private render, specific to subclass
        this._render(ctx);
        // child render
        this._childrender(ctx);
        // post render, specific to subclass
        this._postrender(ctx);
        this.xform.revert(ctx, false);
    }

    resize(width, height) {
        if (width != this.xform.width || height != this.xform.height) {
            this.xform.width = width;
            this.xform.height = height;
            this.evt.trigger(this.constructor.evtResized, {actor: this, width: width, height: height});
            for (const child of Hierarchy.children(this)) {
                child.evt.trigger(child.constructor.evtResized, {actor: child, root: this});
            }
            this.evt.trigger(this.constructor.evtUpdated, {actor: this});
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.gid, this.tag, this.x, this.y);
    }

    adopt(child) {
        Hierarchy.adopt(this.xform, child.xform);
        Hierarchy.adopt(this, child);
        child.evt.listen(child.constructor.evtUpdated, this.onChildUpdate);
    }

    orphan() {
        let parent = this.parent;
        if (!parent) return;
        this.evt.ignore(this.constructor.evtUpdated, parent.onChildUpdate);
        Hierarchy.orphan(this);
        Hierarchy.orphan(this.xform);
    }

    /**
     * link a sketch to the given gizmo, assumes onSketchUpdate defined for calling class
     * @param {*} att 
     * @param {*} sketch 
     * @param {*} update 
     */
    _linkSketch(att, sketch, update=true) {
        // -- clear previous value
        let prev = this[att];
        if (prev) this._unlinkSketch(att, sketch);
        // -- set and bind new sketch
        this[att] = sketch;
        if (this.onSketchUpdate) sketch.evt.listen(sketch.constructor.evtUpdated, this.onSketchUpdate);
        if (this.closeOnSketchDone) sketch.evt.listen(sketch.constructor.evtDone, this.onSketchDone);
        sketch.link(this);
        // -- trigger updates
        if (update) {
            if (this.visible) sketch.show();
            this.evt.trigger(this.constructor.evtUpdated, {actor: this});
        }
    }

    /**
     * unlink a sketch from the given gizmo
     * @param {*} att 
     */
    _unlinkSketch(att) {
        // -- clear current sketch
        let sketch = this[att];
        if (sketch) {
            if (this.onSketchUpdate) sketch.evt.ignore(sketch.constructor.evtUpdated, this.onSketchUpdate);
            if (this.onSketchDone) sketch.evt.ignore(sketch.constructor.evtDone, this.onSketchDone);
            sketch.unlink();
            sketch.hide();
        }
    }

}