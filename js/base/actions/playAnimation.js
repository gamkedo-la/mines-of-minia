export { PlayAnimatorStateAction }

import { Events } from '../event.js';
import { Action } from './action.js';

class PlayAnimatorStateAction extends Action {
    // STATIC VARIABLES ----------------------------------------------------

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.animator = spec.animator;
        this.sketch;
        this.state = spec.state;
        this.onSketchDone = this.onSketchDone.bind(this);
    }
    destroy() {
        if (this.sketch) {
            this.sketch.evt.ignore(this.sketch.constructor.evtDone, this.onSketchDone);
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onSketchDone(evt) {
        this.done = true;
        this.evt.trigger(this.constructor.evtDone, {actor: this.actor, action: this, ok: this.ok});
    }

    // METHODS -------------------------------------------------------------
    start(actor) {
        this.actor = actor;
        if (this.animator) {
            // tell animator to start playing given state
            let sketch = this.animator.play(this.state)
            if (sketch.done) {
                this.done = true;
            } else {
                this.sketch = sketch;
                this.sketch.evt.listen(this.sketch.constructor.evtDone, this.onSketchDone, Events.once);
            }
        }
    }

}