export { UxToggle };

import { Hierarchy } from './hierarchy.js';
import { Rect } from './rect.js';
import { Shape } from './shape.js';
import { UxView } from './uxView.js';
import { XForm } from './xform.js';

class UxToggle extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static evtToggled = 'toggle.toggled';
    static updateOnMouse = true;

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltUnpressed() { return new Rect({ color: 'rgba(255,255,255,.25)' }); }
    static get dfltHighlight() { return new Rect({ borderColor: 'yellow', border: 3, fill: false }); }
    static get dfltPressed() { return new Rect({ color: 'rgba(255,255,255,.75)' }); }
    static get dfltIcon() { return new Shape({ 
        fill: true,
        verts: [
                {x:2, y:19},
                {x:5, y:16},
                {x:10, y:21},
                {x:26, y:5},
                {x:29, y:8},
                {x:10, y:27},
        ],
        border: 2,
        borderColor: 'rgba(0,0,0,1)',
        color: 'rgba(255,255,255,1)'
    })};

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- event handlers
        this.onMouseClicked = this.onMouseClicked.bind(this);
        // -- initial value
        this._value = (spec.hasOwnProperty('value')) ? spec.value : true;
        // -- link sketches
        this._linkSketch('_unpressed', spec.unpressed || this.constructor.dfltUnpressed, false);
        this._linkSketch('_highlight', spec.highlight || this.constructor.dfltHighlight, false);
        this._linkSketch('_pressed', spec.pressed || this.constructor.dfltPressed, false);
        this._linkSketch('_icon', spec.icon || this.constructor.dfltIcon, false);
        this.sketch = (this._value) ? this._pressed : this._unpressed;
        // -- icon xform
        this.iconXform = spec.hasOwnProperty('iconXform') ? spec.iconXform : XForm.identity;
        Hierarchy.adopt(this.xform, this.iconXform);
    }

    destroy() {
        this._unlinkSketch('_unpressed');
        this._unlinkSketch('_pressed');
        this._unlinkSketch('_pressed');
        this._unlinkSketch('_icon');
        super.destroy();
    }

    // PROPERTIES ----------------------------------------------------------
    get value() {
        return this._value;
    }
    set value(v) {
        if (v !== this._value) {
            this._value = v;
            this.sketch.hide();
            this.sketch = (this._value) ? this._pressed : this._unpressed;
            this.sketch.show();
            this.evt.trigger(this.constructor.evtUpdated, {actor: this, update: { value: v }});
            this.evt.trigger(this.constructor.evtToggled, {actor: this, update: { value: v }});
        }
    }

    get unpressed() {
        return this._unpressed;
    }
    set unpressed(v) {
        if (!v) return;
        if (v !== this._unpressed) {
            this._linkSketch('_unpressed', v);
        }
    }

    get pressed() {
        return this._pressed;
    }
    set pressed(v) {
        if (!v) return;
        if (v !== this._pressed) {
            this._linkSketch('_pressed', v);
        }
    }

    get highlight() {
        return this._highlight;
    }
    set highlight(v) {
        if (!v) return;
        if (v !== this._highlight) {
            this._linkSketch('_highlight', v);
        }
    }

    get icon() {
        return this._icon;
    }
    set icon(v) {
        if (!v) return;
        if (v !== this._icon) {
            this._linkSketch('_icon', v);
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onMouseClicked(evt) {
        if (!this.active) return;
        if (evt.actor !== this) return;
        this._value = !this._value;
        this.sketch = (this._value) ? this._pressed : this._unpressed;
        this.evt.trigger(this.constructor.evtToggled, {actor: this, update: { value: this._value }});
        super.onMouseClicked(evt);
    }

    // METHODS -------------------------------------------------------------
    show() {
        this.sketch.show();
        this._icon.show();
    }
    hide() {
        this.sketch.hide();
        this._icon.hide();
    }

    _render(ctx) {
        // render active sketch
        this.sketch.width = this.xform.width;
        this.sketch.height = this.xform.height;
        this.sketch.render(ctx, this.xform.minx, this.xform.miny);
        // render highlight
        if (this.mouseOver) {
            this._highlight.width = this.xform.width;
            this._highlight.height = this.xform.height;
            this._highlight.render(ctx, this.xform.minx, this.xform.miny);
        }
        if (this.dbg && this.dbg.viewXform) this.iconXform.render(ctx);
        // apply transform
        this.iconXform.apply(ctx, false);
        // render icon
        if (this._value) {
            this._icon.width = this.iconXform.width;
            this._icon.height = this.iconXform.height;
            this._icon.render(ctx, this.iconXform.minx, this.iconXform.miny);
        }
        this.iconXform.revert(ctx, false);
    }

}