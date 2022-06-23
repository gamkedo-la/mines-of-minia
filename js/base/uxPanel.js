export { UxPanel };

import { Rect }             from './rect.js';
import { UxView }           from './uxView.js';

class UxPanel extends UxView {
    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return new Rect({ color: 'rgba(255,255,255,.25)' });
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this.closeOnSketchDone = (spec.hasOwnProperty('closeOnSketchDone')) ? spec.closeOnSketchDone : false;
        // -- link sketches to gizmo
        this._linkSketch('_sketch', spec.sketch || this.constructor.dfltSketch, false);
    }

    destroy() {
        this._unlinkSketch('_sketch');
        super.destroy();
    }

    // PROPERTIES ----------------------------------------------------------
    get sketch() {
        return this._sketch;
    }
    set sketch(v) {
        if (!v) return;
        if (v !== this._sketch) {
            this._linkSketch('_sketch', v);
        }
    }

    // METHODS -------------------------------------------------------------
    show() {
        this._sketch.show();
    }
    hide() {
        this._sketch.hide();
    }

    _render(ctx) {
        // update sketch dimensions
        this._sketch.width = this.xform.width;
        this._sketch.height = this.xform.height;
        //if (this.tag.startsWith('tile')) console.log(`${this} render @ ${this.xform.minx},${this.xform.miny}`);
        // render
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}
