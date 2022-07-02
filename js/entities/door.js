export { Door };

import { Fmt } from '../base/fmt.js';
import { Rect } from '../base/rect.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { MiniaModel } from './miniaModel.js';

class Door extends MiniaModel {
    static dfltState = 'close';
    static dynamicLoS = true;

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return new Rect({ width: 16, height: 16, color: 'rgba(255,255,0,.75)' });
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- general properties
        this.state = spec.state || this.constructor.dfltState;
        // -- sketch
        this._linkSketch('_sketch', spec.sketch || this.constructor.dfltSketch, false);
        this._sketch.link(this);
        // -- sync xform to match sketch dimensions
        this.xform.width = this.sketch.width;
        this.xform.height = this.sketch.height;
        // -- los state
        this.blocksLoS = (this.state === 'close');
    }

    destroy() {
        this._unlinkSketch('_sketch');
        super.destroy();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            state: this.state,
            x_sketch: { cls: 'AssetRef', tag: this._sketch.tag },
        });
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
    open() {
        UpdateSystem.eUpdate(this, { state: 'open', blocksLoS: false });
    }

    close() {
        UpdateSystem.eUpdate(this, { state: 'close', blocksLoS: true });
    }

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
        // render
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}