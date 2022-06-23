export { ParallelAction };

import { Events } from '../event.js';
import { Action } from './action.js';

class ParallelAction extends Action {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.subs = spec.subs || [];
        this.onSubDone = this.onSubDone.bind(this);
    }
    destroy() {
        if (!this.done) this.ok = false;
        for (const sub of this.subs) sub.destroy();
    }

    start(actor) {
        this.actor = actor;
        this.evt.trigger(this.constructor.evtStarted, {actor: this.actor, action: this});
        // action specific setup
        this.setup();
        // start all subaction
        for (const sub of this.subs) {
            sub.evt.listen(sub.constructor.evtDone, this.onSubDone, Events.once);
            sub.start(actor);
        }
        // finish if all sub actions are done
        if (this.subs.every((v) => v.done)) this.finish();
    }

    onSubDone(evt) {
        if (this.subs.every((v) => v.done)) this.finish();
    }

}