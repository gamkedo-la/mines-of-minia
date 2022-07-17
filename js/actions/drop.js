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
        this.item = spec.item;
        this.sfx = spec.sfx || this.constructor.dfltSfx;
    }

    setup() {
        // this is an instant action
        this.done = true;
        // try to remove from actor inventory
        this.actor.inventory.removeItem(this.item, true);
        // -- show item
        this.item.visible = true;
        this.item.active = true;
        // -- update item state/position
        UpdateSystem.eUpdate(this.item, { 
            animState: 'free',
            idx: this.actor.idx,
            xform: {
                x: this.actor.xform.x,
                y: this.actor.xform.y,
            },
        });
        // -- remove item from level
        this.item.evt.trigger(this.item.constructor.evtEmerged, {actor: this.item}, true);
        // play sound
        if (this.sfx) this.sfx.play();
    }
}