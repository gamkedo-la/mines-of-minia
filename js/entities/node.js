export { Node };

import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { Item } from './item.js';

class Node extends Item {

    static useOnPickup = true;
    static dfltKind = 'health';
    static dfltCount = 3;
    static kinds = [
        'health',
        'power',
        'fuel',
    ];

    static xspec(spec={}) {
        let kind = spec.kind || this.dfltKind;
        // final spec
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get(`node.${kind}`),
        }, spec);
    }

    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
        this.count = spec.count || this.constructor.dfltCount;
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            kind: this.kind,
            count: this.count,
        });
    }

    use(actor) {
        switch (this.kind) {
            case 'health': {
                let health = Math.min(actor.healthMax, actor.health+this.count);
                if (health !== actor.health) {
                    UpdateSystem.eUpdate(actor, {health: health});
                }
                Events.trigger(OverlaySystem.evtNotify, {which: 'popup.green', actor: actor, msg: `+${this.count}`});
                break;
            }

            case 'power': {
                let power = Math.min(actor.powerMax, actor.power+this.count);
                if (power !== actor.power) {
                    UpdateSystem.eUpdate(actor, {power: power});
                }
                Events.trigger(OverlaySystem.evtNotify, {which: 'popup.white', actor: actor, msg: `+${this.count} pow`});
                break;
            }

            case 'fuel': {
                let fuel = Math.min(actor.fuelMax, actor.fuel+this.count);
                if (fuel !== actor.fuel) {
                    UpdateSystem.eUpdate(actor, {fuel: fuel});
                }
                Events.trigger(OverlaySystem.evtNotify, {which: 'popup.white', actor: actor, msg: `+${this.count} fuel`});
                break;
            }

        }
    }

}