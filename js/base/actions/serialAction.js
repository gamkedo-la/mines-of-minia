export { SerialAction };

import { Events } from '../event.js';
import { Fmt } from '../fmt.js';
import { Action } from './action.js';

class SerialAction extends Action {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.subs = spec.subs || [];
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
        if (this.subs.length) {
            let sub = this.subs.shift();
            sub.evt.listen(sub.constructor.evtDone, this.onSubDone, Events.once);
            sub.start(actor);
            this.currentSub = sub;
        }

        // finish if we don't have to wait
        if (!this.subs.length || this.subs[this.subs.length-1].done) this.finish();
    }

    onSubDone(evt) {
        //console.log(`onSubDone: ${Fmt.ofmt(evt)}`);
        // start next subaction
        if (this.subs.length) {
            let sub = this.subs.shift();
            sub.evt.listen(sub.constructor.evtDone, this.onSubDone, Events.once);
            sub.start(this.actor);
            this.currentSub = sub;
        } else {
            this.finish();
        }
    }

}