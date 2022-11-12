export { Animator };

import { EvtStream, Events } from './event.js';
import { Fmt } from './fmt.js';
import { Sketch } from './sketch.js';

/** ========================================================================
 * An animator is responsible for driving animations based on state passed through update
 */
class Animator extends Sketch {
    // STATIC VARIABLES ----------------------------------------------------
    static evtUpdated = 'animator.updated';
    static dfltState = 'idle';

    // STATIC PROPERTIES ---------------------------------------------------
    static get evt() {
        return new EvtStream();
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- sketch state mapping
        this.sketches = spec.sketches || {};
        // -- state tracking
        this.state = spec.state || this.constructor.dfltState;
        this.pendingState;
        this.hidden = true;
        // bind event handlers
        this.onStateChange = this.onStateChange.bind(this);
        this.onSketchUpdate = this.onSketchUpdate.bind(this);
        // -- upstream event handling
        // -- how to pull event update from event
        this.evtAccessor = spec.evtAccessor || ((evt) => (evt.update && evt.update.state) ? evt.update.state : null);
        this.stateAccessor = spec.stateAccessor || ((e) => e.state);
        // -- the upstream event stream
        this.upEvt = spec.upEvt || Events.null;
        // -- the upstream update event
        this.upEvtUpdated = spec.upEvtUpdated || 'e.updated';
        // -- listen for upstream event marking state changes
        this.upEvt.listen(this.upEvtUpdated, this.onStateChange);
        //-- current sketch
        let sketch = this.sketches[this.state] || Sketch.zero;
        this.setSketch(sketch);
    }

    destroy() {
        this.upEvt.ignore(this.upEvtUpdated, this.onStateChange);
        this.hide();
        super.destroy();
    }

    // PROPERTIES ----------------------------------------------------------
    get iwidth() {
        return this.sketch.iwidth;
    }

    get iheight() {
        return this.sketch.iheight;
    }

    get idx() {
        return this.sketch.idx;
    }

    get done() {
        return this.sketch.done;
    }

    // EVENT HANDLERS ------------------------------------------------------
    onStateChange(evt) {
        let wantState = this.evtAccessor(evt);
        if (!wantState) return;
        this.play(wantState);
    }

    onSketchUpdate(evt) {
        if (!this.hidden) this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }

    // METHODS -------------------------------------------------------------

    link(target) {
        if (this.upEvt) {
            this.upEvt.ignore(this.upEvtUpdated, this.onStateChange);
        }
        this.upEvt = target.evt;
        this.upEvtUpdated = target.constructor.evtUpdated;
        this.upEvt.listen(this.upEvtUpdated, this.onStateChange);
        // -- set initial sketch state
        let wantState = this.stateAccessor(target);
        //console.log(`${this} link to ${target} wantState: ${wantState}`);
        if (wantState && this.state !== wantState) {
            let sketch = this.sketches[wantState] || Sketch.zero;
            this.state = wantState;
            this.setSketch(sketch);
        }
    }
    unlink() {
        if (this.upEvt) {
            this.upEvt.ignore(this.upEvtUpdated, this.onStateChange);
        }
    }

    show() {
        this.hidden = false;
        this.sketch.show();
    }

    hide() {
        this.hidden = true;
        this.sketch.hide();
    }

    play(wantState) {
        let fromState = (this.pendingState) ? this.pendingState : this.state;
        // check for no state change
        if (fromState === wantState) return this.sketch;
        // check for state transition
        let transState = `${fromState}:${wantState}`;
        let sketch = this.sketches[transState];
        if (sketch) {
            sketch.evt.listen(sketch.constructor.evtDone, this.onTransitionDone, Events.once);
            this.pendingState = wantState;
            this.state = transState;
            this.setSketch(sketch);
        // no transition
        } else {
            sketch = this.sketches[wantState] || Sketch.zero;
            //if (this.tag === 'scarab') console.log(`${this} wantState: ${wantState}`);
            this.state = wantState;
            this.setSketch(sketch);
        }
        this.evt.trigger(this.constructor.evtUpdated, {actor: this});
        return sketch;
    }

    setSketch(sketch) {
        if (this.sketch) {
            this.sketch.evt.ignore(this.sketch.constructor.evtUpdated, this.onSketchUpdate);
            this.sketch.hide();
        }
        this.sketch = sketch;
        this.sketch.reset();
        if (!this.hidden) {
            this.sketch.show();
        }
        this.sketch.evt.listen(this.sketch.constructor.evtUpdated, this.onSketchUpdate);
        this.width = this.sketch.width;
        this.height = this.sketch.height;
    }

    _render(renderCtx, x=0, y=0, width=0, height=0) {
        this.sketch.width = width;
        this.sketch.height = height;
        this.sketch.render(renderCtx, x, y);
    }

}