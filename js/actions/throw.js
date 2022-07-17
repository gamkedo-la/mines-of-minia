export { ThrowAction };

import { SerialAction } from '../base/actions/serialAction.js';
import { DropAction } from './drop.js';

class ThrowAction extends SerialAction {
    constructor(spec) {
        super(spec);
        this.item = spec.item;
        this.targetIdx = spec.targetIdx;
        this.lvl = spec.lvl;
    }

    setup() {
        if (this.dbg) console.log(`starting ${this} action w ttl: ${this.ttl}`);
        // actor first "drops" item
        this.subs.push( new DropAction({
            target: this.item,
            // FIXME
            //sfx: this.throwSfx,
        }));

        // check path to target

        /*
        testBlockedAlongLine(idxs, p1idx,p1x,p1y, p2idx,p2x,p2y) {
            // check if los is blocked by determining what is in line between test index and player
            for (const lidx of idxs) {
                if (lidx === p1idx || lidx === p2idx) continue;
                if (this.lvl.checkIdxIntersectSegment(lidx, p1x, p1y, p2x, p2y)) {
                    // find objects at index
                    if (this.lvl.anyidx(lidx, (v) => v.idx === lidx && this.checkBlockFcn(v))) return true;
                }
            }
            return false;
        }
        */

        // move to target
        this.subs.push( new MoveAction({
            x: this.actor.xform.x,
            y: this.actor.xform.y,
            speed: this.nudgeSpeed,
            accel: this.nudgeAccel,
            range: 2,
            stopAtTarget: true,
            snap: true,
        }));

        // hit target

        // -- nudge towards target
        if (this.nudge) {
            let angle = Mathf.angle(this.actor.xform.x, this.actor.xform.y, this.target.xform.x, this.target.xform.y, true);
            let x = Math.round(this.actor.xform.x + Math.cos(angle) * this.nudge);
            let y = Math.round(this.actor.xform.y + Math.sin(angle) * this.nudge);
            let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
            this.subs.push( new MoveAction({
                x: x,
                y: y,
                speed: this.nudgeSpeed,
                accel: this.nudgeAccel,
                range: 2,
                stopAtTarget: true,
                snap: true,
                facing: facing,
            }));
        }
        this.subs.push( new AttackRollAction({
            target: this.target,
            ttl: this.ttl,
        }));

    }

}