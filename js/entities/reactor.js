export { Reactor };

import { Assets } from '../base/assets.js';
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
    static dfltAnimState = 'free';

    static getFuelRating(perap) {
        if (perap <= .05) return 'low';
        if (perap <= .1) return 'medium';
        return 'high';
    }

    static getHealthRating(perap) {
        if (perap <= .05) return 'low';
        if (perap <= .1) return 'medium';
        return 'high';
    }

    static getPowerRating(perap) {
        if (perap <= .05) return 'low';
        if (perap <= .1) return 'medium';
        return 'high';
    }

    static xspec(spec={}) {
        let tier = spec.tier || this.dfltTier;
        // final spec
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get(`reactor.${tier}`),
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.tier = spec.tier || this.constructor.dfltTier;
        this.lvl = spec.lvl || this.constructor.dfltLvl;
        this._powerPerAP = spec.powerPerAP || this.constructor.dfltPowerPerAP;
        this.powerScale = spec.powerScale || 1;
        this._healthPerAP = spec.healthPerAP || this.constructor.dfltHealthPerAP;
        this.healthScale = spec.healthScale || 1;
        this._fuelPerAP = spec.fuelPerAP || this.constructor.dfltFuelPerAP;
        this.fuelScale = spec.fuelScale || 1;
        this.animState = spec.animState || this.constructor.dfltAnimState;
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
            powerPerAP: this._powerPerAP,
            powerScale: this.powerScale,
            healthPerAP: this._healthPerAP,
            healthScale: this.healthScale,
            fuelPerAP: this._fuelPerAP,
            fuelScale: this.fuelScale,
        });
    }

    // PROPERTIES ----------------------------------------------------------
    get fuelPerAP() {
        return this._fuelPerAP * Math.pow(this.fuelScale, this.lvl);
    }
    get powerPerAP() {
        return this._powerPerAP * Math.pow(this.powerScale, this.lvl);
    }
    get healthPerAP() {
        return this._healthPerAP * Math.pow(this.healthScale, this.lvl);
    }

    get description() {
        let d = `a *tier ${this.tier}* reactor core providing power to your bot. `
        if (this.identifiable) {
            d += `this reactor provides a *${this.constructor.getHealthRating(this.healthPerAP)}* health regen rating and a *${this.constructor.getPowerRating(this.powerPerAP)}* power regen rate `
            d += `and consumes fuel at a *${this.constructor.getFuelRating(this.fuelPerAP)}* rate. `
            d += `it has a *level* but you're not sure what it is. `
            d += `it may or may not have a *charm* applied. `
            d += `...identify to determine exact stats...`
        } else {
            d += `this reactor has a *${Math.round(this.healthPerAP*100)}* health regen rating and a *${Math.round(this.powerPerAP*100)}* power regen rating `
            d += `and consumes fuel at a rating of *${Math.round(1/this.fuelPerAP)}*. `
            d += `it is a level *${this.lvl}* reactor. `
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
        // adjust player stats
        let update = {};
        if (this.powerPerAP) update.powerPerAP = player.powerPerAP + this.powerPerAP;
        if (this.healthPerAP) update.healthPerAP = player.healthPerAP + this.healthPerAP;
        if (this.fuelPerAP) update.fuelPerAP = player.fuelPerAP + this.fuelPerAP;
        UpdateSystem.eUpdate(player, update);
        console.log(`update: ${Fmt.ofmt(update)}`);
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