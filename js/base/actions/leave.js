export { LeaveAction };

import { Action } from "./action.js";
import { UpdateSystem } from "../systems/updateSystem.js";

class LeaveAction extends Action {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    // METHODS -------------------------------------------------------------
    start(actor) {
        console.log(`starting ${this} for actor: ${actor}`);
        this.actor = actor;
        this.done = true;

        // update target state
        let actorUpdate = this.target.actor;
        UpdateSystem.eUpdate(this.target, {
            actorId: 0,
            actor: undefined,
            state: this.target.emptyState,
        });

        // update actor state
        Object.assign(actorUpdate, {
            occupyId: 0,
        });
        UpdateSystem.eUpdate(this.actor, actorUpdate);
        console.log(`leave is done`);
        this.evt.trigger(this.constructor.evtDone, {actor: this.actor, action: this, ok: this.ok});


    }
}