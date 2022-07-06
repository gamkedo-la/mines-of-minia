export { PickupAction, DoPickupAction }

import { Action } from '../base/actions/action.js';
import { SerialAction } from '../base/actions/serialAction.js';

class DoPickupAction extends Action {
    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.lvl = spec.lvl;
    }
    setup() {
    }
}

class PickupAction extends SerialAction {
    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.lvl = spec.lvl;
    }

    setup() {
        let x = this.lvl.xfromidx(idx, true);
        let y = this.lvl.yfromidx(idx, true);
        let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
        // -- move towards target
        this.subs.push( new MoveAction({ 
            x:x, 
            y:y, 
            accel: .001, 
            snap: true, 
            facing: facing, 
            update: { idx: idx } 
        }));

        this.subs.push( new DoPickupAction({
            target: this.target,
        }));
    }
}