export { Rect };
import { Sketch }               from "./sketch.js";
import { Stats }                from "./stats.js";

/** ========================================================================
 * A rectangle is a sketch primitive.
 */
class Rect extends Sketch {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.border = spec.border || 0;
        this.borderColor = spec.borderColor || "black";
        this.color = spec.color || "rgba(127,127,127,.75)";
        this.fill = (spec.hasOwnProperty('fill')) ? spec.fill : true;
        this.dash = spec.dash;
    }

    // METHODS -------------------------------------------------------------
    _render(renderCtx, x=0, y=0, width=0, height=0) {
        Stats.count(`rect._render`);
        if (this.fill) {
            renderCtx.fillStyle = this.color;
            renderCtx.fillRect(x, y, width, height);
        }
        if (this.border) {
            renderCtx.lineWidth = this.border;
            renderCtx.strokeStyle = this.borderColor;
            if (this.dash) renderCtx.setLineDash(this.dash);
            renderCtx.strokeRect(x, y, width, height);
            if (this.dash) renderCtx.setLineDash([]);
        }
    }

}