export { StealthCharm };

import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Charm } from './charm.js';

class StealthCharm extends Charm {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltApTL = 100;

    static applied(e) {
        return e.charms && e.charms.some((v) => v.constructor.name === this.name);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'stealth charm';
        // number of action points to persist charm
        this.apTL = spec.apTL || this.constructor.dfltApTL;
        // number of action points elapsed
        this.elapsed = 0;
        // -- events
        this.onAttacked = this.onAttacked.bind(this);
    }
    destroy() {
        this.unlink();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            apTl: this.apTl,
            elapsed: this.elapsed,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onAttacked(evt) {
        this.destroy();
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        if (this.constructor.applied(actor)) return;
        super.link(actor);
        actor.evt.listen(actor.constructor.evtAttacked, this.onAttacked);
        console.log(`listen on: ${actor.constructor.evtAttacked}`);
        UpdateSystem.eUpdate(actor, {hidden: true});
    }

    unlink() {
        let actor = this.actor;
        super.unlink();
        if (actor) actor.evt.ignore(actor.constructor.evtAttacked, this.onAttacked);
        UpdateSystem.eUpdate(actor, {hidden: false});
    }

}