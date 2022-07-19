export { PickupAction, DoPickupAction }

import { Action } from '../base/actions/action.js';
import { MoveAction } from '../base/actions/move.js';
import { SerialAction } from '../base/actions/serialAction.js';
import { Direction } from '../base/dir.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';

class DoPickupAction extends Action {
    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.sfx = spec.sfx;
    }
    setup() {
        // this is an instant action
        this.done = true;
        // try to add to actor inventory
        if (!this.actor.inventory.add(this.target)) {
            this.ok = false;
            console.log(`-- ${this} actor ${this.actor} cannot pickup ${this.target}`);
        // successfully added to inventory
        } else {
            // -- hide item
            this.target.visible = false;
            this.target.active = false;
            // -- update item state
            UpdateSystem.eUpdate(this.target, { animState: 'carry'})
            console.log(`target: ${this.target} animState: ${this.target.animState}`);
            // -- remove item from level
            this.target.orphan();
            if (this.sfx) this.sfx.play();
        }
    }
}

class PickupAction extends SerialAction {
    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.sfx = spec.sfx;
    }

    setup() {
        let x = this.target.xform.x;
        let y = this.target.xform.y;
        let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
        // -- move towards target
        this.subs.push( new MoveAction({ 
            x:x, 
            y:y, 
            accel: .001, 
            snap: true, 
            facing: facing, 
            sfx: this.actor.moveSfx,
            update: { idx: this.target.idx },
        }));

        this.subs.push( new DoPickupAction({
            target: this.target,
            sfx: this.sfx,
        }));
    }
}