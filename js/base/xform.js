export { XForm };

import { Bounds } from "./bounds.js";
import { Fmt } from "./fmt.js";
import { Gizmo } from "./gizmo.js";
import { Vect } from "./vect.js";

/** =============================================================================
 * Provides rectangular bounds and tranformation context including scale, translation, rotation based on given values.
 */
class XForm extends Gizmo {
    // STATIC VARIABLES ----------------------------------------------------
    static cat = 'XForm';

    // STATIC METHODS ------------------------------------------------------
    static feq(v1, v2) {
        return Math.abs(v1 - v2) < .00001;
    }

    // STATIC PROPERTIES ---------------------------------------------------
    static get identity() {
        return new XForm();
    }

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * @param {*} spec 
     * - left, right, top, bottom, border - applies stretch effect to transform, using values as percent (0-1) or parent transform
     *   Use equal border (e.g.: border=.5) for no stretch
     * - oleft, oright, otop, obottom, offset - applies offset from border (above) in pixels
     * - origx, origy - the origin to use for transform in percent of width/height
     * - scalex, scaley - scale to apply to transform
     * - angle - rotation angle to apply to transform
     * - x, y - translation to apply to transform
     * - parent - parent tranform
     * - stretchx,stretchy - should transform be stretched to match parent width/height?
     * - offx,offy - offset from origin in pixels (applicable if not stretched)
     * - width, height (applicable if not stretched)
     */
    cpost(spec) {
        // parent of transform, should point to another transform instance (if any)
        this.parent = spec.parent;
        // borders from parent transform, in percent (0-1)
        this.left = spec.left || 0;
        this.right = spec.right || 0;
        this.top = spec.top || 0;
        this.bottom = spec.bottom || 0;
        if (spec.border) {
            this.left = this.right = this.top = this.bottom = spec.border;
        }
        // origin of transform, in percent of parent's width (0-1)
        this.origx = (spec.hasOwnProperty("origx")) ? spec.origx : .5;
        this.origy = (spec.hasOwnProperty("origy")) ? spec.origy : .5;
        // -- should transform be stretched to match parent width/height?
        this.stretchx = spec.hasOwnProperty('stretchx') ? spec.stretchx : true;
        this.stretchy = spec.hasOwnProperty('stretchy') ? spec.stretchy : true;
        if (spec.hasOwnProperty('stretch')) {
            this.stretchx = spec.stretch;
            this.stretchy = spec.stretch;
        }
        // offset from borders, in pixels
        this.oleft = spec.oleft || 0;
        this.oright = spec.oright || 0;
        this.otop = spec.otop || 0;
        this.obottom = spec.obottom || 0;
        if (spec.offset) {
            this.oleft = this.oright = this.otop = this.obottom = spec.offset;
        }
        // x/y offset (in pixels)
        this.offx = spec.offx || 0;
        this.offy = spec.offy || 0;
        // delta from parent width (in pixels)
        // fixed height/width of transform, applies if one of these is true:
        // - parent is undefined
        // - stretch for dimension is false
        this._width = spec.width || 0;
        this._height = spec.height || 0;
        // scale to apply for this transform
        this.scalex = spec.scalex || 1;
        this.scaley = spec.scaley || 1;
        // angle to apply for this transform
        this.angle = spec.angle || 0;
        // translation to apply for this transform
        this.x = spec.x || 0;
        this.y = spec.y || 0;
    }

    // PROPERTIES ----------------------------------------------------------

    // delta from parent origin
    get dox() {
        let v = (this.parent && this.stretchx) ? (this.origx*this.oleft) - (1-this.origx)*(this.oright) : this.offx;
        if (this.parent) {
            v += this.parent.minx;
            v += (this.parent.width * this.left);
            v += (this.width * this.origx);
            v += (-this.dwidth * (1-this.origx));
        }
        return v;
    }
    get doy() {
        let v = (this.parent && this.stretchy) ? (this.origy*this.otop) - (1-this.origy)*(this.obottom) : this.offy;
        if (this.parent) {
            v += this.parent.miny;
            v += (this.parent.height * this.top);
            v += (this.height * this.origy);
            v += (-this.dheight * (1-this.origy));
        }
        return v;
    }

    // inverse scale of transform
    get iscalex() {
        return (this.scalex) ? 1/this.scalex : 0;
    }
    get iscaley() {
        return (this.scaley) ? 1/this.scaley : 0;
    }

    // get minimum x,y in local coords
    get minx() {
        return -(this.origx*this.width);
    }
    get miny() {
        return -(this.origy*this.height);
    }

    // minimum in world coords
    get wminx() {
        return this.getWorld(new Vect(this.minx, this.miny)).x;
    }
    get wminy() {
        return this.getWorld(new Vect(this.minx, this.miny)).y;
    }

    // get center x,y in local coords
    get centerx() {
        return (this.width*(.5-this.origx));
    }
    get centery() {
        return (this.height*(.5-this.origy));
    }

    // center in world coords
    get wcenterx() {
        return this.getWorld(new Vect(this.centerx, this.centery)).x;
    }
    get wcentery() {
        return this.getWorld(new Vect(this.centerx, this.centery)).y;
    }

    // get maximum x,y in local coords
    get maxx() {
        return (1-this.origx)*this.width;
    }
    get maxy() {
        return (1-this.origy)*this.height;
    }

    // max in world coords
    get wmaxx() {
        return this.getWorld(new Vect(this.maxx, this.maxy)).x;
    }
    get wmaxy() {
        return this.getWorld(new Vect(this.maxx, this.maxy)).y;
    }

    get isIdentity() {
        return this.scalex === 1 &&
               this.scaley === 1 &&
               this.angle === 0 &&
               this.x === 0 &&
               this.y === 0;
    }

    // width is the width of my rectangle
    // - takes into account border/offset values
    // - does not take into account scaling
    get width() {
        let v = (this.parent && this.stretchx) ? this.parent.width * (1-this.left-this.right) : this._width;
        v += this.dwidth;
        return v;
    }
    set width(v) {
        v -= this.dwidth;
        this._width = v;
    }

    // height of rectangle
    get height() {
        let v = (this.parent && this.stretchy) ? this.parent.height * (1-this.top-this.bottom) : this._height;
        v += this.dheight;
        return v;
    }
    set height(v) {
        v -= this.dheight;
        this._height = v;
    }

    // delta from parent width/height (in pixels)
    get dwidth() {
        return -(this.oleft + this.oright);
    }
    get dheight() {
        return -(this.otop + this.obottom);
    }

    // bounds
    get bounds() {
        return new Bounds(this.minx, this.miny, this.width, this.height);
    }
    get wbounds() {
        return Bounds.fromMinMax(this.wminx, this.wminy, this.wmaxx, this.wmaxy);
    }

    // METHODS -------------------------------------------------------------

    // apply local coords, then scale, rotation, translation
    apply(ctx, chain=true) {
        if (chain && this.parent) this.parent.apply(ctx);
        let dox = this.dox;
        let doy = this.doy;
        if (dox || doy) ctx.translate(dox, doy);
        if (this.angle) ctx.rotate(this.angle);
        if (this.scalex !== 1|| this.scaley !== 1) ctx.scale(this.scalex, this.scaley);
        if (this.x || this.y) ctx.translate(this.x, this.y);
    }

    // revert transform
    revert(ctx, chain=true) {
        // revert reverses order of operations
        if (this.x || this.y) ctx.translate(-this.x, -this.y);
        if (this.scalex !== 1|| this.scaley !== 1) ctx.scale(this.iscalex, this.iscaley);
        if (this.angle) ctx.rotate(-this.angle);
        let dox = this.dox;
        let doy = this.doy;
        if (dox || doy) ctx.translate(-dox, -doy);
        if (chain && this.parent) this.parent.revert(ctx);
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.minx, this.miny, this.x, this.y, this.scalex, this.scaley, this.angle);
    }

    /**
     * translate world position to local position
     * @param {*} worldPos 
     */
    getLocal(worldPos, chain=true) {
        let localPos;
        // apply parent transform (if any)
        if (chain && this.parent) {
            localPos = this.parent.getLocal(worldPos);
        } else {
            localPos = worldPos.copy();
        }
        // perform world->local translation
        localPos.sub(this.dox, this.doy);
        // apply local transforms
        if (this.angle) localPos.rotate(-this.angle, true);
        if (this.scalex !== 1|| this.scaley !== 1) localPos.div(this.scalex, this.scaley);
        if (this.x || this.y) localPos.sub(this.x, this.y);
        return localPos;
    }

    /**
     * translate local position to world position
     * @param {*} localPos 
     */
    getWorld(localPos, chain=true) {
        let worldPos = localPos.copy();
        // apply local transforms
        if (this.x || this.y) worldPos.add(this.x, this.y);
        if (this.scalex !== 1|| this.scaley !== 1) worldPos.mult(this.scalex, this.scaley);
        if (this.angle) worldPos.rotate(this.angle, true);
        // perform local->world translation
        worldPos.add(this.dox, this.doy);
        // apply parent transform (if any)
        if (chain && this.parent) worldPos = this.parent.getWorld(worldPos);
        return worldPos;
    }

    getWorldBounds(chain=true) {
        let min = this.getWorld(new Vect(this.minx, this.miny), chain);
        let max = this.getWorld(new Vect(this.maxx, this.maxy), chain);
        return Bounds.fromMinMax(min.x, min.y, max.x, max.y);
    }

    getLocalScale() {
        let l1 = this.getLocal(new Vect(1,1));
        let l0 = this.getLocal(Vect.zero);
        return new Vect(l1.sub(l0));
    }

    render(ctx, chain=false, color="rgba(255,255,0,.5") {
        // get to local coordinate space
        if (chain && this.parent) this.parent.apply(ctx);
        let dox = this.dox;
        let doy = this.doy;
        if (dox || doy) ctx.translate(dox, doy);
        // bounding box before local transform
        ctx.strokeStyle = color;
        ctx.setLineDash([5,5]);
        ctx.lineWidth = 3;
        ctx.strokeRect(this.minx, this.miny, this.width, this.height);
        ctx.setLineDash([]);
        // apply local transform
        if (this.angle) ctx.rotate(this.angle);
        if (this.scalex !== 1|| this.scaley !== 1) ctx.scale(this.scalex, this.scaley);
        if (this.x || this.y) ctx.translate(this.x, this.y);
        // resulting bounding box...
        ctx.strokeRect(this.minx, this.miny, this.width, this.height);
        // origin
        ctx.fillStyle = "red";
        ctx.fillRect(-4, -4, 8, 8);
        // revert transformation
        this.revert(ctx, chain);
    }
}