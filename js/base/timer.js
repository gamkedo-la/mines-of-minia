import { Events } from "./event.js";
import { Stats } from "./stats.js";

export { Timer };

class Timer {
    static dfltTTL = 1000;

    constructor(spec={}) {
        this.evt = spec.evt || Events.main;
        this.evtTock = spec.evtTock || 'game.tock';
        this.ttl = spec.hasOwnProperty('ttl') ? spec.ttl : Timer.dfltTTL;
        this.loop = spec.loop || false;
        this.startTTL = this.ttl;
        this.cb = spec.cb || (() => false);
        this.data = spec.data;
        // bind event handlers
        this.onTock = this.onTock.bind(this);
        // event handling
        this.evt.listen(this.evtTock, this.onTock);
    }

    onTock(evt) {
        Stats.count('timer.ontock');
        this.ttl -= evt.deltaTime;
        if (this.ttl <= 0) {
            let overflow = -this.ttl;
            if (this.loop) {
                this.ttl += this.startTTL;
                if (this.ttl < 0) this.ttl = 0;
            } else {
                this.evt.ignore(this.evtTock, this.onTock);
            }
            this.cb(Object.assign( { overflow: overflow, elapsed: this.startTTL + overflow }, evt, this.data));
        }
    }

    destroy() {
        this.evt.ignore(this.evtTock, this.onTock);
    }
}