export { AiThumpTargetDirective };

import { MeleeAttackAction } from '../actions/attack.js';
import { AiDirective } from './aiDirective.js';

class AiThumpTargetDirective extends AiDirective {
    cpost(spec) {
        super.cpost(spec);
        this.range = this.actor.meleeRange;
    }

    *run() {
        this.reset();
        while (!this.done) {
            let range = this.getTargetRange();
            // check for target in range
            if (range > this.range) {
                this.ok = false;
                this.done = true;
                return null;
            }

            // aim
            console.log(`aim`);
            yield null;

            //console.log(`before melee attack yield`);
            console.log(`thump`);
            yield new MeleeAttackAction({
                target: this.target,
            });
        }
    }
}