
export { WanderAction };

import { Action } from "./action.js";
import { Vect } from "../vect.js";
import { MoveAction } from "./move.js";
import { Fmt } from "../fmt.js";
import { Timer } from "../timer.js";
import { Random } from "../random.js";

class WanderAction extends Action {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltRange = 80;
    static dfltTTL = 5000;
    static dfltPonderTTL = 750;
    static dfltPonderPct = .5;
    static dfltPonderJitter = .5;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.speed = spec.speed || 0;
        this.range = spec.range || this.constructor.dfltRange;
        this.chooseTargetFcn = spec.chooseTargetFcn || this.chooseTarget;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        this.ponderTTL = spec.ponderTTL || this.constructor.dfltPonderTTL;
        this.ponderPct = spec.hasOwnProperty('ponderPct') || this.constructor.dfltPonderPct;
        this.ponderJitter = spec.ponderJitter || this.constructor.dfltPonderJitter;
        this.onTimer = this.onTimer.bind(this);
        // bind event handlers
        this.onMoveDone = this.onMoveDone.bind(this);
        this.onPonderDone = this.onPonderDone.bind(this);
        this.onTimer = this.onTimer.bind(this);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onMoveDone(evt) {
        console.log(`${this} onMoveDone`);
        if (evt.actor !== this.actor || evt.action !== this.moveAction) return;
        this.moveAction.evtFinished.ignore(this.onMoveDone);
        this.moveAction = null;
        if (this.done) {
            this.evtFinished.trigger({actor: this.actor, action: this});
            console.log(`${this} finished}`);
        } else {
            this.think(this.ponderPct);
        }
    }
    onPonderDone(evt) {
        console.log(`${this} onPonderDone`);
        this.ponderTimer = null;
        if (this.done) {
            this.evtFinished.trigger({actor: this.actor, action: this});
            console.log(`${this} finished}`);
        } else {
            this.think(0);
        }
    }
    onTimer(evt) {
        console.log(`${this} onTimer`);
        this.done = true;
    }


    // METHODS -------------------------------------------------------------
    think(ponderPct) {
        // 'ponder' at current location
        if (Random.flip(ponderPct)) {
            // compute ttl for ponder timer
            let ttl = Random.jitter(this.ponderTTL, this.ponderJitter);
            // -- start timer for wandering
            console.log(`pondering for ${ttl}...`);
            this.ponderTimer = new Timer({ttl: ttl, cb: this.onPonderDone});
        // otherwise... move to random target
        } else {
            // choose a wander target
            let target = this.chooseTargetFcn(this.actor.x, this.actor.y, this.range);
            this.moveAction = new MoveAction({x: target.x, y: target.y, accel: .001, speed: this.speed});
            this.moveAction.evtFinished.listen(this.onMoveDone);
            console.log(`${this.moveAction.evtFinished} listening listeners: ${this.moveAction.evtFinished.length}`);
            this.moveAction.start(this.actor);
            console.log(`moving to ${target}...`);
        }
    }

    chooseTarget(x, y, range) {
        // pick an angle
        let angle = Math.random() * Math.PI * 2;
        range = Math.random() * range;
        // pick new coords
        let dx = Math.round(Math.cos(angle)*range);
        let dy = Math.round(Math.sin(angle)*range);
        return new Vect(x+dx, y+dy);
    }

    start(actor) {
        this.actor = actor;
        console.log(`Starting ${this} for actor: ${actor}`);
        // -- start timer for wandering
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
        // choose an action
        this.think();
    }

    stop() {
        console.log(`${this} stop}`);
        if (!this.done) this.ok = false;
        if (this.moveAction) {
            this.moveAction.evtFinished.ignore(this.onMoveDone);
            this.moveAction.stop();
        }
        if (this.timer) this.timer.destroy();
        if (this.ponderTimer) this.ponderTimer.destroy();
    }
}