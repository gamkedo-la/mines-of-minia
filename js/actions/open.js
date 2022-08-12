export { OpenAction, DoOpenAction };

import { SerialAction } from '../base/actions/serialAction.js';
import { MoveAction } from '../base/actions/move.js';
import { Action } from '../base/actions/action.js';
import { Mathf } from '../base/math.js';
import { Timer } from '../base/timer.js';
import { Direction } from '../base/dir.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { Events } from '../base/event.js';
import { Assets } from '../base/assets.js';


class DoOpenAction extends Action {
    static dfltTTL = 100;
    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        if (this.target.cls === 'Chest') {
            this.sfx = Assets.get('chest.open', true);
        }
        this.failedSfx = spec.failedSfx || Assets.get('action.failed', true);
        this.unlocked = true;
        this.onTimer = this.onTimer.bind(this);
    }

    onTimer(evt) {
        // update target to open state
        if (this.unlocked) this.target.open(this.actor);
        this.finish();
    }

    setup() {
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
        // check for locked state, and required keys...
        if (this.target.locked) {
            // what key is required?
            let kind = this.target.kind;
            if (!this.actor.inventory || !this.actor.inventory.hasKey(kind)) {
                this.unlocked = false;
                Events.trigger(OverlaySystem.evtNotify, { actor: this.player, which: 'warn', msg: `need ${kind} key to unlock` });
                if (this.failedSfx) this.failedSfx.play();
            }
        }
        // start open sound if unlocked
        if (this.unlocked && this.sfx) {
            this.sfx.play();
        }
    }
}

class OpenAction extends SerialAction {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltPoints = 1;
    static dfltTTL = 300;
    static dfltNudge = 8;
    static dfltNudgeSpeed = .2;
    static dfltNudgeAccel = .2;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec) {
        super(spec);
        this.target = spec.target;
        this.nudge = spec.nudge || this.constructor.dfltNudge;
        this.nudgeSpeed = spec.nudgeSpeed || this.constructor.dfltNudgeSpeed;
        this.nudgeAccel = spec.nudgeAccel || this.constructor.dfltNudgeAccel;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
    }

    destroy() {
        if (!this.done) this.ok = false;
        if (this.timer) this.timer.destroy();
        if (this.nudgeTowards) this.nudgeTowards.destroy();
        if (this.nudgeBack) this.nudgeBack.destroy();
    }

    // METHODS -------------------------------------------------------------
    setup() {
        if (this.dbg) console.log(`starting ${this} action w ttl: ${this.ttl}`);
        // -- nudge towards target
        if (this.nudge) {
            let angle = Mathf.angle(this.actor.xform.x, this.actor.xform.y, this.target.xform.x, this.target.xform.y, true);
            let x = Math.round(this.actor.xform.x + Math.cos(angle) * this.nudge);
            let y = Math.round(this.actor.xform.y + Math.sin(angle) * this.nudge);
            let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
            this.subs.push( new MoveAction({
                x: x,
                y: y,
                speed: this.nudgeSpeed,
                accel: this.nudgeAccel,
                range: 2,
                stopAtTarget: true,
                snap: true,
                facing: facing,
            }));
        }
        this.subs.push( new DoOpenAction({
            target: this.target,
            ttl: this.ttl,
        }));

        if (this.nudge) {
            this.subs.push( new MoveAction({
                x: this.actor.xform.x,
                y: this.actor.xform.y,
                speed: this.nudgeSpeed,
                accel: this.nudgeAccel,
                range: 2,
                stopAtTarget: true,
                snap: true,
            }));
        }
    }


}