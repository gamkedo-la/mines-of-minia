export { PlaySoundAction };

import { Events } from '../event.js';
import { Action } from './action.js';

class PlaySoundAction extends Action {
    // STATIC VARIABLES ----------------------------------------------------

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.sfx = spec.sfx;
        this.onSfxDone = this.onSfxDone.bind(this);
    }
    destroy() {
        if (this.sfx) {
            this.sfx.evt.ignore(this.sfx.constructor.evtDone, this.onSfxDone);
            this.sfx.stop();
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onSfxDone(evt) {
        this.evt.trigger(this.constructor.evtDone, {actor: this.actor, action: this, ok: this.ok});
        this.done = true;
    }

    // METHODS -------------------------------------------------------------
    start(actor) {
        this.actor = actor;
        this.sfx.loop = false;
        if (this.sfx) {
            this.sfx.evt.listen(this.sfx.constructor.evtDone, this.onSfxDone, Events.once);
            this.ok = this.sfx.play();
            if (!this.ok) {
                this.evt.trigger(this.constructor.evtDone, {actor: this.actor, action: this, ok: this.ok});
            }
        }
    }

}