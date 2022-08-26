export { AiChargeDirective };

    import { ChargeAction } from '../actions/charge.js';
import { Direction } from '../base/dir.js';
import { AiDirective } from './aiDirective.js';

class AiChargeDirective extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        // -- energize for X rounds
        this.delay = spec.delay || 1;
    }

    *run() {
        this.reset();
        // pick charge direction
        let ai = this.lvl.ifromidx(this.actor.idx);
        let aj = this.lvl.jfromidx(this.actor.idx);
        let ti = this.lvl.ifromidx(this.target.idx);
        let tj = this.lvl.jfromidx(this.target.idx);
        this.chargeDir = Direction.cardinalFromXY(ti-ai, tj-aj);
        console.log(`chargeDir: ${Direction.toString(this.chargeDir)}`);
        // iterate until directive is done
        while (!this.done) {
            // check for alignment
            let ai = this.lvl.ifromidx(this.actor.idx);
            let aj = this.lvl.jfromidx(this.actor.idx);
            let ti = this.lvl.ifromidx(this.target.idx);
            let tj = this.lvl.jfromidx(this.target.idx);
            console.log(`a: ${ai},${aj} t: ${ti},${tj}`);
            if (ai !== ti && aj !== tj) {
                this.ok = false;
                this.done = true;
                return null;
            }
            // check for delay
            if (this.delay) {
                this.delay--;
                return null;
            }
            
            // charge
            console.log(`## charge ##`);
            yield new ChargeAction({chargeDir: this.chargeDir });

        }
    }

}