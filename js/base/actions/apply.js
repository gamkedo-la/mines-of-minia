export { ApplyAction };

import { ActionSystem } from '../systems/actionSystem.js';
import { Action } from './action.js';


/**
 * apply an action to a target, wait for action to be complete
 */
class ApplyAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.action = spec.action;
        // bind handlers
        this.onActionDone = this.onActionDone.bind(this);
    }

    setup() {
        this.action.evt.listen(this.action.constructor.evtDone, this.onActionDone);
        ActionSystem.assign(this.target, this.action);
    }

    onActionDone(evt) {
        if (this.dbg) console.log(`${this} is done`);
        this.finish();
    }

}