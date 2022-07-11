export { Reactor };

    import { Fmt } from '../base/fmt.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Item } from './item.js';

class Reactor extends Item {
    static slot = 'reactor';
    static dfltTier = 1;
    static dfltLvl = 1;
    static dfltPowerPerAP = .1;
    static dfltHealthPerAP = .1;
    static dfltFuelPerAP = .1;

    cpost(spec) {
        super.cpost(spec);
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.dfltLvl;
        this.identified = spec.hasOwnProperty('identified') ? spec.identified : false;
        this.powerPerAP = spec.powerPerAP || this.dfltPowerPerAP;
        this.healthPerAP = spec.healthPerAP || this.dfltHealthPerAP;
        this.fuelPerAP = spec.fuelPerAP || this.dfltFuelPerAP;
        // FIXME: scaling for level
        // event handlers
        this.onEquip = this.onEquip.bind(this);
        this.onUnequip = this.onUnequip.bind(this);
        this.evt.listen(this.constructor.evtEquipped, this.onEquip);
        this.evt.listen(this.constructor.evtUnequipped, this.onUnequip);

    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            tier: this.tier,
            lvl: this.lvl,
            identified: this.identified,
            powerPerAP: this.powerPerAP,
            healthPerAP: this.healthPerAP,
            fuelPerAP: this.fuelPerAP,
        });
    }

    onEquip(evt) {
        console.log(`${this} onEquip: ${Fmt.ofmt(evt)}`);
        let player = evt.actor;
        if (!player) return;
        // adjust player stats
        let update = {};
        if (this.powerPerAP) update.powerPerAP = player.powerPerAP + this.powerPerAP;
        if (this.healthPerAP) update.healthPerAP = player.healthPerAP + this.healthPerAP;
        if (this.fuelPerAP) update.fuelPerAP = player.fuelPerAP + this.fuelPerAP;
        UpdateSystem.eUpdate(player, update);
    }

    onUnequip(evt) {
        console.log(`${this} onUnequip: ${Fmt.ofmt(evt)}`);
        let player = evt.actor;
        if (!player) return;
        // adjust player stats
        let update = {};
        if (this.powerPerAP) update.powerPerAP = player.powerPerAP - this.powerPerAP;
        if (this.healthPerAP) update.healthPerAP = player.healthPerAP - this.healthPerAP;
        if (this.fuelPerAP) update.fuelPerAP = player.fuelPerAP - this.fuelPerAP;
        UpdateSystem.eUpdate(player, update);
    }

}