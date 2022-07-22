export { ThrowToAction, ThrowAction };

import { Action } from '../base/actions/action.js';
import { MoveAction } from '../base/actions/move.js';
import { PlaySfxAction } from '../base/actions/playSfx.js';
import { SerialAction } from '../base/actions/serialAction.js';
import { Assets } from '../base/assets.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { DropAction } from './drop.js';

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
        this.throwsfx = spec.throwsfx || this.constructor.dfltThrowSfx;
        this.hitsfx = spec.hitsfx || this.constructor.dfltHitSfx;
    }

    setup() {
        if (this.dbg) console.log(`starting ${this} action w ttl: ${this.ttl}`);
        console.log(`throw item: ${this.item}`);
        // actor first "drops" item
        this.subs.push( new DropAction({
            item: this.item,
            sfx: this.throwsfx,
        }));

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

    }

}