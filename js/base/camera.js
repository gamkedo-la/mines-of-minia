export { Camera };

import { Events, EvtStream } from "./event.js";
import { Fmt } from "./fmt.js";
import { Game } from "./game.js";
import { Hierarchy } from "./hierarchy.js";
import { Mathf } from "./math.js";
import { UxView } from "./uxView.js";
import { Vect } from "./vect.js";

// =========================================================================
class Camera {
    static dfltSnapDistance = 1;
    static evtUpdated = 'camera.updated';
    static evtPanned = 'camera.panned';

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        // -- view: the root view the camera is observing
        this.view = spec.view || new UxView();
        // -- viewport: the viewport for which the camera will display... either a mask or the root canvas...
        this.viewport = spec.viewport;
        if (!this.viewport) this.viewport = Hierarchy.findInParent(this.view, (v) => v.cls === 'UxMask');
        if (!this.viewport) this.viewport = Hierarchy.findInParent(this.view, (v) => v.cls === 'UxCanvas');
        if (!this.viewport) this.viewport = Hierarchy.root(this.view);
        // -- overflow: allow the camera to overflow the bounds of the viewport
        this.overflow = (spec.hasOwnProperty('overflow')) ? spec.overflow : false;
        // -- buffer: percent of view to allow buffered movement (movement without camera repositioning)
        // -- =>   0: no buffer, all target movement will cause camera repositioning
        // -- =>   1: full buffer, camera will only be repositioned when target reaches edge of viewport
        this.buffer = spec.buffer || 0;
        // -- pan values
        this.snapDistance = spec.hasOwnProperty('snapDistance') ? spec.snapDistance : this.constructor.dfltSnapDistance;
        this.panMaxSpeed = spec.panMaxSpeed || .5;
        this.panAccel = spec.panAccel || this.panMaxSpeed/1000;
        this.panSpeed = 0;
        this.panTarget = undefined;
        // build chain of views from viewport to view
        this.viewChain = [];
        for (let view = this.view; view && view!==this.viewport; view=view.parent) {
            this.viewChain.unshift(view);
        }
        // -- upstream events
        this.evtTock = spec.evtTock || Game.evtTock;
        // -- provided events
        this.evt = new EvtStream();
         // -- setup event handlers
        this.onTock = this.onTock.bind(this);
        this.onTargetUpdate = this.onTargetUpdate.bind(this);
        this.onViewportResize = this.onViewportResize.bind(this);
        this.viewport.evt.listen(this.viewport.constructor.evtResized, this.onViewportResize);
    }

    destroy() {
        this.stopPan();
        this.stopTrack();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onViewportResize(evt) {
        this.updateTrack();
    }

    onTargetUpdate(evt) {
        if (evt.actor !== this.target) return;
        //console.log(`onTargetUpdate: ${Fmt.ofmt(evt)}`);
        this.updateTrack();
    }

    onTock(evt) {
        this.updatePan(evt);
    }

    // METHODS -------------------------------------------------------------
    trackTarget(target) {
        // if currently have a target...
        if (this.target) this.target.evtUpdated.ignore(this.onTargetUpdate);
        this.target = target;
        this.target.evt.listen(target.constructor.evtUpdated, this.onTargetUpdate);
        this.updateTrack();
    }

    stopTrack() {
        if (this.target) {
            this.target.evt.ignore(target.constructor.evtUpdated, this.onTargetUpdate);
            this.target = undefined;
        }
    }

    calcLocalViewport() {
        // translate viewport coords to view coordinates
        this.vpc = new Vect(this.viewport.xform.centerx, this.viewport.xform.centery);
        this.vpmin = new Vect(this.viewport.xform.minx, this.viewport.xform.miny);
        this.vpmax = new Vect(this.viewport.xform.maxx, this.viewport.xform.maxy);
        for (const view of this.viewChain) {
            this.vpc = view.xform.getLocal(this.vpc, false);
            this.vpmin = view.xform.getLocal(this.vpmin, false);
            this.vpmax = view.xform.getLocal(this.vpmax, false);
        }
        // -- remove local view delta from translation
        this.vpc.add(this.view.xform.x,this.view.xform.y);
        this.vpmin.add(this.view.xform.x,this.view.xform.y);
        this.vpmax.add(this.view.xform.x,this.view.xform.y);
    }

    updateTrack() {
        // calculate local viewport
        this.calcLocalViewport();
        // translate target view to camera view coords
        let lpos = new Vect(this.target.xform.centerx, this.target.xform.centery);
        for (let xf=this.target.xform; xf && xf!==this.view.xform; xf=xf.parent) {
            lpos = xf.getWorld(lpos, false);
        }
        // center camera to local position
        this.centerOnPosition(lpos);
    }

    calcCameraPosition(pos) {
        let vdx = this.vpc.x - pos.x;
        let vdy = this.vpc.y - pos.y;
        // handle case where target is within buffer window (e.g.: center of screen where camera does not track movement)
        if (this.buffer) {
            // reset view deltas (no translation)
            vdx = this.view.xform.x;
            vdy = this.view.xform.y;
            // t* - target position without current delta (same coord space as vpmin/vpmax)
            let tx = pos.x+this.view.xform.x;
            let ty = pos.y+this.view.xform.y;
            let leftEdge = this.vpmin.x + this.viewport.xform.width * (1-this.buffer) * .5;
            let rightEdge = this.vpmax.x - this.viewport.xform.width * (1-this.buffer) * .5;
            let topEdge = this.vpmin.y + this.viewport.xform.height * (1-this.buffer) * .5;
            let bottomEdge = this.vpmax.y - this.viewport.xform.height * (1-this.buffer) * .5;
            // translate if outside of buffer
            if (tx < leftEdge) vdx = leftEdge - pos.x;
            if (tx > rightEdge) vdx = rightEdge - pos.x;
            if (ty < topEdge) vdy = topEdge - pos.y;
            if (ty > bottomEdge) vdy = bottomEdge - pos.y;
        }
        // check for overflow
        // -- should vd[xy] (viewdelta) be bound to view dimensions?
        if (!this.overflow) {
            if (this.view.xform.minx+vdx>this.vpmin.x) vdx = this.vpmin.x-this.view.xform.minx;
            if (this.view.xform.miny+vdy>this.vpmin.y) vdy = this.vpmin.y-this.view.xform.miny;
            if (this.view.xform.maxx+vdx<this.vpmax.x) vdx = this.vpmax.x-this.view.xform.maxx;
            if (this.view.xform.maxy+vdy<this.vpmax.y) vdy = this.vpmax.y-this.view.xform.maxy;
        }
        return new Vect(this.vpc.x-vdx,this.vpc.y-vdy);
    }

    centerOnPosition(pos) {
        // make sure position falls within camera boundaries
        pos = this.calcCameraPosition(pos);
        // apply new view delta
        let vdx = this.vpc.x - pos.x;
        let vdy = this.vpc.y - pos.y;
        if (this.view.xform.x !== vdx || this.view.xform.y !== vdy) {
            this.view.xform.x = vdx;
            this.view.xform.y = vdy;
            this.evt.trigger(this.constructor.evtUpdated, {actor: this, dx: vdx, dy: vdy});
        }
    }

    panToTarget(view) {
        // if camera is currently tracking to a target, stop
        this.stopTrack();
        // set pan target
        this.panTarget = view;
        // setup listener for game clock
        Events.listen(this.evtTock, this.onTock);
    }

    waitPanToTarget(view) {
        this.panToTarget(view);
        let pannedCb;
        let promise = new Promise((resolve) => {
            pannedCb = (evt) => {
                if (evt.actor === this) resolve();
            }
            this.evt.listen(this.constructor.evtPanned, pannedCb);
        });
        return promise.then(() => {
            this.evt.ignore(this.constructor.evtPanned, pannedCb);
        });
    }

    updatePan(ctx) {
        // current "local" camera position
        let cx = this.vpc.x - this.view.xform.x;
        let cy = this.vpc.y - this.view.xform.y;
        // the pan target position
        let pos = new Vect(this.panTarget.xform.centerx, this.panTarget.xform.centery);
        for (let xf=this.panTarget.xform; xf && xf!==this.view.xform; xf=xf.parent) {
            pos = xf.getWorld(pos, false);
        }
        // adjust pan target position based on camera positioning...
        pos = this.calcCameraPosition(pos);
        // delta position values in x,y
        let dx = pos.x-cx;
        let dy = pos.y-cy;
        // deltatime
        let dt = ctx.deltaTime;
        // computed distance to pan target
        let distance = Mathf.distance(pos.x, pos.y, cx, cy);
        if (distance > this.snapDistance) {
            let angle = Math.atan2(dy,dx);
            let cosangle = Math.cos(angle);
            let sinangle = Math.sin(angle);
            let decelDistance = (this.panSpeed * this.panSpeed) / (2 * this.panAccel);
            //we are still far, continue accelerating (if possible)
            if (distance > decelDistance) {
                this.panSpeed = Math.min(this.panSpeed + this.panAccel * dt, this.panMaxSpeed);
            //we are about to reach the target, let's start decelerating.
            } else {
                this.panSpeed = Math.max(this.panSpeed - this.panAccel * dt, 0);
            }
            cx += (this.panSpeed * cosangle * dt);
            cy += (this.panSpeed * sinangle * dt);
        // magic close enough... jump to final position
        } else {
            cx = pos.x;
            cy = pos.y;
            this.evt.trigger(this.constructor.evtPanned, {actor: this})
            this.stopPan();
        }
        // calculate local viewport
        this.calcLocalViewport();
        // update camera position
        this.centerOnPosition(new Vect(cx, cy));
    }


    stopPan() {
        this.panSpeed = 0;
        Events.listen(this.evtTock, this.onTock);
        this.panTarget = undefined;
    }

    /*
    contains(obj) {
        return Bounds.contains(this, obj);
    }

    containsXY(x, y) {
        return Bounds.containsXY(this, x, y);
    }

    overlaps(obj) {
        return Bounds.overlaps(this, obj, false);
    }

    reset() {
        this._x = 0;
        this._y = 0;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;
    }
    */

}
