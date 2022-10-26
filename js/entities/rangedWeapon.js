export { RangedWeapon };

import { Assets } from '../base/assets.js';
import { Item } from './item.js';

class RangedWeapon extends Item {
    static slot = 'belt';
    static usable = true;
    static shootable = true;

    static kinds = [
        'fire',
        'ice',
        'shock',
        'dark',
    ];
    static dfltKind = 'fire';
    static dfltBaseDamageMin = 1;
    static dfltBaseDamageMax = 2;
    static dfltSavvy = 10;
    static dfltPower = 5;
    static damageScaleByTier = {
        1: 1.5,
        2: 2,
        3: 2.5,
    };

    static xspec(spec={}) {
        let kind = spec.kind || this.dfltKind;
        let tier = spec.tier || this.dfltTier;
        // final spec
        console.log(`${kind}.gun.${tier}`);
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get(`${kind}.gun.${tier}`),
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
        this.lvl = spec.lvl || 1;
        this.tier = spec.tier || 1;
        // -- required savvy
        this.savvy = spec.savvy || this.constructor.dfltSavvy;
        // -- damage
        this.damageScale = spec.damageScale || this.constructor.damageScaleByTier[this.tier];
        this.baseDamageMin = spec.baseDamageMin || this.constructor.dfltBaseDamageMin;
        this.baseDamageMax = spec.baseDamageMax || this.constructor.dfltBaseDamageMax;
        // -- power requirements
        this.power = spec.power || this.constructor.dfltPower;
        // -- projectile
        this.projectileSpec = spec.projectileSpec;
    }

    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            kind: this.kind,
            lvl: this.lvl,
            tier: this.tier,
            savvy: this.savvy,
            damageScale: this.damageScale,
            baseDamageMin: this.baseDamageMin,
            baseDamageMax: this.baseDamageMax,
            power: this.power,
            projectileSpec: this.projectileSpec,
        });
    }

    // PROPERTIES ----------------------------------------------------------
    get damageMin() {
        return Math.round(this.baseDamageMin*this.lvl*(this.damageScale-1));
    }
    get damageMax() {
        return Math.round(this.baseDamageMax*this.lvl*(this.damageScale-1));
    }

}