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
            console.log(`move to idx running`);
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
                console.log(`move to idx no path to ${this.targetIdx}`);
                return null;
            }
            // iterate through pathfinder actions
            let points = 0;
            if (this.dbg) console.log(`move from: ${this.actor.idx} towards: ${this.targetIdx} path: ${Fmt.ofmt(path)}`);
            for (const action of path.actions) {
                // no points spent yet...
                if (!points) {
                    points += action.points;
                    yield action;
                // points spent taking action
                } else {
                    // free action?
                    if (action.points === 0) {
                        yield action;
                    } else {
                        // once points have been spent, and we've hit a non-free action, break
                        break;
                    }
                }
            }
        }
    }

}