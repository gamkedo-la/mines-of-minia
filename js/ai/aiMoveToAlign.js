export { AiMoveToAlign };

import { Config } from '../base/config.js';
import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { AiDirective } from './aiDirective.js';


class AiMoveToAlign extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        this.pathfinder = spec.pathfinder || this.lvl.pathfinder;
    }

    *run() {
        this.reset();
        // iterate until directive is done
        while (!this.done) {
            // check for end state
            let ai = this.lvl.ifromidx(this.actor.idx);
            let aj = this.lvl.jfromidx(this.actor.idx);
            let ti = this.lvl.ifromidx(this.target.idx);
            let tj = this.lvl.jfromidx(this.target.idx);
            if (ai === ti || aj === tj) {
                this.done = true;
                return null;
            }
            // try to find best target position
            let range = Math.round(this.actor.aggroRange/Config.tileSize);
            let bestIdx;
            let bestd;
            for (let i=ti-range; i<ti+range; i++) {
                let d = Mathf.distance(i, tj, ai, aj);
                if (!bestIdx || d < bestd) {
                    bestIdx = this.lvl.idxfromij(i,tj);
                    bestd = d;
                }
            }
            for (let j=tj-range; j<tj+range; j++) {
                let d = Mathf.distance(ti, j, ai, aj);
                if (!bestIdx || d < bestd) {
                    bestIdx = this.lvl.idxfromij(ti,j);
                    bestd = d;
                }
            }

            // run pathfinding to best index
            let path = this.pathfinder.find(this.actor, this.actor.idx, bestIdx);
            // -- no path
            if (!path) {
                this.ok = false;
                this.done = true;
                console.log(`pathfinding failed`);
                return null;
            }

            if (this.dbg) console.log(`move from: ${this.actor.idx} towards: ${bestIdx} path: ${Fmt.ofmt(path)}`);
            let action = path.actions[0];
            yield action;

        }
    }

}