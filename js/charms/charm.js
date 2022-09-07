export { Charm };

import { Fmt } from '../base/fmt.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';

class Charm {
    // STATIC VARIABLES ----------------------------------------------------

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        this.actor;
        this.curse = spec.hasOwnProperty('curse') ? spec.curse : false;
        this.description = 'a generic charm';
    }
    destroy() {
        this.unlink();
    }

    as_kv() {
        return {
            cls: this.constructor.name,
            curse: this.curse,
        }
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        this.actor = actor;
        if (this.actor.charms) this.actor.charms.push(this);
        UpdateSystem.eUpdate(actor, { charmed: true })
    }

    unlink() {
        if (this.actor && this.actor.charms) {
            let idx = this.actor.charms.indexOf(this);
            if (idx !== -1) this.actor.charms.splice(idx, 1);
            UpdateSystem.eUpdate(this.actor, { charmed: false })
        }
        this.actor = null;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.actor);
    }

}