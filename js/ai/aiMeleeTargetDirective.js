export { AiMeleeTargetDirective };

import { MeleeAttackAction } from '../actions/attack.js';
import { AiDirective } from './aiDirective.js';

class AiMeleeTargetDirective extends AiDirective {
    cpost(spec) {
        super.cpost(spec);
        this.range = this.actor.meleeRange;
    }

    *run() {
        this.reset();
        let iterations = 50;
        while (!this.done) {
            let range = this.getTargetRange();
            if (iterations-- <= 0) break;
            // check for target in range
            if (range > this.range) {
                if (this.dbg) console.log(`${this.actor} melee target out of range, done`);
                this.ok = false;
                this.done = true;
                return null;
            }
            yield new MeleeAttackAction({
                points: this.actor.pointsPerTurn,
                target: this.target,
            });
        }
    }
}