export { ChargeAction };

import { GeneratorAction } from '../base/actions/generatorAction.js';
import { Direction } from '../base/dir.js';

class ChargeAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
        this.chargeDir = spec.chargeDir || Direction.east;
        //this.x = spec.x || 0;
        //this.y = spec.y || 0;
        //this.range = spec.range || this.constructor.dfltRange;
        this.snap = spec.hasOwnProperty('snap') ? spec.snap : false;
        this.speed = spec.speed || 0;
        this.accel = spec.accel || 0;
        //this.facing = spec.facing || 0;
        //this.stopAtTarget = spec.hasOwnProperty('stopAtTarget') ? spec.stopAtTarget : true;
        //this.factor = 0;
        this.sfx = spec.sfx;
        // -- setup event handlers
        //this.onTock = this.onTock.bind(this);
    }
    destroy() {
        super.destroy();
        // setup listener for game clock
        //Events.ignore(Game.evtTock, this.onTock);
        if (this.sfx) this.sfx.destroy();
    }

    *run() {
    }

}