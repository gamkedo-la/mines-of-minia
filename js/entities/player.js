export { Player };
import { Character } from './character.js';
import { Weapon } from './weapon.js';

class Player extends Character {
    static dfltBrawn = 10;
    static dfltSpry = 10;
    static dfltSavvy = 10;
    static dfltBlockRating = 1;

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
        // -- hit bonus/penalty
        this.hitbp = spec.hitbp || 0;
        this.weapon = spec.weapon || this.constructor.dfltWeapon;
        this.blockRating = spec.blockRating || this.dfltBlockRating;
    }

}