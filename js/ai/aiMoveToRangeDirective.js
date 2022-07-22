export { AiMoveToRangeDirective };

import { MoveAction } from '../base/actions/move.js';
import { Direction } from '../base/dir.js';
import { Mathf } from '../base/math.js';
import { Util } from '../base/util.js';
import { LoSSystem } from '../systems/losSystem.js';
import { AiDirective } from './aiDirective.js';

class AiMoveToRangeDirective extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        this.pathfinder = spec.pathfinder || this.lvl.pathfinder;
        // -- move to position within range min/max of target
        this.rangeMin = spec.rangeMin || this.actor.rangeMin;
        this.rangeMax = spec.rangeMax || this.actor.rangeMax;
    }

    *run() {
        console.log(`move to range running`);
        this.reset();
        // iterate until directive is done
        while (!this.done) {
            // check for end state
            let d = this.getTargetRange();
            if (d >= this.rangeMin && d <= this.rangeMax && (!this.actor.losIdxs.length || this.actor.losIdxs.includes(this.target.idx))) {
                this.done = true;
                return null;
            }

            // no LoS?
            // FIXME
            if (this.actor.losIdxs.length && !this.actor.losIdxs.includes(this.target.idx)) {
                this.ok = false;
                this.done = true;
                return null;

            // are we too far away???
            // -- too far
            } else 
            
            if (d >= this.rangeMax) {
                // otherwise, run pathfinding to move towards target
                let path = this.pathfinder.find(this.actor, this.actor.idx, this.target.idx, this.lvl.checkAdjacentIdx.bind(this.lvl));
                // -- no path
                if (!path) {
                    this.ok = false;
                    this.done = true;
                    return null;
                }

                // yield next action from pathfinding...
                if (this.dbg) console.log(`move from: ${this.actor.idx} towards: ${this.target.idx} path: ${Fmt.ofmt(path)}`);
                let action = path.actions[0];
                yield action;

            // -- too close
            } else {
                // can we move in opposite direction of target
                let heading = Mathf.angle(this.target.xform.x, this.target.xform.y, this.actor.xform.x, this.actor.xform.y, true);
                let dir = Direction.diagonalFromHeading(heading);
                let idx = this.lvl.idxfromdir(this.actor.idx, dir);
                // -- nothing blocks actor from target direction
                if (!this.lvl.anyidx(idx, (v) => v.blocks & this.actor.blockedBy)) {
                    let x = this.lvl.xfromidx(idx, true);
                    let y = this.lvl.yfromidx(idx, true);
                    let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
                    let action = new MoveAction({ 
                        points: 1, 
                        x:x, 
                        y:y, 
                        accel: .001, 
                        snap: true, 
                        facing: facing, 
                        update: { idx: idx }, 
                        sfx: this.actor.moveSfx ,
                    });
                    yield action;
                // -- something is blocking adjacent movement
                } else {
                    // find target index within los range
                    let targetIdx = Util.findBest(
                        this.actor.losIdxs,
                        (v) => {
                            let x = this.lvl.xfromidx(v, true);
                            let y = this.lvl.yfromidx(v, true);
                            return Mathf.distance(this.actor.xform.x, this.actor.xform.y, x, y);
                        },
                        (v1,v2) => v1<v2,
                        (v) => {
                            // can't move there...
                            if (this.lvl.anyidx(v, (v2) => v2.blocks & this.actor.blockedBy)) return false;
                            // no LoS to target
                            if (!LoSSystem.checkLoSBetweenIdxs(this.lvl, v, this.target.idx)) return false;
                            return true;
                        }
                    );
                    // no target idx?
                    if (!targetIdx) {
                        this.ok = false;
                        this.done = true;
                        return null;
                    }
                    // pathfind to target index
                    let path = this.pathfinder.find(this.actor, this.actor.idx, targetIdx, this.lvl.checkAdjacentIdx.bind(this.lvl));
                    // -- no path
                    if (!path) {
                        this.ok = false;
                        this.done = true;
                        return null;
                    }

                    // yield next action from pathfinding...
                    if (this.dbg) console.log(`move from: ${this.actor.idx} towards: ${targetIdx} path: ${Fmt.ofmt(path)}`);
                    let action = path.actions[0];
                    yield action;
                }
            }

        }
    }

}