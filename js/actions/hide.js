export { HideAction };
import { Action } from '../base/actions/action.js';
import { Assets } from '../base/assets.js';
import { Direction } from '../base/dir.js';
import { Events } from '../base/event.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Timer } from '../base/timer.js';
import { OverlaySystem } from '../systems/overlaySystem.js';

class HideAction extends Action {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltTTL = 500;

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return Assets.get('vfx.hide', true);
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.lvl = spec.lvl;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        this.vfx = spec.vfx || this.constructor.dfltSketch;
        this.sfx = spec.sfx;
        this.onTimer = this.onTimer.bind(this);
    }
    destroy() {
        super.destroy();
        if (this.timer) this.timer.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTimer(evt) {
        if (this.dbg) console.log(`${this} is done`);
        // hide actor
        UpdateSystem.eUpdate(this.actor, { hidden: true });
        // finish
        this.finish();
    }

    // METHODS -------------------------------------------------------------
    setup() {
        if (this.dbg) console.log(`starting ${this} action w ttl: ${this.ttl}`);
        // start timer to finish use action
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
        // create vfx
        if (this.vfx) {
            Events.trigger(OverlaySystem.evtNotify, { actor: this.actor, which: 'vfx', vfx: this.vfx });
        }
        // play sfx at start of hide
        if (this.sfx) this.sfx.play();
    }

}
