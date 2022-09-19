export { DarknessCharm };

    import { Fmt } from '../base/fmt.js';
import { Charm } from './charm.js';

class DarknessCharm extends Charm {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'darkness charm';
        this.lvl = spec.lvl || 1;
        this.resistance = this.lvl/10;
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            lvl: this.lvl,
        });
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        super.link(actor);
        if (!actor.resistances) return;
        if (!actor.resistances.dark) {
            actor.resistances.dark = this.resistance;
        } else {
            actor.resistances.dark += this.resistance;
        }
        console.log(`resistances: ${Fmt.ofmt(actor.resistances)}`);
    }

    unlink() {
        let actor = this.actor;
        super.unlink();
        actor.resistances.dark -= this.resistance;
    }

}