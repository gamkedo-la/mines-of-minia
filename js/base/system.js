export { System, Systems }

import { Gizmo }                from './gizmo.js';
import { Events }               from './event.js';
import { Timer }                from './timer.js';
import { Fmt }                  from './fmt.js';
import { Stats }                from './stats.js';

class System extends Gizmo {
    // STATIC VARIABLES ----------------------------------------------------
    static cat = 'System';
    static dfltIterateTTL = 200;

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        this.iterateTTL = spec.hasOwnProperty('iterateTTL') ? spec.iterateTTL : this.constructor.dfltIterateTTL;
        this.dbg = spec.hasOwnProperty('dbg') ? spec.dbg : false;
        // -- a kv store (get,set,values)
        this.store = spec.store || new Map();
        // -- active status of system
        this.active = spec.hasOwnProperty('active') ? spec.active : true;
        this.iterating = false;

        // -- events
        this.evt = spec.evt || Events.main;
        this.evtTock = spec.evtTock || 'game.tock';
        this.evtEntityAdded = spec.evtEntityAdded || 'e.created';
        this.evtEntityRemoved = spec.evtEntityRemoved || 'e.destroyed';

        // -- bind event handlers
        this.onTimer = this.onTimer.bind(this);
        this.onEntityAdded = this.onEntityAdded.bind(this);
        this.onEntityRemoved = this.onEntityRemoved.bind(this);
        this.evt.listen(this.evtEntityAdded, this.onEntityAdded);
        this.evt.listen(this.evtEntityRemoved, this.onEntityRemoved);

        // -- setup system timer
        this.timer = new Timer({ttl: this.iterateTTL, cb: this.onTimer, evtTock: this.evtTock, loop: true});
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTimer(evt) {
        if (!this.active) return;
        this.iterating = true;
        this.prepare(evt);
        for (const e of this.store.values()) {
            Stats.count('sys.iterate');
            this.iterate(evt, e);
        }
        this.finalize(evt);
        this.iterating = false;
    }
    onEntityAdded(evt) {
        if (this.matchPredicate(evt.actor)) {
            if (this.dbg) console.log(`${this} onEntityAdded: ${Fmt.ofmt(evt)} gid: ${evt.actor.gid}`);
            this.store.set(evt.actor.gid, evt.actor);
        }
    }
    onEntityRemoved(evt) {
        if (this.dbg) console.log(`${this} onEntityRemoved: ${Fmt.ofmt(evt)}`);
        this.store.delete(evt.actor.gid);
    }

    // METHODS -------------------------------------------------------------
    matchPredicate(e) {
        return false;
    }

    prepare(evt) {
    }

    iterate(evt, e) {
    }

    finalize(evt) {
    }

}

// global/static collection of game systems
class Systems {
    // STATIC VARIABLES ----------------------------------------------------
    static items = {};

    // STATIC METHODS ------------------------------------------------------
    static add(tag, system) {
        this.items[tag] = system;
    }

    static remove(tag, destroy=true) {
        let system = this.items[tag];
        delete this.items[tag];
        if (system && destroy) system.destroy();
    }

    static get(tag) {
        return this.items[tag];
    }

}