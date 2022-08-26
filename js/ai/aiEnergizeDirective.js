export { AiEnergizeDirective };

import { AiDirective } from './aiDirective.js';

class AiEnergizeDirective extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        // -- energize for X rounds
        this.rounds = spec.rounds || 1;
        this.elapsed = 0;
    }

    reset() {
        super.reset();
        this.elapsed = 0;
    }

    *run() {
        this.reset();
        // iterate until directive is done
        console.log(`-- start energizing`);
        while (!this.done) {
            // check for alignment
            let ai = this.lvl.ifromidx(this.actor.idx);
            let aj = this.lvl.jfromidx(this.actor.idx);
            let ti = this.lvl.ifromidx(this.target.idx);
            let tj = this.lvl.jfromidx(this.target.idx);
            if (ai !== ti && aj !== tj) {
                console.log(`-- energizing failed, out of alignment`);
                this.ok = false;
                this.done = true;
                return null;
            }
            // check for end state
            this.elapsed++;
            if (this.elapsed > this.rounds) {
                console.log(`-- energizing done`);
                this.done = true;
                return null;
            }
            
            // nothing to do while waiting...
            console.log(`-- energized elapsed: ${this.elapsed}`);
            yield null;

        }
    }

}