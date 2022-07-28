export { BooCharm };

import { Fmt } from '../base/fmt.js';
import { Charm } from './charm.js';

/**
 * a test curse
 */
class BooCharm extends Charm {
    constructor(spec={}) {
        super(spec);
        this.curse = true;
        this.description = 'a scary curse ... boo.'
        // -- events
        this.onAttacked = this.onAttacked.bind(this);
    }

    link(actor) {
        super.link(actor);
        this.actor.evt.listen(this.actor.constructor.evtAttacked, this.onAttacked);
    }

    unlink() {
        super.unlink();
        if (this.actor) this.actor.evt.ignore(this.actor.constructor.evtAttacked, this.onAttacked);
    }

    onAttacked(evt) {
        if (!evt.target) return;
        console.log(`${this} onAttacked: ${Fmt.ofmt(evt)} --- boo`);
        // roll for damage
    }

}