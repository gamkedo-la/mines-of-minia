export { Player };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { InventoryData } from '../inventory.js';
import { Character } from './character.js';
import { Weapon } from './weapon.js';


// =========================================================================
class Player extends Character {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltBrawn = 10;
    static dfltSpry = 10;
    static dfltSavvy = 10;
    static dfltBlockRating = 1;
    static dfltInvSlots = 16;
    static dfltFuelMax = 50;
    static dfltPowerMax = 20;
    static dfltScanRange = 48;
    // FIXME
    static dfltCritPct = .15;
    // FIXME: need to do some number crunching and trial runs here to see if these levels make sense
    static xpReqsByLvl = {
        1: 10,
        2: 40,
        3: 80,
        4: 130,
        5: 200,
        6: 300,
        7: 500,
        8: 1000,
        9: 2000,
        9: 4000,
        10: 7000,
        11: 11000,
        12: 15000,
        13: 21000,
        14: 30000,
        15: 40000,
        16: 60000,
        17: 100000,
        18: 200000,
        19: 400000,
        20: 800000,
        21: 1000000,
    }
    static attUpdatesByLvl = {
        2: {
            healthMax: 10,
        },
        3: {
            healthMax: 10,
        },
    }

    static dfltWeapon = new Weapon({
        tag: 'weapon.fists',
        kind: 'bonk',
        baseDamageMin: 4,
        baseDamageMax: 8,
    });

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.weaponxps = spec.weaponxps || {};
        this.brawn = spec.brawn || this.constructor.dfltBrawn;
        this.spry = spec.spry || this.constructor.dfltSpry;
        this.savvy = spec.savvy || this.constructor.dfltSavvy;
        // -- fuel
        this.fuelMax = spec.fuelMax || this.constructor.dfltFuelMax;
        this.fuel = spec.fuel || this.fuelMax;
        //this.fuelPerAP = spec.fuelPerAP || 0;
        // -- power
        this.powerMax = spec.powerMax || this.constructor.dfltPowerMax;
        this.power = spec.power || this.powerMax;
        //this.powerPerAP = spec.powerPerAP || 0;
        // -- xp gained
        this.xp = spec.xp || 0;
        // -- health regen
        //this.healthPerAP = spec.healthPerAP || 0;
        // -- hit bonus/penalty
        this.hitbp = spec.hitbp || 0;
        //this.weapon = spec.weapon || this.constructor.dfltWeapon;
        this.inventory = spec.inventory || new InventoryData();
        this.inventory.actor = this;
        this.blockRating = spec.blockRating || this.dfltBlockRating;
        // -- scan distance for detecting secrets/traps
        this.scanRange = spec.scanRange || this.constructor.dfltScanRange;
        // -- sfx
        this.moveSfx = spec.moveSfx || Assets.get('player.step', true);
        this.damagedSfx = spec.damagedSfx || Assets.get('player.damaged', true);
        // -- xform tweaks
        this.xform.offx = -this.xform.width*.5;
        this.xform.offy = Config.tileSize*.5 - this.xform.height;
        this.xform.stretchx = false;
        this.xform.stretchy = false;
        //this.dbg = { xform: true };
    }

    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            weaponxps: this.weaponxps,
            brawn: this.brawn,
            spry: this.spry,
            savvy: this.savvy,
            fuelMax: this.fuelMax,
            fuel: this.fuel,
            powerMax: this.powerMax,
            power: this.power,
            xp: this.xp,
            hitbp: this.hitbp,
            blockRating: this.blockRating,
            scanDistance: this.scanDistance,
            x_inventory: this.inventory.as_kv(),
        });
    }

    // PROPERTIES ----------------------------------------------------------
    // -- properties from equipment
    get powerPerAP() {
        return (this.inventory && this.inventory.reactor) ? this.inventory.reactor.powerPerAP : 0;
    }
    get fuelPerAP() {
        return (this.inventory && this.inventory.reactor) ? this.inventory.reactor.fuelPerAP : 0;
    }
    get healthPerAP() {
        return (this.inventory && this.inventory.reactor) ? this.inventory.reactor.healthPerAP : 0;
    }
    get damageReduction() {
        return (this.inventory && this.inventory.shielding) ? this.inventory.shielding.damageReduction : 0;
    }


}