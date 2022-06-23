export { Action };

import { EvtStream } from '../event.js';
import { Fmt } from '../fmt.js';
import { UpdateSystem } from '../systems/updateSystem.js';

class Action {

    // STATIC VARIABLES ----------------------------------------------------
    static evtStarted = 'action.started';
    static evtDone = 'action.done';
    static dfltPoints = 1;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.evt = spec.evt || new EvtStream();
        this.points = spec.hasOwnProperty('points') ? spec.points : this.constructor.dfltPoints;
        this.dbg = spec.dbg;
        this.done = false;
        this.ok = true;
        this.info = spec.info || 'action';
        this.update = spec.update;
    }
    destroy() {
        if (!this.done) this.ok = false;
    }

    // METHODS -------------------------------------------------------------
    start(actor) {
        this.actor = actor;
        this.evt.trigger(this.constructor.evtStarted, {actor: this.actor, action: this});
        // action specific setup
        this.setup();
        // finish if we don't have to wait
        if (this.done) this.finish();
    }
    setup() {
    }
    finish(update) {
        // handle updates
        if (this.ok && (update || this.update)) {
            update = Object.assign({}, this.update, update);
            UpdateSystem.eUpdate(this.actor, update, () => {
                this.done = true;
                this.evt.trigger(this.constructor.evtDone, {actor: this.actor, action: this, ok: this.ok});
                this.destroy();
            });
        } else {
            this.done = true;
            this.evt.trigger(this.constructor.evtDone, {actor: this.actor, action: this, ok: this.ok});
            this.destroy();
        }
    }
    toString() {
        return Fmt.toString(this.constructor.name, this.info, this.done, this.update);
    }
}
