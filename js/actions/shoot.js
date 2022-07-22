export { ShootAction };

import { DestroyTargetAction } from '../base/actions/destroy.js';
import { PlaySfxAction } from '../base/actions/playSfx.js';
import { SerialAction } from '../base/actions/serialAction.js';
import { ThrowToAction } from './throw.js';
import { RangeAttackRollAction } from './attack.js';
import { Projectile } from '../entities/projectile.js';
import { Assets } from '../base/assets.js';
import { XForm } from '../base/xform.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Generator } from '../base/generator.js';
import { Fmt } from '../base/fmt.js';
import { SpawnAction } from './spawn.js';


class ShootAction extends SerialAction {
    static _dfltShootSfx;
    static get dfltShootSfx() {
        if (!this._dfltShootSfx) this._dfltShootSfx = Assets.get('item.throw', true);
        return this._dfltShootSfx;
    }
    static _dfltHitSfx;
    static get dfltHitSfx() {
        if (!this._dfltHitSfx) this._dfltHitSfx = Assets.get('item.throwHit', true);
        return this._dfltHitSfx;
    }

    constructor(spec={}) {
        super(spec);
        this.weapon = spec.weapon;
        this.lvl = spec.lvl;
        this.idx = spec.idx;
        this.x = spec.x;
        this.y = spec.y;
        this.shootsfx = spec.shootsfx || this.constructor.dfltShootSfx;
        this.hitsfx = spec.hitsfx || this.constructor.dfltHitSfx;
        this.projectileSpec = (this.weapon && this.weapon.projectileSpec) ? this.weapon.projectileSpec : Projectile.xspec();
    }

    setup() {
        // -- consume power
        if (this.weapon.power && this.actor.power) {
            UpdateSystem.eUpdate(this.actor, {
                power: Math.max(0,this.actor.power-this.weapon.power),
            });
        }

        // -- spawn the particle
        let projectile = Generator.generate(this.projectileSpec);
        console.log(`shoot projectile: ${projectile} from ${Fmt.ofmt(this.projectileSpec)}`);
        this.subs.push(new SpawnAction({
            target: this.actor,
            spawn: projectile,
            sfx: this.shootsfx,
            z: 3,
        }));
        console.log(`projectile zed: ${projectile.z} xform: ${projectile.xform}`);

        // -- move to target
        this.subs.push( new ThrowToAction({
            item: projectile,
            x: this.x,
            y: this.y,
            idx: this.idx,
            throwsfx: null,
            hitsfx: this.hitsfx,
        }));

        // -- find targets at target idx, set attack action for each
        console.log(`lvl: ${this.lvl}`);
        for (const target of this.lvl.findidx(this.idx, (v) => v.health)) {
            this.subs.push( new RangeAttackRollAction({
                weapon: this.weapon,
                target: target,
            }));
        }
        // -- destroy projectile
        this.subs.push( new DestroyTargetAction({
            target: projectile,
        }));

    }

}