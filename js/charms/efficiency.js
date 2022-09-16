export { EfficiencyCharm };

import { Charm } from './charm.js';

class EfficiencyCharm extends Charm {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'efficiency charm';
        this.lvl = spec.lvl || 1;
        this.fuelReduxPct = this.lvl/10;
        this.onActorUpdate = this.onActorUpdate.bind(this);
    }
    destroy() {
        this.unlink();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            fuelReduxPct: this.fuelReduxPct,
        });
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        super.link(actor);
        if (!this.actor.fuelReduxPct) {
            this.actor.fuelReduxPct = this.fuelReduxPct;
        } else {
            this.actor.fuelReduxPct += this.fuelReduxPct;
        }
        this.actor.evt.listen(this.actor.constructor.evtUpdated, this.onActorUpdate);
    }

    unlink() {
        let actor = this.actor;
        super.unlink();
        actor.fuelReduxPct -= this.fuelReduxPct;
        if (actor) actor.evt.ignore(actor.constructor.evtUpdated, this.onActorUpdate);
    }

    onActorUpdate(evt) {
        // auto remove charm if player health drops below full
        if (evt.update && evt.update.health) {
            if (evt.actor.health !== evt.actor.healthMax) {
                //console.log(`${this} player health dropped from max, removing charm`);
                this.unlink();
            }
        }
    }


}