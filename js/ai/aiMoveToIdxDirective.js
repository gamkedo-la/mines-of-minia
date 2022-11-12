export { AiMoveToIdxDirective };

import { Fmt } from '../base/fmt.js';
import { AiDirective } from './aiDirective.js';

class AiMoveToIdxDirective extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        this.pathfinder = spec.pathfinder || this.lvl.pathfinder;
        // move target
        this.targetIdx = spec.targetIdx;
    }

    *run() {
        this.reset();
        // iterate until directive is done
        while (!this.done) {
            //console.log(`move to idx running`);
            // check for end state
            if (this.actor.idx === this.targetIdx) {
                console.log(`move to idx reached ${this.targetIdx}`);
                this.done = true;
                return null;
            }
            // otherwise, run pathfinding to move towards target
            let path = this.pathfinder.find(this.actor, this.actor.idx, this.targetIdx);
            // -- no path
            if (!path) {
                this.ok = false;
                this.done = true;
                if (this.dbg) console.log(`move to idx no path to ${this.targetIdx}`);
                return null;
            }
            if (this.dbg) console.log(`move from: ${this.actor.idx} towards: ${this.targetIdx} path: ${Fmt.ofmt(path)}`);
            let action = path.actions[0];
            yield action;
        }
    }

}