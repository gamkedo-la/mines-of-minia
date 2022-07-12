export { MoveAction };

import { Action } from './action.js';
import { Events } from '../event.js';
import { Fmt } from '../fmt.js';
import { Mathf } from '../math.js';
import { Game } from '../game.js';
import { UpdateSystem } from '../systems/updateSystem.js';

class MoveAction extends Action {
    static dfltRange = 5;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.range = spec.range || this.constructor.dfltRange;
        this.snap = spec.hasOwnProperty('snap') ? spec.snap : false;
        this.speed = spec.speed || 0;
        this.accel = spec.accel || 0;
        this.facing = spec.facing || 0;
        this.stopAtTarget = spec.hasOwnProperty('stopAtTarget') ? spec.stopAtTarget : true;
        this.factor = 0;
        this.sfx = spec.sfx;
        // -- setup event handlers
        this.onTock = this.onTock.bind(this);
    }
    destroy() {
        super.destroy();
        // setup listener for game clock
        Events.ignore(Game.evtTock, this.onTock);
        if (this.sfx) this.sfx.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTock(evt) {
        this.updateVelocity(evt);
    }

    // METHODS -------------------------------------------------------------
    setup() {
        if (!this.speed) this.speed = this.actor.maxSpeed;
        if (this.sfx) {
            this.sfx.play();
        }
        // setup listener for game clock
        Events.listen(Game.evtTock, this.onTock);
    }

    updateVelocity(evt) {
        // handle failed action
        if (!this.ok) {
            this.actor.speed = 0;
            this.destroy();
            return;
        }
        // calculate distance to target
        let distance = Mathf.distance(this.x, this.y, this.actor.xform.x, this.actor.xform.y);
        let factor = this.factor;
        let heading = this.actor.heading;
        // if not within range...
        if (distance > this.range) {
            if (this.accel) {
                // compute acceleration/deceleration
                let speed = factor * this.speed;
                let decelDistance = (speed * speed) / (2 * this.accel);
                //we are still far, continue accelerating (if possible)
                if (distance > decelDistance) {
                    factor = Math.min((speed + this.accel * evt.deltaTime)/this.speed, 1);
                //we are about to reach the target, let's start decelerating.
                } else {
                    factor = Math.max((speed - this.accel * evt.deltaTime)/this.speed, 0);
                }
            } else {
                factor = 1;
            }
            // calculate heading
            heading = Mathf.angle(this.actor.xform.x, this.actor.xform.y, this.x, this.y, true);
            // calculate heading/speed from actor to target
            if (this.actor.heading !== heading || this.factor !== factor) {
                let update = {
                    heading: heading,
                    speed: factor*this.speed,
                };
                if (this.facing && this.facing != this.actor.facing) {
                    update.facing = this.facing;
                }
                UpdateSystem.eUpdate(this.actor, update);
                this.factor = factor;
            }
        // within range of target
        } else {
            if (this.dbg) console.log(`${this.actor} arrived at target: ${this.x},${this.y}`);
            let update = {};
            this.done = true;
            if (this.stopAtTarget) update.speed = 0;
            if (this.snap) {
                update.xform = { x: this.x, y: this.y };
            }
            //console.log(`-- move update: ${Fmt.ofmt(update)}`);
            this.finish(update);
        }
    }

    finish(update) {
        super.finish(update);
        if (this.sfx) this.sfx.stop();
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.x, this.y, this.snap, this.accel, this.stopAtTarget, Fmt.ofmt(this.update));
    }
}

