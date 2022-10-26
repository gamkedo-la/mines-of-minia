export { AiMoveTowardsTargetDirective };

    import { Fmt } from '../base/fmt.js';
import { AiDirective } from './aiDirective.js';

class AiMoveTowardsTargetDirective extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        this.pathfinder = spec.pathfinder || this.lvl.pathfinder;
        // -- move towards can either specify a range to be within or 'adjacent' which indicates to move adjacent to target
        this.adjacent = spec.hasOwnProperty('adjacent') ? spec.adjacent : false;
        this.range = spec.range || this.actor.meleeRange;
    }

    *run() {
        this.reset();
        // iterate until directive is done
        while (!this.done) {
            // check for end state
            let attgt = false;
            if (this.adjacent) {
                attgt = this.isTargetAdjacent();
            } else {
                let d = this.getTargetRange();
                attgt = (d <= this.range);
            }
            if (attgt) {
                if (this.dbg) console.log(`${this.actor} move to target at target, done`);
                this.done = true;
                return null;
            }
            // otherwise, run pathfinding to move towards target
            let path = this.pathfinder.find(this.actor, this.actor.idx, this.target.idx, this.lvl.checkAdjacentIdx.bind(this.lvl));
            // -- no path
            if (!path) {
                this.ok = false;
                this.done = true;
                console.log(`pathfinding failed`);
                return null;
            }
            // iterate through pathfinder actions
            if (this.dbg) console.log(`move from: ${this.actor.idx} towards: ${this.target.idx} path: ${Fmt.ofmt(path)}`);
            let action = path.actions[0];
            yield action;
        }
    }

}