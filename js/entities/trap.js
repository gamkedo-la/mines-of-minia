export { Trap };

import { Assets } from '../base/assets.js';
import { Rect } from '../base/rect.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { MiniaModel } from './miniaModel.js';

class Trap extends MiniaModel {
    static triggerable = true;
    static dfltState = 'armed';
    static evtTriggered = 'trap.triggered';

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return new Rect({ width: 10, height: 10, borderColor: 'rgba(255,255,0,.75)', fill: false, border: 1 });
    }

    static get dfltTriggerSfx() {
        if (!this._dfltTriggerSfx) this._dfltTriggerSfx = Assets.get('trap.trigger', true);
        return this._dfltTriggerSfx;
    }

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( {}, this.spec, {
            blocks: 0,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- general properties
        this.state = spec.state || this.constructor.dfltState;
        // -- sketch
        this._linkSketch('_sketch', spec.sketch || this.constructor.dfltSketch, false);
        this._sketch.link(this);
        // -- sfx
        this.triggerSfx = (spec.hasOwnProperty('triggerSfx')) ? spec.triggerSfx : this.constructor.dfltTriggerSfx;
        // -- sync xform to match sketch dimensions
        this.xform.width = this.sketch.width;
        this.xform.height = this.sketch.height;
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
    trigger(actor) {
        console.log(`${this} triggered by ${actor}`);
        // trigger trap event
        this.evt.trigger(this.constructor.evtTriggered, { actor: actor, trigger: this });
        // update trap state
        UpdateSystem.eUpdate(this, { state: 'inactive' });
        // trigger sfx
        if (this.triggerSfx) this.triggerSfx.play();
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