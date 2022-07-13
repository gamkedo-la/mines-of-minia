export { Fuelcell };

import { Fmt } from '../base/fmt.js';
import { Item } from './item.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';

class Fuelcell extends Item {
    static slot = 'item';
    static stackable = true;
    static dfltFuel = 10;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.fuel = spec.fuel || this.constructor.dfltFuel;
        // -- bind events
        this.onUse = this.onUse.bind(this);
        this.evt.listen(this.constructor.evtUse, this.onUse);
    }
    
    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            kind: this.kind,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onUse(evt) {
        let fuel = Math.min(evt.actor.fuelMax, evt.actor.fuel+this.fuel);
        if (fuel !== evt.actor.fuel) {
            UpdateSystem.eUpdate(evt.actor, {fuel: fuel });
        }
    }

}