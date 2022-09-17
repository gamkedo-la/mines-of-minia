export { ShieldCharm };

import { Charm } from './charm.js';

class ShieldCharm extends Charm {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'damage charm';
        this.damage = this.damage || 1;
    }
    destroy() {
        this.unlink();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            damage: this.damage,
        });
    }

    // METHODS -------------------------------------------------------------
    applyDamage(damage) {
        if (damage >= this.damage) {
            console.log(`-- ${this} removed`);
            this.unlink();
            return damage-this.damage;
        }
        this.damage -= damage;
        return 0;
    }

    onActorUpdate(evt) {
        // auto remove charm if player health drops below full
        if (evt.update && evt.update.health) {
            if (evt.actor.health !== evt.actor.healthMax) {
                //console.log(`${this} player health dropped from max, removing charm`);
                this.unlink();
            }
        }
    }


}