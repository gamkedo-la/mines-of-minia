export { UseAction };

import { Action } from '../base/actions/action.js';
import { Timer } from '../base/timer.js';

class UseAction extends Action {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltTTL = 500;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        this.target = spec.target;
        this.sfx = spec.sfx;
        this.onTimer = this.onTimer.bind(this);
    }
    destroy() {
        super.destroy();
        if (this.timer) this.timer.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTimer(evt) {
        if (this.dbg) console.log(`${this} is done`);
        // item gets used
        this.target.use(this.actor);
        // finish
        this.finish();
    }

    // METHODS -------------------------------------------------------------
    setup() {
        if (this.dbg) console.log(`starting ${this} action w ttl: ${this.ttl}`);
        // start timer to finish use action
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
        // play sfx at start of use
        if (this.sfx) this.sfx.play();
    }

}