export { Sprite };
import { Sketch } from "./sketch.js";

/** ========================================================================
 * A sprite is a sketch used to render a JS image.
 */
class Sprite extends Sketch {
    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        const img = (spec.hasOwnProperty("img")) ? spec.img : { width: 0, height: 0};
        spec.width = (spec.hasOwnProperty("width")) ? spec.width : img.width;
        spec.height = (spec.hasOwnProperty("height")) ? spec.height : img.height;
        super.cpost(spec);
        this.img = img;
        this.smooth = spec.hasOwnProperty('smooth') ? spec.smooth : false;
    }
    
    // PROPERTIES ----------------------------------------------------------
    get iwidth() {
        return this.img.width;
    }
    get iheight() {
        return this.img.height;
    }

    // METHODS -------------------------------------------------------------
    /**
     * draw the sprite
     */
    _render(renderCtx, x=0, y=0, width=0, height=0) {
        // scale if necessary
        if ((width !== this.img.width) || (height !== this.img.height)) {
            if (this.img.width && this.img.height) {
                // src dims
                let sw = this.img.width;
                let sh = this.img.height;
                // dst dims
                let dw = width;
                let dh = height;
                renderCtx.imageSmoothingEnabled = this.smooth;
                renderCtx.mozImageSmoothingEnabled = this.smooth;
                renderCtx.webkitImageSmoothingEnabled = this.smooth;
                renderCtx.msImageSmoothingEnabled = this.smooth;
                renderCtx.drawImage(this.img, 
                    0, 0, sw, sh, 
                    x, y, dw, dh);
            }
        } else {
            renderCtx.imageSmoothingEnabled = false;
            renderCtx.mozImageSmoothingEnabled = false;
            renderCtx.webkitImageSmoothingEnabled = false;
            renderCtx.msImageSmoothingEnabled = false;
            renderCtx.drawImage(this.img, x, y);
        }
    }

}
