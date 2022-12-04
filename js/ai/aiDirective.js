export { AiDirective };

import { Direction } from '../base/dir.js';
import { Gizmo } from '../base/gizmo.js';
import { Mathf } from '../base/math.js';

class AiDirective extends Gizmo {

    cpost(spec) {
        super.cpost(spec);
        this.lvl = spec.lvl;
        this.actor = spec.actor;
        this.target = spec.target;
        this.dbg = spec.dbg;
        this.ok = true;
        this.done = false;
    }

    getTargetRange() {
        if (!this.target) return 0;
        let d = Mathf.distance(this.target.xform.x, this.target.xform.y, this.actor.xform.x, this.actor.xform.y);
        return d;
    }

    getTargetDirection() {
        if (!this.target) return 0;
        let angle = Mathf.angle(this.actor.xform.x, this.actor.xform.y, this.target.xform.x, this.target.xform.y, true);
        return Direction.diagonalFromHeading(angle);
    }

    isTargetAdjacent() {
        if (!this.target) return false;
        for (const dir of Direction.all) {
            let idx = this.lvl.idxfromdir(this.actor.idx, dir);
            if (idx === this.target.idx) return true;
        }
        return false;
    }

    reset() {
        this.ok = true;
        this.done = false;
    }

    *run() {
    }

    stop(ok=false) {
        this.ok = ok;
        this.done = true;
    }

}