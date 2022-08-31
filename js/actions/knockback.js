export { KnockbackAction };

import { GeneratorAction } from '../base/actions/generatorAction.js';
import { MoveAction } from '../base/actions/move.js';
import { Direction } from '../base/dir.js';

class KnockbackAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
        this.dir = spec.dir || Direction.east;
        this.steps = spec.steps || 1;
        this.lvl = spec.lvl;
        this.speedFactor = spec.speedFactor || 3;
        this.sfx = spec.sfx;
    }
    destroy() {
        super.destroy();
        if (this.sfx) this.sfx.destroy();
    }

    *run() {
        // -- while pushback...
        while (this.steps > 0) {
            this.steps--;
            console.log(`this.steps: ${this.steps}`);
            // find next index based on actor position and direction
            let nidx = this.lvl.idxfromdir(this.actor.idx, this.dir);
            // something blocks path...
            if (this.lvl.anyidx(nidx, (e) => (this.actor.blockedBy & e.blocks))) break;
            // yield movement
            let x = this.lvl.xfromidx(nidx, true);
            let y = this.lvl.yfromidx(nidx, true);
            let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
            // peek at next next index to determine if it will block movement
            let stop = this.steps <= 0 || this.lvl.anyidx(this.lvl.idxfromdir(nidx, this.dir), (e) => this.actor.blockedBy & e.blocks && !e.constructor.mobile);
            //console.log(`move to ${x},${y}:${nidx} facing: ${facing} stop: ${stop}`)
            yield new MoveAction({ speed: this.actor.maxSpeed*this.speedFactor, x:x, y:y, accel: .01, snap: stop, stopAtTarget: stop, update: { idx: nidx }, sfx: this.actor.moveSfx });
        }

        // otherwise... no longer moving... finish up
        return null;

    }

}