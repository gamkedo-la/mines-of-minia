export { UxSlider };

import { Fmt } from './fmt.js';
import { Hierarchy } from './hierarchy.js';
import { Rect } from './rect.js';
import { Mathf } from './math.js';
import { UxView } from './uxView.js';
import { Vect } from './vect.js';
import { XForm } from './xform.js';
import { Events } from './event.js';
import { MouseSystem } from './systems/mouseSystem.js';

class UxSlider extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static get dfltBar() {
        return new Rect({
            color: 'rgba(255,255,255,.5)',
        });
    };
    static get dfltKnob() {
        return new Rect({
            color: 'rgba(255,255,255,.5)',
        });
    };

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        // -- knob width (in percent of parent xform)
        this.knobWidthPct = spec.knobWidthPct || .1;
        // -- initial slider value (value between 0 and 1)
        this._value = spec.hasOwnProperty('value') ? Mathf.clamp(spec.value, 0, 1) : 0;
        // -- bar sketch
        this.barXform = spec.hasOwnProperty('barXform') ? spec.barXform : new XForm( { top: .25, bottom: .25});
        Hierarchy.adopt(this.xform, this.barXform);
        this._linkSketch('_bar', spec.bar || this.constructor.dfltBar, false);
        // -- knob sketch
        let left = this._value - this._value * this.knobWidthPct;
        let right = 1-this._value - (1-this._value)*this.knobWidthPct;
        console.log(`l: ${left} r: ${right}`);
        this.knobXform = spec.hasOwnProperty('knobXform') ? spec.knobXform : new XForm( { left: left, right: right });
        Hierarchy.adopt(this.xform, this.knobXform);
        // -- link sketches
        this._linkSketch('_knob', spec.knob || this.constructor.dfltKnob, false);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.evt.listen(this.constructor.evtMouseDown, this.onMouseDown);
        this.evt.listen(this.constructor.evtMouseUp, this.onMouseUp);
    }

    destroy() {
        Events.ignore(MouseSystem.evtMoved, this.onMouseMove);
        this.evt.ignore(this.constructor.evtMouseDown, this.onMouseDown);
        this.evt.ignore(this.constructor.evtMouseUp, this.onMouseUp);
        this._unlinkSketch('_bar');
        this._unlinkSketch('_knob');
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

    get knob() {
        return this._knob;
    }
    set knob(v) {
        if (!v) return;
        if (v !== this._knob) {
            this._linkSketch('_knob', v);
        }
    }

    get value() {
        return this._value;
    }
    set value(v) {
        if (v !== this._value) {
            this._value = v;
            this.knobXform.left = this._value - this._value * this.knobWidthPct;
            this.knobXform.right = 1-this._value - (1-this._value)*this.knobWidthPct;
            this.evt.trigger(this.constructor.evtUpdated, {actor: this, update: { value: v }});
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onMouseDown(evt) {
        Events.listen(MouseSystem.evtMoved, this.onMouseMove);
    }
    onMouseUp(evt) {
        Events.ignore(MouseSystem.evtMoved, this.onMouseMove);
        let lmouse = this.xform.getLocal(new Vect(evt.mouse.x, evt.mouse.y));
        let v = Mathf.clamp(this.translateMouse(lmouse.x), 0, 1);
        this.value = v;
    }
    onMouseMove(evt) {
        let lmouse = this.xform.getLocal(new Vect(evt.x, evt.y));
        let v = Mathf.clamp(this.translateMouse(lmouse.x), 0, 1);
        this.value = v;
    }

    // METHODS -------------------------------------------------------------
    show() {
        this._bar.show();
        this._knob.show();
    }
    hide() {
        this._bar.hide();
        this._knob.hide();
    }

    translateMouse(x) {
        let v;
        if (x <= this.xform.minx+this.knobXform.width) {
            v = 0;
        } else if (x >= this.xform.maxx-this.knobXform.width) {
            v = 1;
        } else {
            v = Mathf.lerp(this.xform.minx+this.knobXform.width, this.xform.maxx-this.knobXform.width, 0, 1, x);
        }
        return v;
    }

    _render(ctx) {
        // render
        this.barXform.apply(ctx, false);
        this._bar.render(ctx, this.barXform.minx, this.barXform.miny);
        this._bar.width = this.barXform.width;
        this._bar.height = this.barXform.height;
        this.barXform.revert(ctx, false);
        this.knobXform.apply(ctx, false);
        this._knob.render(ctx, this.knobXform.minx, this.knobXform.miny);
        this._knob.width = this.knobXform.width;
        this._knob.height = this.knobXform.height;
        this.knobXform.revert(ctx, false);
    }

}