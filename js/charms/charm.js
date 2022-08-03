export { Charm };

import { Fmt } from '../base/fmt.js';

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
    }

    unlink() {
        this.actor = null;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.actor);
    }

}