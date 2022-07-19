export { PlaySfxAction };

import { Action } from './action.js';

class PlaySfxAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.sfx = spec.sfx;
    }

    setup() {
        // this is an instant action
        this.done = true;
        if (this.sfx) this.sfx.play();
    }

}