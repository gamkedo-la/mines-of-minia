export { Collider };

import { Bits }             from "./bits.js";
import { Fmt }              from "./fmt.js";

class Collider {
    // STATIC VARIABLES ----------------------------------------------------
    static bits = new Bits({something: 1});

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.cls = this.constructor.name;
        // -- center of collider (with respect to object that collider is attached to)
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        // -- dimensions
        this.width = (spec.hasOwnProperty("width")) ? spec.width : 0;
        this.height = (spec.hasOwnProperty("height")) ? spec.height : 0;
        this._halfWidth = Math.round(this.width/2);
        this._halfHeight = Math.round(this.height/2);
        // -- collider interaction
        this.blockedBy = spec.hasOwnProperty("blockedBy") ? spec.blockedBy : this.constructor.bits.all;
        this.blocks = spec.hasOwnProperty("blocks") ? spec.blocks : this.constructor.bits.all;
        // -- rendering info
        this.color = spec.color || "rgba(127,0,0,.4)";
    }

    // PROPERTIES ----------------------------------------------------------
    get minx() {
        return this.x - this._halfWidth;
    }
    get maxx() {
        return this.x + this._halfWidth;
    }
    get miny() {
        return this.y - this._halfHeight;
    }
    get maxy() {
        return this.y + this._halfHeight;
    }

    // METHODS -------------------------------------------------------------

    toString() {
        return Fmt.toString(this.constructor.name, this.x, this.y, this.width, this.height, this.blockedBy, this.blocks);
    }

};