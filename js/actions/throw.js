export { ThrowToAction, ThrowAction };

import { Action } from '../base/actions/action.js';
import { ApplyAction } from '../base/actions/apply.js';
import { DestroyAction } from '../base/actions/destroy.js';
import { MoveAction } from '../base/actions/move.js';
import { PlaySfxAction } from '../base/actions/playSfx.js';
import { SerialAction } from '../base/actions/serialAction.js';
import { Assets } from '../base/assets.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { BreakAction } from './break.js';
import { DropAction } from './drop.js';
import { DoInteractAction } from './interact.js';

class ThrowToAction extends Action {
    static dfltSpeed = .15;
    static dfltAccel = 0;
    static _dfltThrowSfx;
    static get dfltThrowSfx() {
        if (!this._dfltThrowSfx) this._dfltThrowSfx = Assets.get('item.throw', true);
        return this._dfltThrowSfx;
    }
    static _dfltHitSfx;
    static get dfltHitSfx() {
        if (!this._dfltHitSfx) this._dfltHitSfx = Assets.get('item.throwHit', true);
        return this._dfltHitSfx;
    }

    constructor(spec={}) {
        super(spec);
        this.item = spec.item;
        this.idx = spec.idx;
        this.x = spec.x;
        this.y = spec.y;
        this.speed = spec.speed || this.constructor.dfltSpeed;
        this.accel = spec.accel || this.constructor.dfltAccel;
        this.onMoveDone = this.onMoveDone.bind(this);
        this.throwsfx = spec.hasOwnProperty('throwsfx') ? spec.throwsfx : this.constructor.dfltThrowSfx;
        this.hitsfx = spec.hasOwnProperty('hitsfx') ? spec.hitsfx : this.constructor.dfltHitSfx;
    }

    setup() {
        // move item to target
        let action = new MoveAction({
            x: this.x,
            y: this.y,
            speed: this.speed,
            accel: this.accel,
            range: 2,
            stopAtTarget: true,
            snap: true,
            update: { idx: this.idx},
        });
        if (this.throwfx) this.throwfx.play();
        action.evt.listen(action.constructor.evtDone, this.onMoveDone);
        ActionSystem.assign(this.item, action);
    }

    onMoveDone(evt) {
        if (this.dbg) console.log(`${this} is done`);
        if (this.hitsfx) this.hitsfx.play();
        this.finish();
    }
}

class ThrowAction extends SerialAction {
    static _dfltThrowSfx;
    static get dfltThrowSfx() {
        if (!this._dfltThrowSfx) this._dfltThrowSfx = Assets.get('item.throw', true);
        return this._dfltThrowSfx;
    }
    static _dfltHitSfx;
    static get dfltHitSfx() {
        if (!this._dfltHitSfx) this._dfltHitSfx = Assets.get('item.throwHit', true);
        return this._dfltHitSfx;
    }

    constructor(spec) {
        super(spec);
        this.item = spec.item;
        this.idx = spec.idx;
        this.x = spec.x;
        this.y = spec.y;
        this.lvl = spec.lvl;
        this.needsDrop = spec.hasOwnProperty('needsDrop') ? spec.needsDrop : true;
        this.needsDestroy = spec.hasOwnProperty('needsDestroy') ? spec.needsDestroy : true;
        this.throwsfx = spec.throwsfx || this.constructor.dfltThrowSfx;
        this.hitsfx = spec.hitsfx || this.constructor.dfltHitSfx;
        this.interactTarget = spec.interactTarget;
    }

    setup() {
        if (this.dbg) console.log(`starting ${this} action w ttl: ${this.ttl}`);
        // actor first "drops" item
        if (this.needsDrop) {
            this.subs.push( new DropAction({
                item: this.item,
                sfx: this.throwsfx,
            }));
        } else {
            if (this.throwsfx) {
                this.subs.push( new PlaySfxAction({
                    sfx: this.throwsfx,
                }));
            }
        }

        // move to target
        this.subs.push( new ThrowToAction({
            item: this.item,
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

        // if item is breakable... break upon impact
        if (this.item.constructor.breakable) {
            let target = this.lvl.firstidx(this.idx, (v) => v.health || v.constructor.triggerable);
            this.subs.push( new BreakAction({
                item: this.item,
                target: target,
                idx: this.idx,
            }));
        } else if (this.needsDestroy) {
            this.subs.push(new ApplyAction({
                target: this.item,
                action: new DestroyAction({}),
            }));
        }

        // if target is interactable
        if (this.interactTarget) {
            this.subs.push(new DoInteractAction({
                target: this.interactTarget,
            }))
        }

    }

}