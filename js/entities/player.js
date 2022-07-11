export { Player };

import { Config } from '../base/config.js';
import { InventoryData } from '../inventory.js';
import { Character } from './character.js';
import { Weapon } from './weapon.js';

class Player extends Character {
    static dfltBrawn = 10;
    static dfltSpry = 10;
    static dfltSavvy = 10;
    static dfltBlockRating = 1;
    static dfltInvSlots = 16;

    static dfltWeapon = new Weapon({
        tag: 'weapon.fists',
        kind: 'bonk',
        baseDamageMin: 4,
        baseDamageMax: 8,
    });

    cpost(spec) {
        super.cpost(spec);
        this.weaponProficiencies = spec.weaponProficiencies || {};
        this.brawn = spec.brawn || this.constructor.dfltBrawn;
        this.spry = spec.spry || this.constructor.dfltSpry;
        this.savvy = spec.savvy || this.constructor.dfltSavvy;
        // FIXME: should come from reactor...
        this.healthRegenPerAP = .2;
        this.fuel = 10;
        this.fuelPerAP = .5;
        // -- hit bonus/penalty
        this.hitbp = spec.hitbp || 0;
        this.weapon = spec.weapon || this.constructor.dfltWeapon;
        this.inventory = spec.inventory || new InventoryData();
        this.blockRating = spec.blockRating || this.dfltBlockRating;
        this.xform.offx = this.xf
        this.xform.offx = -this.xform.width*.5;
        this.xform.offy = Config.tileSize*.5 - this.xform.height;
        this.xform.origy = .75;
        //this.dbg = { xform: true };
    }

}