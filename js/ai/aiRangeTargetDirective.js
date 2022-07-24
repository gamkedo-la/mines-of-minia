export { AiRangeTargetDirective };

import { RangeAttackAction } from '../actions/attack.js';
import { AiDirective } from './aiDirective.js';

class AiRangeTargetDirective extends AiDirective {
    cpost(spec) {
        super.cpost(spec);
        this.rangeMin = this.actor.rangeMin;
        this.rangeMax = this.actor.rangeMax;
        this.weapon = spec.weapon;
    }

    *run() {
        this.reset();
        while (!this.done) {
            //console.log(`airange target running`);
            let range = this.getTargetRange();
            //console.log(`range: ${range} this.range: ${this.range}`)
            // check for LoS
            if (this.actor.losIdxs.length && !this.actor.losIdxs.includes(this.target.idx)) {
                this.ok = false;
                this.done = true;
                return null;
            }
            // check for target in range
            if (range > this.rangeMax || range < this.rangeMin) {
                this.ok = false;
                this.done = true;
                return null;
            }
            //console.log(`before melee attack yield`);
            yield new RangeAttackAction({
                target: this.target,
                weapon: this.weapon,
            });
        }
    }
}