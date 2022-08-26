export { GeneratorAction };

import { Events } from '../event.js';
import { Fmt } from '../fmt.js';
import { Action } from './action.js';

class GeneratorAction extends Action {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.currentSub;
        this.onSubDone = this.onSubDone.bind(this);
    }
    destroy() {
        if (!this.done) this.ok = false;
        if (this.currentSub) this.currentSub.destroy();
    }

    start(actor) {
        //console.log(`start generator action`);
        this.actor = actor;
        this.evt.trigger(this.constructor.evtStarted, {actor: this.actor, action: this});
        // action specific setup
        //console.log(`calling action specific setup..`)
        this.setup();
        //console.log(`after action specific setup..`)
        // instantiate generator
        this.generator = this.run();

        // start first subaction
        let gv = this.generator.next();
        //console.log(`first gv: ${Fmt.ofmt(gv)}`);
        if (gv.value) {
            this.currentSub = gv.value;
            this.currentSub.evt.listen(this.currentSub.constructor.evtDone, this.onSubDone, Events.once);
            this.currentSub.start(actor);
        }

        // finish if we don't have to wait
        if (gv.done && (!this.currentSub || (this.currentSub && this.currentSub.done))) this.finish();
    }

    *run() {
        return null;
    }

    onSubDone(evt) {
        // start next subaction
        this.currentSub = null;
        let gv = this.generator.next();
        //console.log(`next gv: ${Fmt.ofmt(gv)}`);
        if (gv.value) {
            this.currentSub = gv.value;
            this.currentSub.evt.listen(this.currentSub.constructor.evtDone, this.onSubDone, Events.once);
            this.currentSub.start(this.actor);
        }
        // check for completion
        if (gv.done && (!this.currentSub || (this.currentSub && this.currentSub.done))) this.finish();
    }

}