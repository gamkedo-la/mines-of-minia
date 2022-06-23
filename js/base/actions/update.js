export { UpdateAction };

import { Fmt } from "../fmt.js";
import { UpdateSystem } from "../systems/updateSystem.js";
import { Action } from "./action.js";

class UpdateAction extends Action {
    static dfltPoints = 0;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.update = spec.update || {};
    }

    // METHODS -------------------------------------------------------------
    start(actor) {
        if (this.dbg) console.log(`starting ${this} action w/ ${Fmt.ofmt(this.update)}`);
        this.actor = actor;
        UpdateSystem.eUpdate(this.actor, this.update);
        this.done = true;
        this.evt.trigger(this.constructor.evtDone, {actor: this.actor, action: this, ok: this.ok});
    }

    stop() {
        if (!this.done) this.ok = false;
        if (this.timer) this.timer.destroy();
    }

    toString() {
        return Fmt.toString(this.constructor.name, Fmt.ofmt(this.update), this.points);
    }

}