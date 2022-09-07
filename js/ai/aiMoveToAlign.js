export { AiMoveToAlign };

import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { AiDirective } from './aiDirective.js';


class AiMoveToAlign extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        this.pathfinder = spec.pathfinder || this.lvl.pathfinder;
        this.meleeRange = spec.meleeRange || this.actor.meleeRange;
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
            if (this.getTargetRange() <= this.meleeRange) {
                this.done = true;
                return null;
            }
            // try to find best target position
            let range = Math.round(this.actor.aggroRange/Config.tileSize);
            let bestIdx;
            let bestd;
            for (let i=ti-range; i<ti+range; i++) {
                // check if occupied
                let idx = this.lvl.idxfromij(i,tj);
                if (this.lvl.anyidx(idx, (e) => this.actor.blockedBy & e.blocks)) continue;
                let d = Mathf.distance(i, tj, ai, aj);
                if (!bestIdx || d < bestd) {
                    bestIdx = idx;
                    bestd = d;
                }
            }
            for (let j=tj-range; j<tj+range; j++) {
                let idx = this.lvl.idxfromij(ti,j);
                if (this.lvl.anyidx(idx, (e) => this.actor.blockedBy & e.blocks)) continue;
                let d = Mathf.distance(ti, j, ai, aj);
                if (!bestIdx || d < bestd) {
                    bestIdx = idx;
                    bestd = d;
                }
            }

            // run pathfinding to best index
            let path = this.pathfinder.find(this.actor, this.actor.idx, bestIdx);
            // -- no path
            if (!path) {
                console.log(`can't path to ${bestIdx}:${this.lvl.ifromidx(bestIdx)},${this.lvl.jfromidx(bestIdx)} a: ${ai},${aj} t: ${ti},${tj}`);
                this.ok = false;
                this.done = true;
                return null;
            }

            if (this.dbg) console.log(`move from: ${this.actor.idx} towards: ${bestIdx} path: ${Fmt.ofmt(path)}`);
            let action = path.actions[0];
            // face target
            let targetDir = this.getTargetDirection();
            let facing = Direction.easterly(targetDir) ? Direction.east : (Direction.westerly(targetDir)) ? Direction.west : 0;
            console.log(`dir: ${targetDir} facing: ${facing}`);
            if (facing) action.facing = facing;
            yield action;

        }
    }

}