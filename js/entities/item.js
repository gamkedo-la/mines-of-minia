export { Item };

import { Fmt } from '../base/fmt.js';
import { Rect } from '../base/rect.js';
import { MiniaModel } from './miniaModel.js';

/**
 * Generic lootable item
 */
class Item extends MiniaModel {
    // STATIC VARIABLES ----------------------------------------------------
    static lootable = true;
    static stackable = false;
    static discoverable = false;
    static usable = false;
    static dfltDescription = 'an unremarkable item';
    static evtEquipped = 'item.equipped';
    static evtUnequipped = 'item.unequipped';
    static evtUse = 'item.use';
    static evtEmerged = 'item.emerged';

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return new Rect({ width: 16, height: 16, color: 'rgba(255,255,0,.75)' });
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.name = spec.name || 'item';
        this.description = spec.description || this.constructor.dfltDescription;
        // -- for stackable items...
        this.count = spec.count || 1;
        // -- charms (buffs/debuffs)
        this.charms = [];
        if (spec.charms) spec.charms.map((this.addCharm.bind(this)));

        // -- sketch
        this._linkSketch('_sketch', spec.sketch || this.constructor.dfltSketch, false);
        this._sketch.link(this);
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
            x_sketch: { cls: 'AssetRef', tag: this._sketch.tag },
            x_charms: this.charms.map((v) => v.as_kv()),
            name: this.name,
            description: this.description,
            count: this.count,
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

    onSketchUpdate(evt) {
        // update xform width/height
        this.xform.width = this.sketch.width;
        this.xform.height = this.sketch.height;
        super.onSketchUpdate(evt);
    }

    // METHODS -------------------------------------------------------------

    addCharm(charm) {
        this.charms.push(charm);
        charm.link(this);
    }
    removeCharm(charm) {
        let idx = this.charms.indexOf(charm);
        if (idx !== -1) this.charms.splice(idx, 1);
        charm.unlink();
    }

    _render(ctx) {
        // update sketch dimensions
        this._sketch.width = this.xform.width;
        this._sketch.height = this.xform.height;
        // render
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
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

    toString() {
        return Fmt.toString(this.constructor.name, this.gid, this.name, this.tag, this.x, this.y);
    }

}