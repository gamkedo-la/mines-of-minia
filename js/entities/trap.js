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
        return Assets.get('trap', true);
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
        // -- hidden from player view?
        this.hidden = spec.hasOwnProperty('hidden') ? spec.hidden : false;
        // -- sketch
        this._linkSketch('_sketch', spec.sketch || this.constructor.dfltSketch, false);
        // -- charms (buffs/debuffs)
        this.charms = [];
        if (spec.charms) spec.charms.map((this.addCharm.bind(this)));
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
            hidden: this.hidden,
            x_sketch: { cls: 'AssetRef', tag: this._sketch.tag },
            x_charms: this.charms.map((v) => v.as_kv()),
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
        //console.log(`${this} triggered by ${actor}`);
        // trigger trap event
        this.evt.trigger(this.constructor.evtTriggered, { actor: actor, trigger: this });
        // update trap state
        UpdateSystem.eUpdate(this, { state: 'inactive', hidden: false });
        // trigger sfx
        if (this.triggerSfx) this.triggerSfx.play();
    }

    show() {
        this._sketch.show();
    }

    hide() {
        this._sketch.hide();
    }

    addCharm(charm) {
        charm.link(this);
    }
    removeCharm(charm) {
        charm.unlink();
    }

    _render(ctx) {
        if (this.hidden) return;
        // update sketch dimensions
        this._sketch.width = this.xform.width;
        this._sketch.height = this.xform.height;
        // render
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
        /*
        // FIXME
        if (this.hidden) {
            let r = new Rect({ width: 16, height: 16, border: 1, borderColor: 'rgba(100,100,100,.4)', fill: false});
            r.render(ctx, this.xform.minx, this.xform.miny);
        }
        */
    }

}