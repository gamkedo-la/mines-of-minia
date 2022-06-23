
export { EndTurnAction };

import { Action } from '../base/actions/action.js';
import { Events } from '../base/event.js';

class EndTurnAction extends Action {
    static evtEndTurn = 'action.endturn';
    static dfltPoints = 0;

    constructor(spec={}) {
        super(spec);
        this.evtEndTurn = spec.evtEndTurn || this.constructor.evtEndTurn;
    }

    // METHODS -------------------------------------------------------------
    start(actor) {
        if (this.dbg) console.log(`${actor} starting ${this} action`);
        this.actor = actor;
        this.done = true;
        this.evt.trigger(this.constructor.evtDone, {actor: this.actor, action: this, ok: this.ok});
        Events.trigger(this.evtEndTurn, { actor: actor });
    }

}