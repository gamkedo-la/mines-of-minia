export { UxButton };

import { Hierarchy } from './hierarchy.js';
import { Rect } from './rect.js';
import { Text } from './text.js';
import { UxView } from './uxView.js';
import { XForm } from './xform.js';

class UxButton extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static updateOnMouse = true;

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltUnpressed() { return new Rect({ color: 'rgba(255,255,255,.25)' }); }
    static get dfltHighlight() { return new Rect({ borderColor: 'yellow', border: 3, fill: false }); }
    static get dfltPressed() { return new Rect({ color: 'rgba(255,255,255,.75)' }); }
    static get dfltText() { return new Text({x_form: {border: .1}}); };

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        if (!spec.hasOwnProperty('flags')) spec.flags = ['interactable'];
    }
    cpost(spec) {
        super.cpost(spec);
        if (spec.mouseClickedSound) this.mouseClickedSound = spec.mouseClickedSound;
        // -- bind event handlers
        this.onMouseToggle = this.onMouseToggle.bind(this);
        this.evt.listen(this.constructor.evtMouseDown, this.onMouseToggle);
        this.evt.listen(this.constructor.evtMouseUp, this.onMouseToggle);
        // -- link sketches to gizmo
        this._text = spec.text || this.constructor.dfltText;
        this._hltext = spec.hltext;
        this._linkSketch('_unpressed', spec.unpressed || this.constructor.dfltUnpressed, false);
        this._linkSketch('_pressed', spec.pressed || this.constructor.dfltPressed, false);
        this._linkSketch('_highlight', spec.highlight || this.constructor.dfltHighlight, false);
        this.sketch = this._unpressed;
        // -- text xform
        this.textXform = spec.hasOwnProperty('textXform') ? spec.textXform : XForm.identity;
        Hierarchy.adopt(this.xform, this.textXform);
    }

    destroy() {
        this._unlinkSketch('_unpressed');
        this._unlinkSketch('_pressed');
        this._unlinkSketch('_highlight');
        this._text.hide();
        this.evt.ignore(this.constructor.evtMouseDown, this.onMouseToggle);
        this.evt.ignore(this.constructor.evtMouseUp, this.onMouseToggle);
        super.destroy();
    }

    // PROPERTIES ----------------------------------------------------------
    get text() {
        return this._text.text;
    }
    set text(v) {
        if (v !== this._text.text) {
            this._text.text = v;
            this.evt.trigger(this.constructor.evtUpdated, {actor: this, update: { value: v }});
        }
    }

    get unpressed() {
        return this._unpressed;
    }
    set unpressed(v) {
        if (!v) return;
        if (v !== this._unpressed) {
            let resetSketch = (this.sketch === this._unpressed);
            this._linkSketch('_unpressed', v);
            if (resetSketch) this.sketch = this._unpressed;
        }
    }

    get pressed() {
        return this._pressed;
    }
    set pressed(v) {
        if (!v) return;
        if (v !== this._pressed) {
            let resetSketch = (this.sketch === this._pressed);
            this._linkSketch('_pressed', v);
            if (resetSketch) this.sketch = this._pressed;
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

    // EVENT HANDLERS ------------------------------------------------------
    onMouseToggle(evt) {
        if (!this.active) return;
        let lastSketch = this.sketch;
        this.sketch = (this.mouseDown) ? this._pressed : this._unpressed;
        if (lastSketch !== this.sketch) {
            lastSketch.hide();
            this.sketch.show();
        }
        // propagate update
        this.evt.trigger(this.constructor.evtUpdated, {actor: this, update: { mouse: true }});
    }

    // METHODS -------------------------------------------------------------
    show() {
        this.sketch.show();
        this._highlight.show();
        this._text.show();
        if (this._hltext) this._hltext.show();
    }
    hide() {
        this.sketch.hide();
        this._highlight.hide();
        this._text.hide();
        if (this._hltext) this._hltext.hide();
    }

    _render(ctx) {
        // render active sketch
        this.sketch.width = this.xform.width;
        this.sketch.height = this.xform.height;
        this.sketch.render(ctx, this.xform.minx, this.xform.miny);
        // render highlight
        if (this.mouseOver && !this.mouseDown) {
            this._highlight.width = this.xform.width;
            this._highlight.height = this.xform.height;
            this._highlight.render(ctx, this.xform.minx, this.xform.miny);
        }
        if (this.dbg && this.dbg.viewXform) this.textXform.render(ctx);
        // apply text transform
        this.textXform.apply(ctx, false);
        // render text
        if (this._hltext && this.mouseOver && !this.mouseDown) {
            this._hltext.width = this.textXform.width;
            this._hltext.height = this.textXform.height;
            this._hltext.render(ctx, this.textXform.minx, this.textXform.miny);
        } else {
            this._text.width = this.textXform.width;
            this._text.height = this.textXform.height;
            this._text.render(ctx, this.textXform.minx, this.textXform.miny);
        }
        this.textXform.revert(ctx, false);
    }
}