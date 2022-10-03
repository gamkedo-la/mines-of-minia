export { PowerRegenSystem };

    import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { OverlaySystem } from './overlaySystem.js';
import { TurnSystem } from './turnSystem.js';

class PowerRegenSystem extends System {
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
        // power regenerated after leader turn only
        if (evt.which !== 'leader') return;
        this.active = true;
        this.actionPoints = evt.points;
    }

    // METHODS -------------------------------------------------------------

    iterate(evt, e) {
        // skip if at max power
        if (e.power >= e.powerMax) return;
        // handle regeneration for entity
        let amt = this.actionPoints * e.powerPerAP;
        if (e.powerBoostPct) {
            let boost = amt * e.powerBoostPct;
            amt += boost;
        }
        if (amt) {
            let total = (this.partials[e.gid] || 0) + amt;
            if (total >= 1) {
                // update entity power
                let regen = Math.floor(total);
                let update = Math.min(e.power + regen, e.powerMax);
                UpdateSystem.eUpdate(e, {power: update});
                Events.trigger(OverlaySystem.evtNotify, {which: 'popup', actor: e, msg: `+${regen} pow`});
                // calculate remainder
                total -= regen;
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
        return (('power' in e) && ('powerPerAP' in e));
    }

}