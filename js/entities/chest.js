export { Chest };

import { DropLootAction } from '../actions/loot.js';
import { DestroyAction } from '../base/actions/destroy.js';
import { Rect } from '../base/rect.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { MiniaModel } from './miniaModel.js';

class Chest extends MiniaModel {
    static dfltState = 'close';
    static dynamicLoS = true;
    static openable = true;
    static dfltOpenTTL = 1000;

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
        // -- loot
        this.loot = spec.loot || [];
        // -- sync xform to match sketch dimensions
        this.xform.width = this.sketch.width;
        this.xform.height = this.sketch.height;
        // -- los state
        this.blocksLoS = (this.state === 'close');
        this.openTTL = spec.openTTL || this.constructor.dfltOpenTTL;
    }

    destroy() {
        this._unlinkSketch('_sketch');
        super.destroy();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            state: this.state,
            loot: this.loot,
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
        // spawn any loot
        for (let loot of (this.loot || [])) {
            ActionSystem.assign(this, new DropLootAction({
                lootSpec: loot,
            }));
        }
        // destroy after timer
        ActionSystem.assign(this, new DestroyAction({
            ttl: this.openTTL,
        }));
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