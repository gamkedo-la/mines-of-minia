export { AiEnergizeDirective };

import { AiDirective } from './aiDirective.js';

class AiEnergizeDirective extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        // -- energize for X rounds
        this.rounds = spec.rounds || 2;
        this.elapsed = 0;
    }

    *run() {
        this.reset();
        // iterate until directive is done
        while (!this.done) {
            // check for alignment
            let ai = this.lvl.ifromidx(this.actor.idx);
            let aj = this.lvl.jfromidx(this.actor.idx);
            let ti = this.lvl.ifromidx(this.target.idx);
            let tj = this.lvl.jfromidx(this.target.idx);
            console.log(`a: ${ai},${aj} t: ${ti},${tj}`);
            if (ai !== ti && aj !== tj) {
                this.ok = false;
                this.done = true;
                return null;
            }
            // check for end state
            this.elapsed++;
            if (this.elapsed >= this.rounds) {
                this.done = true;
                return null;
            }
            
            // nothing to do while waiting...
            yield null;

        }
    }

}