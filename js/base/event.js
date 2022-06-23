export { Event, EvtStream, Events };

import { Fmt }              from "./fmt.js";
import { Stats } from "./stats.js";

/** ========================================================================
 * represents an instance of an event that is triggered, along w/ associated event data
 */
class Event {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(tag, atts={}) {
        this.tag = tag;
        Object.assign(this, atts);
    }

    // METHODS -------------------------------------------------------------
    toString() {
        return Fmt.ofmt(this, this.constructor.name);
    }
}

class EvtStream {
    // STATIC VARIABLES ----------------------------------------------------
    static once = 1;
    static last = 2;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor() {
        this.counts = new Map();
        this.listeners = new Map();
    }

    // METHODS -------------------------------------------------------------
    count(tag) {
        return this.counts.get(tag) || 0;
    }

    listen(tag, fcn, flags=0) {
        if (!this.listeners.has(tag)) {
            this.listeners.set(tag, new Map());
        }
        let listeners = this.listeners.get(tag);
        listeners.set(fcn, flags);
    }

    ignore(tag, fcn) {
        // -- if no function is passed, clear all listeners for given tag
        if (!fcn) {
            this.listeners.delete(tag);
            return;
        }
        // -- lookup listeners for tag
        let listeners = this.listeners.get(tag);
        if (!listeners) return;
        // -- delete handler function from listener list
        listeners.delete(fcn);
        if (!listeners.size) this.listeners.delete(tag);
    }

    trigger(tag, atts, global=false) {
        if (!tag) return;
        // -- cascade global event
        if (global) {
            Events.trigger(tag, atts);
        }
        // -- update counts
        let count = this.counts.get(tag) || 0;
        this.counts.set(tag, count+1);
        // -- check for listeners
        let listeners = this.listeners.get(tag);
        if (!listeners) return;
        let evt = new Event(tag, atts);
        let cbs = [];
        // collect trigger callbacks
        for (const [fcn, flags] of listeners) {
            // simple sort... events marked w/ last are pushed to end of callback list, all entries are inserted at start of callback list
            if (flags & EvtStream.last) {
                cbs.push(fcn);
            } else {
                cbs.unshift(fcn);
            }
            if (flags & EvtStream.once) listeners.delete(fcn);
        }
        if (!listeners.size) this.listeners.delete(tag);
        // now trigger all callbacks
        for (const cb of cbs) {
            cb(evt);
        }
    }
    toString() {
        return Fmt.toString(this.constructor.name, Array.from(this.listeners.keys()));
    }

}

class Events {
    // STATIC VARIABLES ----------------------------------------------------
    static main = new EvtStream();
    static once = 1;
    static last = 2;

    // STATIC PROPERTIES ---------------------------------------------------
    static get null() {
        return {
            tag: "null",
            id: 0,
            count: () => 0,
            listen: () => false,
            ignore: () => false,
            trigger: () => false,
        }
    }

    // STATIC METHODS ------------------------------------------------------
    static listen(tag, fcn, flags=0) {
        this.main.listen(tag, fcn, flags);
    }

    static ignore(tag, fcn) {
        this.main.ignore(tag, fcn);
    }

    static trigger(tag, atts) {
        this.main.trigger(tag, atts);
    }

    static count(tag) {
        return this.main.count(tag);
    }

}