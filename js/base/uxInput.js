export { UxInput };

import { Events } from './event.js';
import { Hierarchy } from './hierarchy.js';
import { Keys } from './keys.js';
import { Rect } from './rect.js';
import { MouseSystem } from './systems/mouseSystem.js';
import { Text } from './text.js';
import { Timer } from './timer.js';
import { Util } from './util.js';
import { UxView } from './uxView.js';
import { XForm } from './xform.js';

class UxInput extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltCharset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    static dfltCursorBlinkRate = 500;
    static updateOnMouse = true;

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() { return new Rect({ color: 'rgba(255,255,255,.25)' }); }
    static get dfltHighlight() { return new Rect({ borderColor: 'yellow', border: 3, fill: false }); }
    static get dfltCursor() { return new Rect({ color: 'rgba(255,255,255,.5)', width: 3, height: 10 }); }
    static get dfltText() { return new Text({align: 'left', x_form: {border: .1}}); };

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onCursorBlink = this.onCursorBlink.bind(this);
        this.onSystemMouseClicked = this.onSystemMouseClicked.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        Events.listen(MouseSystem.evtClicked, this.onSystemMouseClicked);
        // -- link sketches
        this._linkSketch('_sketch', spec.sketch || this.constructor.dfltSketch, false);
        this._linkSketch('_highlight', spec.highlight || this.constructor.dfltHighlight, false);
        this._linkSketch('_cursor', spec.cursor || this.constructor.dfltCursor, false);
        // -- text xform
        this._text = spec.text || this.constructor.dfltText;
        this.textXform = spec.hasOwnProperty('textXform') ? spec.textXform : XForm.identity;
        Hierarchy.adopt(this.xform, this.textXform);
        // -- local vars
        this.cursorIdx = 0;
        this._cursx = 0;
        this.cursorBlinkRate = spec.hasOwnProperty('cursorBlinkRate') ? spec.cursorBlinkRate : this.constructor.dfltCursorBlinkRate;
        this.cursorOn = true;
        this.charset = spec.charset || this.constructor.dfltCharset;
        this._selected = false;
        // -- timers
        this.blinkTimer;
    }

    destroy() {
        this._unlinkSketch('_sketch');
        this._unlinkSketch('_highlight');
        this._unlinkSketch('_cursor');
        this._text.hide();
        Events.ignore(Keys.evtDown, this.onKeyDown);
        Events.ignore(MouseSystem.evtClicked, this.onSystemMouseClicked);
        if (this.blinkTimer) this.blinkTimer.destroy();
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

    get sketch() {
        return this._sketch;
    }
    set sketch(v) {
        if (!v) return;
        if (v !== this._sketch) {
            this._linkSketch('_sketch', v);
        }
    }

    get cursor() {
        return this._cursor;
    }
    set cursor(v) {
        if (!v) return;
        if (v !== this._cursor) {
            this._linkSketch('_cursor', v);
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

    get cursIdx() {
        return this.cursorIdx;
    }
    set cursIdx(v) {
        if (v > this._text.text.length) v = this._text.text.length;
        if (v < 0) v = 0;
        if (v > 0) {
            let t = this._text.text.slice(0,v);
            let m = Text.measure(this._text.font, this._text.text.slice(0,v), false);
            this._cursx = m.x;
        } else {
            this._cursx = 0;
        }
        this.cursorIdx = v;
    }

    get cursx() {
        return this._cursx;
    }
    get cursy() {
        let v = 0;
        v += Math.floor(this.cursor.height * .1);
        return v;
    }

    get selected() {
        return this._selected;
    }
    set selected(v) {
        if (v !== this._selected) {
            this._selected = v;
            if (v) {
                this.cursIdx = this._text.text.length;
                if (this.cursorBlinkRate) this.blinkTimer = new Timer({ttl: this.cursorBlinkRate, cb: this.onCursorBlink, loop: true});
            } else {
                if (this.blinkTimer) this.blinkTimer.destroy();
            }
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onMouseClicked(evt) {
        // activate/deactivate
        this.selected = (!this.selected);
        super.onMouseClicked(evt);
    }

    onSystemMouseClicked(evt) {
        if (!this.mouseOver && this.selected) {
            this.selected = false;
            this.evt.trigger(this.constructor.evtUpdated, {actor: this});
        }
    }

    onKeyDown(evt) {
        if (!this.active) return;
        // ignore key events if not selected
        if (!this.selected) return;
        // handle escape
        if (evt.key === 'Escape') {
            this.selected = false;
            this.evt.trigger(this.constructor.evtUpdated, {actor: this});
            return;
        }
        // handle backspace
        if (evt.key === 'Backspace') {
            if (this.cursIdx > 0) {
                this._text.text = Util.spliceStr(this._text.text, this.cursIdx-1, 1);
                this.cursIdx -= 1;
                this.evt.trigger(this.constructor.evtUpdated, {actor: this});
            }
            return;
        }
        // handle arrows
        if (evt.key === 'ArrowLeft') {
            if (this.cursIdx > 0) {
                this.cursIdx -= 1;
                this.evt.trigger(this.constructor.evtUpdated, {actor: this});
            }
            return;
        }
        if (evt.key === 'ArrowRight') {
            if (this.cursIdx < this._text.text.length) {
                this.cursIdx += 1;
                this.evt.trigger(this.constructor.evtUpdated, {actor: this});
            }
            return;
        }
        if (evt.key === 'ArrowUp') {
            if (this.cursIdx !== 0) {
                this.cursIdx = 0;
                this.evt.trigger(this.constructor.evtUpdated, {actor: this});
            }
            return;
        }
        if (evt.key === 'ArrowDown') {
            if (this.cursIdx !== this._text.text.length) {
                this.cursIdx = this._text.text.length;
                this.evt.trigger(this.constructor.evtUpdated, {actor: this});
            }
            return;
        }
        // handle delete
        if (evt.key === 'Delete') {
            if (this.cursIdx < this._text.text.length) {
                this._text.text = Util.spliceStr(this._text.text, this.cursIdx, 1);
                this.evt.trigger(this.constructor.evtUpdated, {actor: this});
            }
            return;
        }
        // ignore other meta keys
        if (evt.key.length > 1) return;
        let key = evt.key;
        // check charset
        if (!this.charset.includes(key)) return;
        // good to go...
        this._text.text += key;
        this.cursIdx += 1;
        this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }

    onCursorBlink(evt) {
        this.cursorOn = (!this.cursorOn);
        this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }

    // METHODS -------------------------------------------------------------
    show() {
        this.sketch.show();
        this._highlight.show();
        this._text.show();
        this._cursor.show();
    }
    hide() {
        this.sketch.hide();
        this._highlight.hide();
        this._text.hide();
        this._cursor.hide();
    }

    _render(ctx) {
        // render active sketch
        this.sketch.width = this.xform.width;
        this.sketch.height = this.xform.height;
        this.sketch.render(ctx, this.xform.minx, this.xform.miny);
        // render highlight
        if (this.selected) {
            this._highlight.width = this.xform.width;
            this._highlight.height = this.xform.height;
            this._highlight.render(ctx, this.xform.minx, this.xform.miny);
        }
        if (this.dbg && this.dbg.viewXform) this.textXform.render(ctx);
        // apply text transform
        this.textXform.apply(ctx, false);
        // render text
        this._text.width = this.textXform.width;
        this._text.height = this.textXform.height;
        this._text.render(ctx, this.textXform.minx, this.textXform.miny);
        if (this.selected) {
            if (this._cursor.height !== this.lcheight) {
                this._cursor.height = this.textXform.height * .8;
                this.lcheight = this._cursor.height;
            }
            if (this.cursorOn) this._cursor.render(ctx, this.textXform.minx+this.cursx, this.textXform.miny+this.cursy);
        }
        this.textXform.revert(ctx, false);
    }

}