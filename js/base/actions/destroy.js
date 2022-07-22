export { DestroyAction, DestroyTargetAction };

import { Action } from './action.js';

class DestroyAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.sfx = spec.sfx;
    }

    setup() {
        // this is an instant action
        this.done = true;
        if (this.sfx) this.sfx.play();
        this.actor.destroy();
    }

}

class DestroyTargetAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.sfx = spec.sfx;
        this.target = spec.target;
    }

    setup() {
        // this is an instant action
        this.done = true;
        if (this.sfx) this.sfx.play();
        if (this.target) this.target.destroy();
    }

}