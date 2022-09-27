export { AiHideDirective };

import { HideAction } from '../actions/hide.js';
import { Config } from '../base/config.js';
import { AiDirective } from './aiDirective.js';

class AiHideDirective extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        // -- delay for X rounds
        this.delay = spec.delay || 0;
        this.elapsed = 0;
        this.minRange = spec.minRange || Config.tileSize*2;
    }

    reset() {
        super.reset();
        this.elapsed = 0;
    }

    *run() {
        this.reset();
        // iterate until directive is done
        console.log(`-- start hiding`);
        while (!this.done) {
            // check for too close to target
            if (this.getTargetRange() < this.minRange) {
                console.log(`-- hiding failed, target too close`);
                this.ok = false;
                this.done = true;
                return null;
            }
            // check for end state
            this.elapsed++;
            if (this.elapsed > this.delay) {
                console.log(`-- slipping into stealth`);
                let action = new HideAction({points: this.actor.pointsPerturn});
                yield action;
                // all done...
                console.log(`-- hiding done`);
                this.done = true;
                return null;
            }
            
            // nothing to do while waiting...
            console.log(`-- hiding delay w/ elapsed: ${this.elapsed}`);
            yield null;

        }
    }

}