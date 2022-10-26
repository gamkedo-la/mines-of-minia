export { Door };

import { Assets } from '../base/assets.js';
import { Fmt } from '../base/fmt.js';
import { Rect } from '../base/rect.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { MiniaModel } from './miniaModel.js';


class Door extends MiniaModel {
    static dfltState = 'close';
    static dynamicLoS = true;
    static openable = true;

    static kinds = [
        'brown',
        'blue',
        'dark',
        'green',
    ];
    static dfltKind = 'brown';

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return new Rect({ width: 16, height: 16, color: 'rgba(255,255,0,.75)' });
    }

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // parse kind
        let kind = spec.kind || this.dfltKind;
        let locked = (kind !== 'brown');
        let facing = spec.facing || 'ns';
        // final spec
        let tag = `door.${facing}.${kind}`;
        return Object.assign( {}, this.spec, {
            kind: kind,
            facing: facing,
            locked: locked,
            x_sketch: Assets.get(`door.${facing}.${kind}`),
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
        // -- general properties
        this.state = spec.state || this.constructor.dfltState;
        // -- is door linked to boss room
        this.boss = spec.hasOwnProperty('boss') ? spec.boss : false;
        // -- is door locked?
        this.locked = spec.hasOwnProperty('locked') ? spec.locked : false;
        // -- hidden from player view?
        this.hidden = spec.hasOwnProperty('hidden') ? spec.hidden : false;
        // -- sketch
        this._linkSketch('_sketch', spec.sketch || this.constructor.dfltSketch, false);
        // -- sync xform to match sketch dimensions
        this.xform.width = this.sketch.width;
        this.xform.height = this.sketch.height;
        // -- los state
        this.blocksLoS = (this.state === 'close');
        this.closeSfx = spec.closeSfx || Assets.get('door.close', true);
    }

    destroy() {
        this._unlinkSketch('_sketch');
        super.destroy();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            kind: this.kind,
            state: this.state,
            hidden: this.hidden,
            locked: this.locked,
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
    open(actor) {
        let update = {
            state: 'open',
            blocksLoS: false,
        };
        // lock management
        if (this.locked && actor.inventory) {
            actor.inventory.removeKey(this.kind);
            update.locked = false;
        }
        UpdateSystem.eUpdate(this, update);
    }

    close() {
        if (this.closeSfx) this.closeSfx.play();
        UpdateSystem.eUpdate(this, { state: 'close', blocksLoS: true });
    }

    show() {
        this._sketch.show();
    }

    hide() {
        this._sketch.hide();
    }

    _render(ctx) {
        // do not render if hidden
        if (this.hidden) return;
        // update sketch dimensions
        this._sketch.width = this.xform.width;
        this._sketch.height = this.xform.height;
        // render
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}