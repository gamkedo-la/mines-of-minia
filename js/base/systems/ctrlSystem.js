export { CtrlSystem };

import { Bindings } from '../bindings.js';
import { Events } from '../event.js';
import { Game } from '../game.js';
import { Keys } from '../keys.js';
import { Mathf } from '../math.js';
import { System } from '../system.js';
import { Vect } from '../vect.js';
import { UpdateSystem } from './updateSystem.js';

class CtrlSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static _id = 1;
    static evtActivated = 'ctrl.activated';
    static evtUpdated = 'ctrl.updated';
    static evtDeactivated = 'ctrl.deactivated';

    // STATIC PROPERTIES ---------------------------------------------------
    static get ctrlid() {
        return this._id++;
    }
    static set ctrlid(v) {
        if (v >= this._id) this.id = v+1;
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- parse spec
        this.bindings = spec.bindings || Bindings.zero;
        this.gain = spec.gain || .01;
        this.decay = spec.decay || .01;
        if (spec.hasOwnProperty('ctrlid')) {
            this.ctrlid = spec.ctrlid;
            this.constructor.ctrlid = this.ctrlid;
        } else {
            this.ctrlid = this.constructor.ctrlid;
        }
        // -- local vars
        this.vect = new Vect(0,0);
        this.dx = 0;
        this.dy = 0;
        this.active = false;
        // -- setup event handlers
        this.onTock = this.onTock.bind(this);
        this.onKeyChange = this.onKeyChange.bind(this);
        Events.listen(Keys.evtDown, this.onKeyChange);
        Events.listen(Keys.evtUp, this.onKeyChange);
    }

    destroy() {
        Events.ignore(Keys.evtDown, this.onKeyChange);
        Events.ignore(Keys.evtUp, this.onKeyChange);
        Events.ignore(Game.evtTock, this.onTock);
    }

    // PROPERTIES ----------------------------------------------------------
    get factor() {
        return this.vect.mag;
    }

    get heading() {
        return this.vect.heading(true);
    }

    get x() {
        return this.vect.x;
    }

    get y() {
        return this.vect.y;
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTock(evt) {
        let newx = 0;
        if (this.dx) {
            newx = Mathf.clamp(this.vect.x + this.dx * evt.deltaTime * this.gain, -1, 1);
        } else {
            if (this.vect.x > 0) {
                newx = Math.max(0, this.vect.x - this.decay * evt.deltaTime);
            } else if (this.vect.x < 0) {
                newx = Math.min(0, this.vect.x + this.decay * evt.deltaTime);
            }
        }
        let newy = 0;
        if (this.dy) {
            newy = Mathf.clamp(this.vect.y + this.dy * evt.deltaTime * this.gain, -1, 1);
        } else {
            if (this.vect.y > 0) {
                newy = Math.max(0, this.vect.y - this.decay * evt.deltaTime);
            } else if (this.vect.y < 0) {
                newy = Math.min(0, this.vect.y + this.decay * evt.deltaTime);
            }
        }
        if (newx != this.vect.x || newy != this.vect.y) {
            let data = {
                old_heading: this.heading,
                old_factor: this.factor,
            };
            if (newx !== this.vect.x) {
                data.x = newx;
                data.old_x = this.vect.x;
                this.vect.x = newx;
            }
            if (newy !== this.vect.y) {
                data.y = newy;
                data.old_y = this.vect.y;
                this.vect.y = newy;
            }
            data.heading = this.heading;
            data.factor = this.factor;
            if (this.dbg) console.log(`new ctrl heading: ${data.heading} factor: ${data.factor}`);
            this.evt.trigger(this.constructor.evtUpdated, data);
            this.entityUpdate(data);
        }
        if (this.vect.x === 0 && this.vect.y === 0) this.deactivate();
    }

    onKeyChange(evt) {
        // calculate new x/y values
        this.dx = (this.bindings.right - this.bindings.left);
        this.dy = (this.bindings.down - this.bindings.up);
        // has there been a change to x/y updates?
        if ((this.dx || this.dy) && !this.active) {
            this.activate()
        }
    }

    // METHODS -------------------------------------------------------------
    matchPredicate(e) {
        return e.ctrlid === this.ctrlid;
    }

    entityUpdate(update) {
        for (const e of this.store.values()) {
            UpdateSystem.eUpdate(e, {speed: e.maxSpeed*update.factor, heading: update.heading});
        }
    }

    activate() {
        if (this.dbg) console.log(`ctrl activated`);
        this.active = true;
        Events.listen(Game.evtTock, this.onTock);
        this.evt.trigger(this.constructor.evtActivated);
    }

    deactivate() {
        if (this.dbg) console.log(`ctrl deactivated`);
        this.active = false;
        Events.ignore(Game.evtTock, this.onTock);
        this.evt.trigger(this.constructor.evtDeactivated);
    }

}