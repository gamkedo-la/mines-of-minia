export { Gadget };

import { Assets } from '../base/assets.js';
import { Item } from './item.js';

class Gadget extends Item {
    static slot = 'gadget';
    static dfltTier = 1;

    static xspec(spec={}) {
        let tier = spec.tier || this.dfltTier;
        // final spec
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get(`gadget.${tier}`),
        }, spec);
    }

    cpost(spec) {
        super.cpost(spec);
        this.tier = spec.tier || this.constructor.dfltTier;
        // event handlers
        this.onEquip = this.onEquip.bind(this);
        this.onUnequip = this.onUnequip.bind(this);
        this.evt.listen(this.constructor.evtEquipped, this.onEquip);
        this.evt.listen(this.constructor.evtUnequipped, this.onUnequip);
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            tier: this.tier,
        });
    }

    // PROPERTIES ----------------------------------------------------------
    get description() {
        let d = `a *tier ${this.tier}* gadget providing charms to your bot. `
        if (this.identifiable) {
            d += `the provided *charms* are unknown. `
            d += `...identify to determine exact stats...`
        } else {
            if (this.charms) d += `\n -- charms --\n`;
            // append charm descriptions
            for (const charm of this.charms) {
                d += charm.description + '\n';
            }
        }
        return d;
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEquip(evt) {
        console.log(`${this} onEquip: ${Fmt.ofmt(evt)}`);
        let player = evt.actor;
        if (!player) return;
        // set target
        this.target = player;
        // apply charms
        for (const charm of this.charms) {
            charm.link(player);
        }
    }

    onUnequip(evt) {
        console.log(`${this} onUnequip: ${Fmt.ofmt(evt)}`);
        let player = evt.actor;
        if (!player) return;
        // clear target
        this.target = null;
        // remove charms
        for (const charm of this.charms) {
            charm.unlink(player);
        }
    }

}