export { SpawnAction };
import { Action } from '../base/actions/action.js';
import { Generator } from '../base/generator.js';
import { Timer } from '../base/timer.js';
import { XForm } from '../base/xform.js';

class SpawnAction extends Action {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltTTL = 0;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        this.target = spec.target;
        this.sfx = spec.sfx;
        this.spec = spec.spec;
        this.z = spec.z || 2;
        this.onTimer = this.onTimer.bind(this);
    }
    destroy() {
        super.destroy();
        if (this.timer) this.timer.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTimer(evt) {
        if (this.dbg) console.log(`${this} is done`);

        // -- where to spawn?
        let idx = (this.target) ? this.target.idx : this.actor.idx;
        let x = (this.target) ? this.target.xform.x : this.actor.xform.x;
        let y = (this.target) ? this.target.xform.y : this.actor.xform.y;

        // -- spawn the object
        let x_obj = Object.assign({}, this.spec, {
            idx: idx, 
            z: this.z,
            xform: new XForm({stretch: false, x: x, y: y}),
        });
        let obj = Generator.generate(x_obj);
        // -- emerge object
        obj.evt.trigger(obj.constructor.evtEmerged, {actor: obj}, true);
        // -- play spawn sound
        if (this.sfx) this.sfx.play();
        // finish
        this.finish();
    }

    // METHODS -------------------------------------------------------------
    setup() {
        if (this.dbg) console.log(`starting ${this} action w ttl: ${this.ttl}`);
        // start timer to finish use action
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
    }

}
