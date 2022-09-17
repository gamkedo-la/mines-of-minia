export { ShieldCharm };

import { Charm } from './charm.js';

class ShieldCharm extends Charm {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'shielding charm';
        // shield has tagged shielding amounts
        this.amounts = spec.amounts || {dflt: 1};
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
        let keys = Object.keys(this.amounts);
        // iterate through shield amounts
        for (let i=keys.length-1; damage>0 && i>=0; i--) {
            let key = keys[i];
            let amount = this.amounts[key];
            if (damage >= amount) {
                damage -= amount;
                console.log(`shield ${key} absorbed ${amount} of damage and is depleted`);
                delete this.amounts[key];
            } else {
                console.log(`shield ${key} absorbed ${damage} of damage`);
                this.amounts[key] -= damage;
                damage = 0;
            }
        }
        // if damage is left, shield has been depleted
        if (damage) {
            console.log(`-- ${this} completely depleted and removed`);
            this.unlink();
        }
        // return remaining damage
        return damage;
    }

    replenish(tag, amount) {
        this.amounts[tag] = amount;
    }

}