export { AiChargeDirective };

import { ChargeAction } from '../actions/charge.js';
import { Direction } from '../base/dir.js';
import { AiDirective } from './aiDirective.js';

class AiChargeDirective extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        // -- delay for X rounds
        this.delay = spec.delay || 1;
        this.elapsed = 0;
    }

    reset() {
        super.reset();
        this.elapsed = 0;
    }

    *run() {
        this.reset();
        // pick charge direction
        let ai = this.lvl.ifromidx(this.actor.idx);
        let aj = this.lvl.jfromidx(this.actor.idx);
        let ti = this.lvl.ifromidx(this.target.idx);
        let tj = this.lvl.jfromidx(this.target.idx);
        this.chargeDir = Direction.cardinalFromXY(ti-ai, tj-aj);
        console.log(`-- starting charge with dir: ${Direction.toString(this.chargeDir)}`);
        // iterate until directive is done
        while (!this.done) {
            // check for delay
            if (this.elapsed < this.delay) {
                console.log(`-- charging delay`);
                this.elapsed++;
                yield null;
            }
            
            // charge
            console.log(`-- charge`);
            yield new ChargeAction({lvl: this.lvl, chargeDir: this.chargeDir });

            // all done
            console.log(`-- charge is done`);
            this.done = true;
            return null;

        }
    }

}