export { UxMask };

import { UxView } from "./uxView.js";

// =========================================================================
class UxMask extends UxView {

    // METHODS -------------------------------------------------------------

    _prerender(ctx) {
        // setup clip area
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.xform.minx, this.xform.miny, this.xform.width, this.xform.height);
        ctx.clip();
    }

    _render(ctx) {
        if (this.dbg && this.dbg.viewMask) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.xform.minx, this.xform.miny, this.xform.width, this.xform.height);
        }
    }
    _postrender(ctx) {
        // restore from clip
        ctx.restore();
    }

}
