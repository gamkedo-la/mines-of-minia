export { ShootAction };

import { SerialAction } from '../base/actions/serialAction.js';
import { ThrowToAction } from './throw.js';
import { Projectile } from '../entities/projectile.js';
import { PlaySfxAction } from '../base/actions/playSfx.js';
import { Assets } from '../base/assets.js';
import { XForm } from '../base/xform.js';
import { DestroyTargetAction } from '../base/actions/destroy.js';

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
        this.idx = spec.idx;
        this.x = spec.x;
        this.y = spec.y;
        this.shootsfx = spec.shootsfx || this.constructor.dfltShootSfx;
        this.hitsfx = spec.hitsfx || this.constructor.dfltHitSfx;
    }

    setup() {
        // spawn the particle
        // FIXME
        let projectile = new Projectile({
            sketch: Assets.get('projectile.yellow', true),
            idx: this.actor.idx,
            z: 3,
            xform: new XForm({stretch: false, x: this.actor.xform.x, y: this.actor.xform.y}),
        })
        // -- emerge item to level
        projectile.evt.trigger(projectile.constructor.evtEmerged, {actor: projectile}, true);

        // play hit sound
        if (this.shootsfx) {
            this.subs.push( new PlaySfxAction({
                sfx: this.shootsfx,
            }));
        }

        // move to target
        this.subs.push( new ThrowToAction({
            item: projectile,
            x: this.x,
            y: this.y,
            idx: this.idx,
        }));

        // play hit sound
        if (this.hitsfx) {
            this.subs.push( new PlaySfxAction({
                sfx: this.hitsfx,
            }));
        }

        // destroy projectile
        this.subs.push( new DestroyTargetAction({
            target: projectile,
        }));

    }

}