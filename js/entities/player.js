export { Player };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Fmt } from '../base/fmt.js';
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
    static dfltCritPct = .15;
    static xpReqsByLvl = {
        1: 50,
        2: 120,
        3: 210,
        4: 340,
        5: 420,
        6: 600,
        7: 750,
        8: 900,
        9: 1050,
        10: 1200,
        11: 1450,
        12: 1700,
        13: 2000,
        14: 2300,
        15: 2600,
        16: 2900,
        17: 3300,
        18: 3700,
        19: 4050,
        20: 4400,
        21: 5000,
    }
    static attUpdatesByLvl = {
        2: { healthMax: 10 },
        3: { healthMax: 10 },
        4: { healthMax: 10 },
        5: { healthMax: 10, powerMax: 5 },
        6: { healthMax: 10 },
        7: { healthMax: 10 },
        8: { healthMax: 10 },
        9: { healthMax: 10 },
        10: { healthMax: 10, powerMax: 5 },
        11: { healthMax: 10 },
        12: { healthMax: 10 },
        13: { healthMax: 10 },
        14: { healthMax: 10 },
        15: { healthMax: 10, powerMax: 5 },
        16: { healthMax: 10 },
        17: { healthMax: 10 },
        18: { healthMax: 10 },
        19: { healthMax: 10 },
        20: { healthMax: 10, powerMax: 5 },
        21: { healthMax: 10 },
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
        this.onEquipChanged = this.onEquipChanged.bind(this);
        this.inventory.evt.listen(this.inventory.constructor.evtEquipChanged, this.onEquipChanged);
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
            scanRange: this.scanRange,
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

    onEquipChanged(evt) {
        if (evt.slot === 'shielding') {
            // lookup player sketch for shielding tier
            let tag;
            if (!evt.target) {
                tag = 'player';
            } else {
                tag = `player.s${evt.target.tier}`;
            }
            if (this.sketch.tag !== tag) {
                let sketch = Assets.get(tag, true);
                this.sketch = sketch;
            }
        } else if (evt.slot === 'weapon') {
            //console.log(`equipped weapon: ${Fmt.ofmt(evt)}`);
            // swap sfx based on weapon
            if (evt.target) {
                this.meleeHitSfx = Assets.get(`${evt.target.kind}.hit`, true);
                this.meleeMissSfx = Assets.get(`${evt.target.kind}.miss`, true);
            } else {
                this.meleeHitSfx = null;
                this.meleeMissSfx = null;
            }
        } 
    }


}