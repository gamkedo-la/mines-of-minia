export { PoisonCharm };

import { Fmt } from '../base/fmt.js';
import { Random } from '../base/random.js';
import { Dice } from '../dice.js';
import { Charm } from './charm.js';
import { PoisonedCharm } from './poisoned.js';

class PoisonCharm extends Charm {
    static dfltPct = .25;

    constructor(spec={}) {
        super(spec);
        this.description = `a charm that has a chance to apply poison to target`;
        this.pct = spec.pct || this.constructor.dfltPct;
        // -- events
        this.onAttacked = this.onAttacked.bind(this);
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            pct: this.pct,
        });
    }

    link(actor) {
        super.link(actor);
        this.actor.evt.listen(this.actor.constructor.evtAttacked, this.onAttacked);
    }

    unlink() {
        super.unlink();
        if (this.actor) this.actor.evt.ignore(this.actor.constructor.evtAttacked, this.onAttacked);
    }

    onAttacked(evt) {
        if (!evt.target) return;
        let target = evt.target;
        console.log(`${this} onAttacked: ${Fmt.ofmt(evt)}`);
        // roll for poison
        if (Random.flip(this.pct)) {
            // target already poisoned?
            if (PoisonedCharm.applied(target)) {
                console.log(`extend poisoned to ${target}`);
                let charm = target.charms.find((v) => v.cls === 'PoisonedCharm');
                charm.elapsed = 0;
            } else {
                console.log(`apply poisoned to ${target}`);
                let charm = new PoisonedCharm();
                target.addCharm(charm);
            }
        }
    }

}