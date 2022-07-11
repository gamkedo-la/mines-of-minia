export { FuelSystem };

import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { TurnSystem } from './turnSystem.js';

class FuelSystem extends System {
    static dfltIterateTTL = 0;

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.partials = {};
        // -- event handlers
        this.onTurnDone = this.onTurnDone.bind(this);
        this.evt.listen(TurnSystem.evtDone, this.onTurnDone)
        this.active = false;
    }
    destroy(spec) {
        this.evt.ignore(TurnSystem.evtDone, this.onTurnDone)
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTurnDone(evt) {
        // health regenerated after leader turn only
        if (evt.which !== 'leader') return;
        this.active = true;
        this.actionPoints = evt.points;
    }

    // METHODS -------------------------------------------------------------

    iterate(evt, e) {
        // handle regeneration for entity
        let amt = this.actionPoints * e.fuelPerAP;
        if (amt) {
            let total = (this.partials[e.gid] || 0) + amt;
            if (total >= 1) {
                // burning health instead of fuel
                if (e.fuel <= 0) {
                    e.evt.trigger(e.constructor.evtDamaged, { actor: e, target: e, damage: 1 });
                } else {
                    let spent = Math.floor(total);
                    let update = Math.max(e.fuel - spent, 0);
                    UpdateSystem.eUpdate(e, {fuel: update});
                    // calculate remainder
                    total -= spent;
                }
            }
            if (total > 0) {
                this.partials[e.gid] = total;
            } else {
                delete this.partials[e.gid];
            }
        }
    }

    finalize(evt) {
        // disable system after all entities have been processed
        this.active = false;
    }

    matchPredicate(e) {
        return (('fuel' in e) && ('fuelPerAP' in e));
    }

}