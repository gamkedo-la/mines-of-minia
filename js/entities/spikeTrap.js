export { SpikeTrap };

import { Attack } from '../actions/attack.js';
import { Assets } from '../base/assets.js';
import { Trap } from './trap.js';


class SpikeTrap extends Trap {
    static dfltAttackKind = 'poke';
    static dfltDamage = 5;

    cpost(spec) {
        super.cpost(spec);
        this.attackKind = spec.attackKind || this.constructor.fltAttackKind;
        this.damageMin = spec.damageMin || this.constructor.dfltDamage;
        this.damageMax = spec.damageMax || this.constructor.dfltDamage;
    }

    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            attackKind: this.attackKind,
            damageMin: this.damageMin,
            damageMax: this.damageMax,
        });
    }

    trigger(actor) {
        super.trigger(actor);
        // apply damage
        // -- calculate damage to apply
        if (actor.health) {
            let damage = Attack.damage(this, actor);
            if (damage > 0) {
                console.log(`${this} applying ${damage} damage to ${actor}`);
                actor.evt.trigger(actor.constructor.evtDamaged, { actor: this, target: actor, damage: damage });
            }
        }
    }

}