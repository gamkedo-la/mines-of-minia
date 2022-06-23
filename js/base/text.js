export { Text };

import { Events, EvtStream } from './event.js';
import { Font } from './font.js';
import { Sketch } from './sketch.js';
import { Vect } from './vect.js';

/** ========================================================================
 * A string of text rendered to the screen as a sketch.
 */
class Text extends Sketch {
    // STATIC VARIABLES ----------------------------------------------------
    static evtUpdated = 'text.updated';
    static lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' + 
                   'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ' +
                   'nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit ' +
                   'esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in ' +
                   'culpa qui officia deserunt mollit anim id est laborum.';
    static minFontSize = 5;
    static _textCanvas = document.createElement('canvas');
    static _textCtx = this._textCanvas.getContext('2d');

    static get rlorem() {
        let len = Math.floor(Math.random()*this.lorem.length);
        return  this.lorem.slice(0, len);
    }

    static get rword() {
        let choices = this.lorem.split(' ');
        let idx = Math.floor(Math.random() * choices.length);
        return choices[idx];
    }

    // STATIC PROPERTIES ---------------------------------------------------
    static get evt() {
        return new EvtStream();
    }

    // STATIC METHODS ------------------------------------------------------
    static measure(font, text, hacky=true) {
        const ctx = this._textCtx;
        ctx.font = font;
        // Note: hacky... force text to include a capital and a descent letter to make sure we have enough room
        if (hacky) text = 'Xg' + text.slice(2);
        const metrics = ctx.measureText(text);
        let h = Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent);
        let w = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
        return new Vect(w, h);
    }

    static measureWrapHeight(font, text, width, leadingPct=.25) {
        // split the lines
        let lines = this.splitText(font, text, width);
        if (lines.length > 0) {
            let tsize = Text.measure(font, lines[0]);
            return (tsize.y * lines.length-1) * (1+leadingPct) + tsize.y;
        }
        return 0;
    }

    static splitText(font, text, width) {
        // split on spaces
        let tokens = text.split(' ');
        // iterate over tokens...
        let line = '';
        let lines = [];
        for (const token of tokens) {
            let testStr = (line) ? `${line} ${token}` : token;
            // measure test string
            let tsize = Text.measure(font, testStr);
            if (tsize.x > width) {
                lines.push(line);
                line = token;
            } else {
                line = testStr;
            }
        }
        if (line) lines.push(line);
        return lines;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.font = spec.font || Font.dflt;
        this.color = spec.color || 'black';
        this._text = spec.text || 'default text';
        this.wrapLines = [];
        this.wrapLeading;
        this.leadingPct = spec.leadingPct || .25;
        this.outlineWidth = spec.outlineWidth || 0;
        this.outlineColor = spec.outlineColor || 'white';
        this.highlightColor = spec.highlightColor;
        this.valign = spec.valign || 'middle';
        this.align = spec.align || 'center';
        // fit - adjust font to best fit sketch size iff sketch size is set
        //this.fit = spec.hasOwnProperty('fit') ? spec.fit : true;
        // wrap - wrap text, breaking on spaces
        this.wrap = spec.hasOwnProperty('wrap') ? spec.wrap : false;
        // -- no prescribed dimensions, use specified font to determine sketch size
        if (!this.width || !this.height) {
            this.tsize = Text.measure(this.font, this._text);
            this.width = this.tsize.x;
            this.height = this.tsize.y;
            this.lheight = this.tsize.y;
        } else {
            this.resize(this.width, this.height);
        }
    }

    // PROPERTIES ----------------------------------------------------------
    get width() {
        return this._width;
    }
    set width(v) {
        if (v !== this.width) {
            this._width = v;
        }
    }

    get height() {
        return this._height;
    }
    set height(v) {
        if (v !== this.height) {
            this._height = v;
        }
    }

    get text() {
        return this._text;
    }
    set text(v) {
        // FIXME
        if (v != this._text) {
            this._text = v;
            if (!this.staticSize) {
                this.resize(this.width, this.height, true);
            } else {
                const size = Text.measure(this.font, this._text);
                this._width = size.x;
                this._height = size.y;
                if (this.wrap) {
                    this.wrapLines = Text.splitText(this.font, this._text, this.width);
                    if (this.wrapLines.length) {
                        let tsize = Text.measure(this.font, this.wrapLines[0]);
                        this.wrapLeading = Math.round(tsize.y * (1+this.leadingPct));
                    }
                }
            }
            this.evt.trigger(this.constructor.evtUpdated, {actor: this});
        }
    }

    // METHODS -------------------------------------------------------------
    resize(width, height, force=false) {
        //if (this.staticSize) return;
        if (width === 0 && height === 0) return;
        // check to see if sketch size has changed since last 'fit'...
        // -- handle wrapped text
        if (this.wrap) {
            this.wrapLines = Text.splitText(this.font, this._text, width);
            if (this.wrapLines.length) {
                this.tsize = Text.measure(this.font, this.wrapLines[0]);
                this.lheight = this.tsize.y;
                this.wrapLeading = Math.round(this.tsize.y * (1+this.leadingPct));
                this.tsize.y = this.wrapLeading * this.wrapLines.length;
            } else {
                this.tsize = Vect.zero;
                this.lheight = 0;
            }
        // -- otherwise, not wrapped
        } else {
            let font = this.font;
            let fsize = font.size;
            //if (!force && this.size.equals(this.fitSize)) return;
            let tsize = Text.measure(font, this._text);
            // grow
            if (tsize.x < width && tsize.y < height) {
                while (tsize.x < width && tsize.y < height) {
                    fsize++;
                    font = font.copy({size: fsize});
                    tsize = Text.measure(font, this._text);
                }
                this.font = this.font.copy({size: fsize-1});
            // shrink
            } else {
                while (fsize > Text.minFontSize && (tsize.x > width || tsize.y > height)) {
                    fsize--;
                    font = font.copy({size: fsize});
                    tsize = Text.measure(font, this._text);
                }
                this.font = this.font.copy({size: fsize-1});
            }
            // update final text size
            this.tsize = Text.measure(this.font, this._text);
            this.lheight = this.tsize.y;
        }
    }

    _render(renderCtx, x=0, y=0, width=0, height=0) {
        // refit text (if necessary based on updated sketch size)
        this.resize(width, height);
        // text box positions
        let tx = x;
        let ty = y;
        renderCtx.textAlign = this.align;
        renderCtx.textBaseline = this.valign;
        // update position based on alignment... 
        if (this.align === 'center') {
            tx += (width-this.tsize.x)*.5;
            x += width * .5;
        } else if (this.align === 'right') {
            tx += width-this.tsize.x;
            x += width;
        }
        if (this.valign === 'middle') {
            if (this.wrap) {
                ty += (height - this.wrapLeading*(this.wrapLines.length))*.5;
                y += (height - this.wrapLeading*(this.wrapLines.length-1))*.5;
            } else {
                ty += (height-this.tsize.y) * .5;
                y += height * .5;
            }
        } else if (this.valign === 'bottom') {
            if (this.wrap) {
                y += height - this.wrapLeading*(this.wrapLines.length-1);
                ty += height - this.wrapLeading*(this.wrapLines.length);;
            } else {
                y += height;
                ty += height-this.tsize.y;
            }
        }
        if (this.highlightColor) {
            renderCtx.fillStyle = this.highlightColor;
            renderCtx.fillRect(tx, ty, this.tsize.x, this.tsize.y);
        }
        renderCtx.fillStyle = this.color;
        renderCtx.font = this.font;
        renderCtx.lineWidth = this.outlineWidth;
        renderCtx.strokeStyle = this.outlineColor;
        if (this.wrap) {
            for (let i=0; i<this.wrapLines.length; i++) {
                const line = this.wrapLines[i];
                renderCtx.fillText(line, x, y + (i*this.wrapLeading));
                if (this.outlineWidth) renderCtx.strokeText(line, x, y + (i*this.wrapLeading));
            }
        } else {
            renderCtx.fillText(this._text, x, y);
            if (this.outlineWidth) renderCtx.strokeText(this._text, x, y);
        }
    }
}