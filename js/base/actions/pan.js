export { PanToActorAction }
import { Action } from './action.js';

class PanToActorAction extends Action {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.camera = spec.camera;
        this.onPanned = this.onPanned.bind(this);
    }
    destroy() {
        super.destroy();
        this.camera.evt.ignore(this.camera.constructor.evtPanned, this.onPanned);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onPanned(evt) {
        if (this.dbg) console.log(`${this} is done`);
        this.finish();
    }

    // METHODS -------------------------------------------------------------
    setup() {
        this.camera.evt.listen(this.camera.constructor.evtPanned, this.onPanned);
        this.camera.panToTarget(this.actor);
    }

}