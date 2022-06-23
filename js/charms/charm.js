export { Charm };

import { Fmt } from '../base/fmt.js';

class Charm {
    // STATIC VARIABLES ----------------------------------------------------

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        this.actor;
    }
    destroy() {
        this.unlink();
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