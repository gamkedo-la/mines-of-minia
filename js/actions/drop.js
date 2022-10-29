export { DropAction };

import { Action } from '../base/actions/action.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Fmt } from '../base/fmt.js';
import { Generator } from '../base/generator.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { XForm } from '../base/xform.js';

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
        this.all = spec.hasOwnProperty('all') ? spec.all : true;
        console.log(`drop item: ${this.item}`);
    }

    setup() {
        // this is an instant action
        this.done = true;
        // try to remove from actor inventory
        let slot = this.actor.inventory.getSlot(this.item);
        this.actor.inventory.removeItem(this.item, true);
        if (!this.all && this.item.count > 1 && slot !== -1) {
            // split item from inventory
            let x_leftover = this.item.as_kv();
            x_leftover.count -= 1;
            delete x_leftover.gid;
            x_leftover.xform = new XForm({x: this.actor.xform.x, y: this.actor.xform.y, stretch: false});
            let leftover = Generator.generate(x_leftover);
            let h = leftover.xform.height;
            leftover.xform.offx = -leftover.xform.width*.5;
            if (h > Config.tileSize) {
                leftover.xform.offy = Config.tileSize*.5 - leftover.xform.height;
            } else {
                leftover.xform.offy = -leftover.xform.height*.5;
            }
            this.actor.inventory.add(leftover, slot);
            this.item.count = 1;
        }
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
        // -- add item to level
        this.item.evt.trigger(this.item.constructor.evtEmerged, {actor: this.item}, true);
        // play sound
        if (this.sfx) this.sfx.play();
    }
}