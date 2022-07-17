export { DropAction };

import { Action } from '../base/actions/action.js';
import { Assets } from '../base/assets.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';

class DropAction extends Action {
    static _dfltSfx;
    static get dfltSfx() {
        if (!this._dfltSfx) this._dfltSfx = Assets.get('item.drop', true);
        return this._dfltSfx;
    }

    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.sfx = spec.sfx || this.constructor.dfltSfx;
    }

    setup() {
        // this is an instant action
        this.done = true;
        // try to remove from actor inventory
        this.actor.inventory.removeItem(this.target, true);
        // -- show item
        this.target.visible = true;
        this.target.active = true;
        // -- update item state/position
        UpdateSystem.eUpdate(this.target, { 
            animState: 'free',
            idx: this.actor.idx,
            xform: {
                x: this.actor.xform.x,
                y: this.actor.xform.y,
            },
        });
        // -- remove item from level
        this.target.evt.trigger(this.target.constructor.evtEmerged, {actor: this.target}, true);
        // play sound
        if (this.sfx) this.sfx.play();
    }
}