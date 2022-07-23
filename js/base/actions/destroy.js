export { DestroyAction, DestroyTargetAction };

import { Action } from './action.js';

class DestroyAction extends Action {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltTTL = 0;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.sfx = spec.sfx;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
    }
    destroy() {
        super.destroy();
        if (this.timer) this.timer.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTimer(evt) {
        if (this.sfx) this.sfx.play();
        this.actor.destroy();
        this.finish();
    }

    // EVENT HANDLERS ------------------------------------------------------
    setup() {
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
    }

}

class DestroyTargetAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.sfx = spec.sfx;
        this.target = spec.target;
    }

    setup() {
        // this is an instant action
        this.done = true;
        if (this.sfx) this.sfx.play();
        if (this.target) this.target.destroy();
    }

}