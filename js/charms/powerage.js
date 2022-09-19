export { PowerageCharm };

import { Charm } from './charm.js';

class PowerageCharm extends Charm {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'powerage charm';
        this.lvl = spec.lvl || 1;
        this.powerBoostPct = this.lvl/10;
        this.onActorUpdate = this.onActorUpdate.bind(this);
    }
    destroy() {
        this.unlink();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            lvl: this.lvl,
        });
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        super.link(actor);
        if (!this.actor.powerBoostPct) {
            this.actor.powerBoostPct = this.powerBoostPct;
        } else {
            this.actor.powerBoostPct += this.powerBoostPct;
        }
        console.log(`${actor} powerBoostPct: ${this.actor.powerBoostPct}`);
        this.actor.evt.listen(this.actor.constructor.evtUpdated, this.onActorUpdate);
    }

    unlink() {
        let actor = this.actor;
        super.unlink();
        actor.powerBoostPct -= this.powerBoostPct;
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