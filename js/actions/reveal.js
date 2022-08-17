export { RevealAction };
import { Action } from '../base/actions/action.js';
import { Assets } from '../base/assets.js';
import { Direction } from '../base/dir.js';
import { Events } from '../base/event.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Timer } from '../base/timer.js';
import { OverlaySystem } from '../systems/overlaySystem.js';

class RevealAction extends Action {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltTTL = 500;

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltSketch() {
        return Assets.get('vfx.reveal', true);
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
        // reveal actor
        UpdateSystem.eUpdate(this.actor, { hidden: false });
        // detect any facades that are at same index
        let deleted = false;
        for (const facade of this.lvl.findidx(this.actor.idx, (v) => v.cls === 'Facade')) {
            facade.destroy();
            deleted = true;
        }
        if (deleted) {
            for (const nidx of Direction.all.map((v) => this.lvl.idxfromdir(this.actor.idx, v))) {
                console.log(`find tiles at ${nidx} from ${this.actor.idx}`);
                for (const tile of this.lvl.findidx(nidx, (v) => v.cls === 'Tile' || v.cls === 'Facade')) {
                    console.log(`recompute sketches for ${tile}`);
                    tile.computeSketches();
                }
            }
        }
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
        // play sfx at start of reveal
        if (this.sfx) this.sfx.play();
    }

}
