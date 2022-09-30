export { Fuelcell };

import { Fmt } from '../base/fmt.js';
import { Item } from './item.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Events } from '../base/event.js';
import { OverlaySystem } from '../systems/overlaySystem.js';

class Fuelcell extends Item {
    static slot = 'item';
    static stackable = true;
    static dfltFuel = 25;
    static usable = true;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.fuel = spec.fuel || this.constructor.dfltFuel;
    }
    
    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            description: `a portable fuel source, restores *25* fuel when used`,
            fuel: this.fuel,
        });
    }

    use(actor, target=null) {
        let fuel = Math.min(actor.fuelMax, actor.fuel+this.fuel);
        if (fuel !== actor.fuel) {
            Events.trigger(OverlaySystem.evtNotify, {which: 'info', msg: `+${fuel-actor.fuel} fuel`});
            UpdateSystem.eUpdate(actor, {fuel: fuel });
        }
        // trigger used event
        this.evt.trigger(this.constructor.evtUse, {actor: this})
    }

}