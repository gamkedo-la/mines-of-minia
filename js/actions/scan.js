export { ScanAction };

import { Action } from '../base/actions/action.js';
import { Events } from '../base/event.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { Timer } from '../base/timer.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { RevealAction } from './reveal.js';

class ScanAction extends Action {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltTTL = 1000;
    static dfltScanRange = 24;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec) {
        super(spec);
        this.lvl = spec.lvl;
        this.sfx = spec.sfx;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        this.onTimer = this.onTimer.bind(this);
    }
    destroy() {
        super.destroy();
        if (this.timer) this.timer.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTimer(evt) {
        if (this.dbg) console.log(`${this} is done`);
        let scanRange = this.actor.scanRange || this.constructor.dfltScanRange;
        let revealed = false;
        for (const idx of this.lvl.idxsInRange(this.actor.idx, scanRange)) {
            for (const hidden of this.lvl.findidx(idx, (v) => v.hidden)) {
                // setup reveal action on hidden object
                let action = new RevealAction();
                ActionSystem.assign(hidden, action);
                revealed = true;
            }
        }
        if (revealed ) {
            Events.trigger(OverlaySystem.evtNotify, { actor: this.actor, which: 'info', msg: `you noticed something` });
        }
        // finish
        this.finish();
    }

    setup() {
        // start timer
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
        // play scan sfx
        if (this.sfx) this.sfx.play();
    }
}