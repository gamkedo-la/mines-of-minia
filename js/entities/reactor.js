export { Reactor };

import { Item } from './item.js';

class Reactor extends Item {
    static slot = 'reactor';
    static dfltTier = 1;
    static dfltLvl = 1;
    static dfltMaxFuel = 50;
    static dfltPowerPerAP = .1;
    static dfltHealthPerAP = .1;
    static dfltFuelPerAP = .1;

    cpost(spec) {
        super.cpost(spec);
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.dfltLvl;
        this.identified = spec.hasOwnProperty('identified') ? spec.identified : false;
        this.maxFuel = spec.maxFuel || this.constructor.dfltMaxFuel;
        this.fuel = spec.fuel || this.maxFuel;
        this.powerPerAP = spec.powerPerAP || this.dfltPowerPerAP;
        this.healthPerAP = spec.healthPerAP || this.dfltHealthPerAP;
        this.fuelPerAP = spec.fuelPerAP || this.dfltFuelPerAP;
        // FIXME: scaling for level
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            tier: this.tier,
            lvl: this.lvl,
            identified: this.identified,
            maxFuel: this.maxFuel,
            fuel: this.fuel,
            powerPerAP: this.powerPerAP,
            healthPerAP: this.healthPerAP,
            fuelPerAP: this.fuelPerAP,
        });
    }

}