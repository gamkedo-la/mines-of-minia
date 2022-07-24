export { UpdateAction };

import { Fmt } from "../fmt.js";
import { UpdateSystem } from "../systems/updateSystem.js";
import { Action } from "./action.js";

class UpdateAction extends Action {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.update = spec.update || {};
    }

    // METHODS -------------------------------------------------------------
    setup() {
        // this is an instant action
        this.done = true;
        UpdateSystem.eUpdate(this.actor, this.update);
    }

}