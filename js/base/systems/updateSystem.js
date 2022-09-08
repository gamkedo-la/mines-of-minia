export { UpdateSystem };

import { Entity } from '../entity.js';
import { Events } from '../event.js';
import { Fmt } from '../fmt.js';
import { System } from '../system.js';
import { Util } from '../util.js';
import { Model } from '../model.js';
import { Stats } from '../stats.js';

class UpdateSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltIterateTTL = 0;

    // STATIC METHODS ------------------------------------------------------
    static eUpdate(e, update, cb) {
        if (Util.empty(update)) return;
        Stats.count('e.update');
        // if callback function is given, setup one-time listener for entity's updated event, called when update has been applied
        if (cb) {
            e.evt.listen(e.constructor.evtUpdated, (evt) => cb(), Events.once );
        }
        // apply the update to entity
        Util.update(e, update);
        // cascade e.intent event for given update
        e.evt.trigger(e.constructor.evtIntent, {actor: e, update: update}, true);
    }

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.updates = new Map();
        // -- events
        this.evtEntityIntent = spec.evtEntityIntent || Entity.evtIntent;
        // -- bind event handlers
        this.onEntityIntent = this.onEntityIntent.bind(this);
        Events.listen(this.evtEntityIntent, this.onEntityIntent, Events.last);
    }
    destroy() {
        Events.ignore(this.evtEntityIntent, this.onEntityIntent);
    }

    // EVENT HANDLERS ------------------------------------------------------
    // -- entities are not directly tracked by system
    onEntityAdded(evt) {}
    onEntityRemoved(evt) {}

    onEntityIntent(evt) {
        let actor = evt.actor;
        // does entity match predicate?
        if (!this.matchPredicate(actor)) return;
        // process intent
        if (this.updates.has(actor)) {
            this.updates.get(actor).push(evt.update);
        } else {
            this.updates.set(actor, [evt.update]);
        }
    }

    // METHODS -------------------------------------------------------------
    matchPredicate(e) {
        return e instanceof Model;
    }

    finalize() {
        let finalUpdates = this.updates;
        this.updates = new Map();
        for (const [e,updates] of finalUpdates) {
            // update entity
            let final = Util.update({}, ...updates);
            Util.update(e, final);
            e.evt.trigger(e.constructor.evtUpdated, {actor: e, update: final}, true);
        }
        //this.updates.clear();
    }

}