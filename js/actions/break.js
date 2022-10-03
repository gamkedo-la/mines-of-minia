export { BreakAction };

import { Action } from '../base/actions/action.js';
import { Assets } from '../base/assets.js';

class BreakAction extends Action {
    static _dfltSfx;
    static get dfltSfx() {
        if (!this._dfltSfx) this._dfltSfx = Assets.get('item.break', true);
        return this._dfltSfx;
    }

    constructor(spec) {
        super(spec);
        this.item = spec.item;
        this.target = spec.target;
        this.idx = spec.idx;
        this.sfx = spec.sfx || this.constructor.dfltSfx;
    }

    setup() {
        // this is an instant action
        this.done = true;

        // play sound
        if (this.sfx) this.sfx.play();

        // -- break item
        if (this.item.break) {
            this.item.break(this.target, this.idx)
        } else {
            this.item.destroy();
        }

    }
}