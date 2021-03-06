export { Bounds };

import { Vect } from "./vect.js";
import { Fmt } from "./fmt.js";
import { Stats } from "./stats.js";

// =========================================================================
class Bounds {
    // STATIC METHODS ------------------------------------------------------
    static hasBounds(obj) {
        return obj && 
               obj.minx !== undefined &&
               obj.maxx !== undefined &&
               obj.miny !== undefined &&
               obj.maxy !== undefined;
    }

    static _intersects(minx1, miny1, maxx1, maxy1, minx2, miny2, maxx2, maxy2) {
        Stats.count("Bounds.intersects");
        let minx = Math.max(minx1, minx2);
        let maxx = Math.min(maxx1, maxx2);
        let miny = Math.max(miny1, miny2);
        let maxy = Math.min(maxy1, maxy2);
        let width = maxx-minx;
        let height = maxy-miny;
        if (width >= 0 && height >= 0) {
            return new Bounds(minx, miny, width, height);
        }  else {
            return false;
        }
    }

    static _overlaps(minx1, miny1, maxx1, maxy1, minx2, miny2, maxx2, maxy2) {
        Stats.count("Bounds.overlaps");
        let minx = Math.max(minx1, minx2);
        let maxx = Math.min(maxx1, maxx2);
        let miny = Math.max(miny1, miny2);
        let maxy = Math.min(maxy1, maxy2);
        return maxx > minx && maxy > miny;
    }

    static _contains(minx, miny, maxx, maxy, x, y) {
        return x >= minx && x <= maxx &&
               y >= miny && y <= maxy;
    }

    static intersects(obj1, obj2) {
        return this._intersects(
            obj1.minx,
            obj1.miny,
            obj1.maxx,
            obj1.maxy,
            obj2.minx,
            obj2.miny,
            obj2.maxx,
            obj2.maxy,
        );
    }

    static overlaps(obj1, obj2) {
        if (('minx' in obj1) && ('miny' in obj1) && ('maxx' in obj1) && ('maxy' in obj1)) {
            if (('minx' in obj2) && ('miny' in obj2) && ('maxx' in obj2) && ('maxy' in obj2)) {
                return this._overlaps(
                    obj1.minx,
                    obj1.miny,
                    obj1.maxx,
                    obj1.maxy,
                    obj2.minx,
                    obj2.miny,
                    obj2.maxx,
                    obj2.maxy,
                );
            } else if (('x' in obj2) && ('y' in obj2)) {
                return this._contains(
                    obj1.minx,
                    obj1.miny,
                    obj1.maxx,
                    obj1.maxy,
                    obj2.x,
                    obj2.y,
                );
            }
        } else if (('x' in obj1) && ('y' in obj1)) {
            if (('minx' in obj2) && ('miny' in obj2) && ('maxx' in obj2) && ('maxy' in obj2)) {
                return this._contains(
                    obj2.minx,
                    obj2.miny,
                    obj2.maxx,
                    obj2.maxy,
                    obj1.x,
                    obj1.y,
                );
            } else if (('x' in obj2) && ('y' in obj2)) {
                return obj1.x === obj2.x && obj1.y === obj2.y;
            }
        }
        return false;
    }

    static contains(obj1, obj2) {
        if (('minx' in obj1) && ('miny' in obj1) && ('maxx' in obj1) && ('maxy' in obj1)) {
            if (('x' in obj2) && ('y' in obj2)) {
                return this._contains(
                    obj1.minx,
                    obj1.miny,
                    obj1.maxx,
                    obj1.maxy,
                    obj2.x,
                    obj2.y,
                );
            }
        } else if (('x' in obj1) && ('y' in obj1)) {
            if (('x' in obj2) && ('y' in obj2)) {
                return obj1.x === obj2.x && obj1.y === obj2.y;
            }
        }
        return false;
    }

    static containsXY(obj, x, y) {
        if (('minx' in obj) && ('miny' in obj) && ('maxx' in obj) && ('maxy' in obj)) {
            return this._contains(
                obj.minx,
                obj.miny,
                obj.maxx,
                obj.maxy,
                x,
                y,
            );
        } else if (('x' in obj) && ('y' in obj)) {
            return obj.x === x && obj.y === y;
        }
    }


    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * create a new bounds
     * @param {*} x - x position of minimum point within bounds
     * @param {*} y - y position of minimum point within bounds
     * @param {*} width - width in pixels
     * @param {*} height - height in pixels
     */
    constructor(x, y, width, height) {
        // the local position (minimum)
        this.x = x;
        this.y = y;
        // the size contraints (width/height)
        this.width = width;
        this.height = height;
    }

    // STATIC PROPERTIES ---------------------------------------------------
    static get zero() {
        return new Bounds(0, 0, 0, 0);
    }

    // STATIC FUNCTIONS ----------------------------------------------------
    static fromMinMax(minx, miny, maxx, maxy) {
        return new Bounds(minx, miny, maxx-minx, maxy-miny);
    }

    // PROPERTIES ----------------------------------------------------------
    get pos() {
        return new Vect(this.x, this.y);
    }

    get minx() {
        return this.x;
    }
    get miny() {
        return this.y;
    }
    get min() {
        return new Vect(this.x, this.y);
    }

    get maxx() {
        return this.x + this.width;
    }
    get maxy() {
        return this.y + this.height;
    }
    get max() {
        return new Vect(this.x + this.width, this.y + this.height);
    }

    get midx() {
        return this.x + (this.width * .5);
    }
    get midy() {
        return this.y + (this.height * .5);
    }
    get mid() {
        return new Vect(this.x + (this.width * .5), this.y + (this.height * .5));
    }

    // STATIC FUNCTIONS ----------------------------------------------------
    static newOrExtend(ob, nb) {
        if (!ob) return nb;
        ob.extend(nb);
        return ob;
    }

    // METHODS -------------------------------------------------------------
    /**
     * make a copy of the current bounds and return
     */
    copy() {
        return new Bounds(this.x, this.y, this.width, this.height);
    }

    /**
     * determine if the given position (in world space) is within the current bounds
     * @param {Vect} pos - position to check
     */
    contains(pos) {
        return Bounds.contains(this, pos);
    }

    /**
     * determine if the given position (in world space) is within the current bounds
     */
    containsXY(x, y) {
        return Bounds.containsXY(this, x, y);
    }

    /**
     * determine if given bounds overlaps current bounds
     * @param {Bounds} other - other bounds to evaluate
     */
    overlaps(other) {
        return Bounds.overlaps(this, other);
    }

    /**
     * determine if given bounds intersects current bounds
     * @param {Bounds} other - other bounds to evaluate
     */
    intersects(other) {
        return Bounds.intersects(this, other);
    }

    /**
     * Extend the current bounds to include the extend of given bounds
     * @param {*} other 
     */
    extend(other) {
        if (!other) return this;
        if (other.minx < this.minx) {
            let delta = this.minx - other.minx;
            this.width += delta;
            this.x = other.minx;
        }
        if (other.maxx > this.maxx) {
            let delta = other.maxx - this.maxx;
            this.width += delta;
        }
        if (other.miny < this.miny) {
            let delta = this.miny - other.miny;
            this.height += delta;
            this.y = other.minx;
        }
        if (other.maxy > this.maxy) {
            let delta = other.maxy - this.maxy;
            this.height += delta;
        }
        return this;
    }

    equals(other) {
        if (!other) return this;
        if (this.x !== other.x) return false;
        if (this.y !== other.y) return false;
        if (this.width !== other.width) return false;
        if (this.height !== other.height) return false;
        return true;
    }

    toString() {
        return Fmt.toString("Bounds", this.x, this.y, this.maxx, this.maxy, this.width, this.height);
    }
}
