export { TriggerSystem };

import { System } from '../base/system.js';
import { MiniaModel } from '../entities/miniaModel.js';

class TriggerSystem extends System {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.aggroTargets = {};
        this.armedTraps = [];
        // -- disable iteration
        this.active = false;
        // -- list of mobile actors that have moved...
        this.mobileActors = [];
        // bind event handlers
        this.onMobileUpdate = this.onMobileUpdate.bind(this);
        this.evt.listen(MiniaModel.evtUpdated, this.onMobileUpdate);
    }
    destroy() {
        super.destroy();
        this.evt.ignore(MiniaModel.evtUpdated, this.onMobileUpdate);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onMobileUpdate(evt) {
        let actor = evt.actor;
        if (actor.constructor.breakable) return;
        if (actor && evt.update && evt.update.hasOwnProperty('idx')) {
            this.active = true;
            //console.log(`trigger found mobile actor moved: ${actor} idx: ${actor.idx}`);
            if (!this.mobileActors.includes(actor)) {
                this.mobileActors.push(actor);
            }
        }
    }

    // METHODS -------------------------------------------------------------
    /**
     * iterate through triggerable entities
     * @param {} evt 
     * @param {*} e 
     */
    iterate(evt, e) {
        // skip trigger if not armed
        if (e.state !== 'armed') return;
        // walk through mobile entities that have moved
        for (const actor of this.mobileActors) {
            // compare location
            if (actor.idx === e.idx) {
                //console.log(`-- actor: ${actor} triggers trap: ${e}`);
                e.trigger(actor);
                break;
            }
        }
    }

    matchPredicate(e) {
        return e.constructor.triggerable;
    }

    finalize(evt) {
        this.active = false;
        this.mobileActors = [];
    }

}