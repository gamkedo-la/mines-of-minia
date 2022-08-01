export { UxSlider };

import { Hierarchy } from './hierarchy.js';
import { Rect } from './rect.js';
import { UxPanel } from './uxPanel.js';
import { UxView } from './uxView.js';
import { XForm } from './xform.js';

/*
import { Base }             from './base.js';
import { Generator }        from './generator.js';
import { Mouse }            from './mouse.js';
import { Util }             from './util.js';
import { UxView }           from './uxView.js';
import { UxPanel }          from './uxPanel.js';
import { Vect }             from './vect.js';
import { Mathf }            from './math.js';
import { EvtChannel }       from './event.js';
*/


class UxSliderKnob extends UxPanel {
    cpost(spec={}) {
        super.cpost(spec);
    }
}

class UxSlider extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static get dfltBar() {
        return new Rect({
            color: 'rgba(255,255,255,.5)',
        });
    };
    static dfltKnob = {
        cls: 'Rect',
        color: 'rgba(255,255,255,.5)',
    };

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        // -- bar height (in percent)
        let barHeight = spec.barHeight || .5;
        // -- bar y offset (in percent), positive for shift down, negative for shift up
        let barOffset = spec.barOffset || 0;
        // -- knob height (in percent)
        let knobHeight = spec.knobHeight || .85
        // -- knob width (in pixels)
        let knobWidth = spec.knobWidth || 20;
        // -- knob y offset (in percent), positive for shift down, negative for shift up
        let knobOffset = spec.knobOffset || 0;

        // -- bar sketch
        this.barXform = spec.hasOwnProperty('barXform') ? spec.barXform : new XForm( { top: .25, bottom: .25});
        Hierarchy.adopt(this.xform, this.barXform);
        // -- link sketches
        this._linkSketch('_bar', spec.bar || this.constructor.dfltBar, false);
        /*
        // -- knob sketch
        let xknob = spec.xnob || UxSlider.dfltKnob;
        // -- initial slider value
        this._value = spec.hasOwnProperty('value') ? Mathf.clamp(spec.value, 0, 1) : 0;
        // dynamically build slider knob element
        let xknobView = {
            cls: 'UxSliderKnob',
            xxform: {
                width: knobWidth,
                left: 0,
                right: 1,
                top: (1-knobHeight) * .5 + knobOffset,
                bottom: (1-knobHeight) * .5 + knobOffset,
            },
            xsketch: spec.xknob || UxSlider.dfltKnob,
        }
        this.knobView = new UxSliderKnob(xknobView);
        this.adopt(this.knobView);
        // bind event handlers
        Util.bind(this, 'onMouseClick');
        // events
        this.__evtValueChanged = new EvtChannel('value.changed', {actor: this});
        // listen for mouse click
        Mouse.evtClicked.listen(this.onMouseClick);
        */
    }

    destroy() {
        //Mouse.evtClicked.ignore(this.onMouseClick);
        this._unlinkSketch('_bar');
        super.destroy();
    }

    // PROPERTIES ----------------------------------------------------------
    get bar() {
        return this._bar;
    }
    set bar(v) {
        if (!v) return;
        if (v !== this._bar) {
            this._linkSketch('_bar', v);
        }
    }

    /*
    get knob() {
        return this._knob;
    }

    set knob(v) {
        if (v !== this._knob) {
            this.updated = true;
            Sketch.link(v, this, '_knob');
        }
    }

    get value() {
        return this._value;
    }
    set value(v) {
        if (v !== this._value) {
            this.updated = true;
            let oldValue = this._value;
            this._value = v;
            this.evtValueChanged.trigger({value: v, oldValue: oldValue});
        }
    }
    */

    // METHODS -------------------------------------------------------------
    show() {
        this._bar.show();
    }
    hide() {
        this._bar.hide();
    }

    // EVENTS --------------------------------------------------------------
    //get evtValueChanged() { return this.__evtValueChanged; }

    // EVENT HANDLERS ------------------------------------------------------
    /*
    onMouseClick(evt) {
        if (!this.mouseOver) return;
        // get mouse position local to slider
        let lpos = this.xform.getLocal(new Vect(evt.x, evt.y));
        // translate local position to value for slider
        this.value = Mathf.clamp(Mathf.lerp(this.xform.minx, this.xform.maxx, 0, 1, lpos.x), 0, 1);
    }
    */

    // METHODS -------------------------------------------------------------
    /*
    iupdate(ctx) {
        // detect mouse drag
        if (this.dragging) {
            if (Mouse.down) {
                let lpos = this.xform.getLocal(new Vect(Mouse.x, Mouse.y));
                let value = Mathf.clamp(Mathf.lerp(this.xform.minx, this.xform.maxx, 0, 1, lpos.x), 0, 1);
                if (value !== this._value) {
                    this.value = value;
                    Base.instance.audioMgr.sfxVol = this._value;
                }
            } else {
                this.dragging = false;
            }
        } else if (this.mouseOver && Mouse.down) {
           this.dragging = true;
        }
        // update knob position
        if (this._value !== this.lastValue) {
            this.lastValue = this._value;
            this.knobView.xform.left = this._value;
            this.knobView.xform.right = 1-this._value;
        }
        if (this._bar && this._bar.update) this.updated |= this._bar.update(ctx);
        if (this._knob && this._knob.update) this.updated |= this._knob.update(ctx);
        return this.updated;
    }
    */

    _render(ctx) {
        // update sketch dimensions
        //this._sketch.width = this.xform.width;
        //this._sketch.height = this.xform.height;
        //if (this.tag.startsWith('tile')) console.log(`${this} render @ ${this.xform.minx},${this.xform.miny}`);
        // render
        this.barXform.apply(ctx, false);
        //if (this._bar && this._bar.render) this._bar.render(ctx, this.xform.minx, this.xform.miny);
        this._bar.render(ctx, this.barXform.minx, this.barXform.miny);
        this._bar.width = this.barXform.width;
        this._bar.height = this.barXform.height;
        console.log(`render: min ${this.barXform.minx},${this.barXform.miny} w/h: ${this.xform.width},${this.xform.height} bar w/h: ${this.barXform.width},${this.barXform.height}`);
        this.barXform.revert(ctx, false);
    }

}