export { Sketch };

import { Events } from './event.js';
import { Fmt } from './fmt.js';
import { Gizmo } from './gizmo.js';

/**
 * A sketch is the base abstract data object that represents something that can be drawn to the screen... 
 * -- an image (sprite)
 * -- an animation
 * -- simple js primitives for drawing
 * -- a particle
 */
class Sketch extends Gizmo {

    // STATIC VARIABLES ----------------------------------------------------
    static evtUpdated = 'sketch.updated';
    static evtDone = 'sketch.done';

    // STATIC PROPERTIES ---------------------------------------------------
    static get zero() {
        return new Sketch();
    }
    static get evt() {
        return Events.null;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * create a new sketch
     */
    cpost(spec) {
        this.tag = spec.tag || 'tag';
        // -- width/height represent prescribed dimensions
        this.width = spec.width || 0;
        this.height = spec.height || 0;
        this.lockRatio = spec.hasOwnProperty('lockRatio') ? spec.lockRatio : false;
        // -- origin (in percent of width/height)
        this.origx = spec.origx || .5;
        this.origy = spec.origy || .5;
        // -- transformations
        this.angle = spec.angle || 0;
        this.dbg = spec.dbg;
        // -- events 
        this.evt = spec.evt || this.constructor.evt;
    }

    // PROPERTIES ----------------------------------------------------------
    get ratio() {
        return (this.height) ? (this.iwidth/this.iheight) : 1;
    }

    // internal dimensions
    get iwidth() {
        return this.width;
    }

    get iheight() {
        return this.height;
    }

    // animation index
    get idx() {
        return 0;
    }

    get done() {
        return true;
    }

    // METHODS -------------------------------------------------------------
    show() {
    }

    hide() {
    }

    /**
     * A sketch can be reset...
     */
    reset() {
    }

    /**
     * A sketch can be rendered...
     * @param {canvasContext} renderCtx - canvas context on which to draw
     */
    render(renderCtx, x=0, y=0) {
        // translate
        let cform = renderCtx.getTransform();
        // adjust rendering for locked ratio
        let fitWidth = this.width;
        let fitHeight = this.height;
        if (this.lockRatio && fitWidth && fitHeight) {
            if ((this.iwidth / fitWidth) < (this.iheight / fitHeight)) {
                fitWidth = fitHeight * this.ratio;
            } else {
                fitHeight = fitWidth / this.ratio;
            }
        }
        // apply transforms
        let offx = this.origx*this.width;
        let offy = this.origy*this.height;
        renderCtx.translate(x+offx, y+offy);
        if (this.angle) renderCtx.rotate(this.angle);
        // sketch-specific render
        this._render(renderCtx, -(fitWidth*this.origx), -(fitHeight*this.origy), fitWidth, fitHeight);
        // -- render origin
        if (this.dbg && this.dbg.origin) {
            renderCtx.fillStyle = "white";
            renderCtx.fillRect(-2,-2, 4, 4);
        }
        // revert transform
        renderCtx.setTransform(cform);
    }

    _render(renderCtx, x=0, y=0, width=0, height=0) {
    }

    link(target) {
    }

    /**
     * convert to string
     */
    toString() {
        return Fmt.toString(this.constructor.name, this.tag);
    }

}