export { FieryCharm };

import { Fmt } from '../base/fmt.js';
import { Dice } from '../dice.js';
import { Charm } from './charm.js';

class FieryCharm extends Charm {
    static dfltDamageDice = '1d6';

    constructor(spec={}) {
        super(spec);
        this.damageDice = Dice.fromStr(spec.damageDice || this.constructor.dfltDamageDice);
        this.description = `a fiery charm that deals *${this.damageDice}* of fire damage per attack.`;
        // -- events
        this.onAttacked = this.onAttacked.bind(this);
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            damageDice: this.damageDice.toString(),
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
        console.log(`${this} onAttacked: ${Fmt.ofmt(evt)}`);
        // roll for damage
        let damage = this.damageDice.roll();
        let target = evt.target;
        console.log(`fiery damage to apply: ${damage} to ${target}`);
        target.evt.trigger(target.constructor.evtDamaged, { actor: this.actor, target: target, damage: damage });
    }

}