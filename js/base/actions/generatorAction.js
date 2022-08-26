export { GeneratorAction };

import { Events } from '../event.js';
import { Fmt } from '../fmt.js';
import { Action } from './action.js';

class GeneratorAction extends Action {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = spec.generator || (() => null);
        this.currentSub;
        this.onSubDone = this.onSubDone.bind(this);
    }
    destroy() {
        if (!this.done) this.ok = false;
        if (this.currentSub) this.currentSub.destroy();
    }

    start(actor) {
        this.actor = actor;
        this.evt.trigger(this.constructor.evtStarted, {actor: this.actor, action: this});
        // action specific setup
        this.setup();

        // start first subaction
        let gv = this.generator.next();
        if (gv.value) {
            this.currentSub = gv.value;
            this.currentSub.evt.listen(this.currentSub.constructor.evtDone, this.onSubDone, Events.once);
            this.currentSub.start(actor);
        }

        // finish if we don't have to wait
        if (gv.done && (!this.currentSub || (this.currentSub && this.currentSub.done))) this.finish();
    }

    onSubDone(evt) {
        // start next subaction
        this.currentSub = null;
        let gv = this.generator.next();
        if (gv.value) {
            this.currentSub = gv.value;
            this.currentSub.evt.listen(this.currentSub.constructor.evtDone, this.onSubDone, Events.once);
            this.currentSub.start(actor);
        }
        // check for completion
        if (gv.done && (!this.currentSub || (this.currentSub && this.currentSub.done))) this.finish();
    }

}