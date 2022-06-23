export { OccupyAction };

import { Action } from "./action.js";
import { UpdateSystem } from "../systems/updateSystem.js";

class OccupyAction extends Action {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    // METHODS -------------------------------------------------------------
    start(actor) {
        console.log(`occupy action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        this.done = true;
        // check that target can be occupied
        if (this.target.state === this.target.occupiedState) {
            //console.log(`actor: ${actor} cannot occupy: ${this.target} -- already occupied ${this.target.actorId}`);
            this.ok = false;
            this.evtFinished.trigger({actor: this.actor, action: this, ok: this.ok});
        } else {
            // update target state
            UpdateSystem.eUpdate(this.target, {
                actorId: actor.gid,
                actor: {
                    x: actor.x,
                    y: actor.y,
                    state: actor.state,
                    visible: actor.visible,
                },
                state: this.target.occupiedState,
            });
            // update actor state
            let actorUpdate = {
                x: this.target.x + this.target.occupyX,
                y: this.target.y + this.target.occupyY,
                occupyId: this.target.gid,
                state: this.target.actorState,
                visible: this.target.actorVisible,
            };
            UpdateSystem.eUpdate(this.actor, actorUpdate);
            console.log(`occupy is done`);
            this.evtFinished.trigger({actor: this.actor, action: this, ok: this.ok});

        }

    }
}