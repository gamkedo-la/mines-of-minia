export { Animation, Cel };

import { Sketch }               from './sketch.js';
import { Fmt }                  from './fmt.js';
import { EvtStream }               from './event.js';
import { Gizmo }                from './gizmo.js';
import { Timer }                from './timer.js';


/** ========================================================================
 * A single cel of an animation.
 */
class Cel extends Gizmo {
    static dfltTTL = 100;
    cpost(spec) {
        this.sketch = spec.sketch || Sketch.zero;
        this.ttl = spec.ttl || Cel.dfltTTL;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.ttl, this.sketch);
    }
}

/** ========================================================================
 * An animation is a sketch used to render a series of animation cels (sketches).
 */
class Animation extends Sketch {
    // STATIC VARIABLES ----------------------------------------------------
    static evtUpdated = 'animation.updated';
    static evtDone = 'animation.done';

    // STATIC PROPERTIES ---------------------------------------------------
    static get evt() {
        return new EvtStream();
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.loop = (spec.hasOwnProperty('loop')) ? spec.loop : true;
        this.cels = spec.cels || [new Cel()];
        this.cidx = 0;
        this.width = this.cel.sketch.width;
        this.height = this.cel.sketch.height;
        this._done = false;
        // bind event handlers
        this.onTimer = this.onTimer.bind(this);
    }

    destroy() {
        this.hide();
        if (this.timer) this.timer.destroy();
    }

    // PROPERTIES ----------------------------------------------------------
    get done() {
        return this._done;
    }

    get cel() {
        return this.cels[this.cidx];
    }

    get iwidth() {
        return this.sketch.iwidth;
    }

    get iheight() {
        return this.sketch.iheight;
    }

    get sketch() {
        if (this.cels.length) {
            return this.cels[this.cidx].sketch;
        }
        return Sketch.zero;
    }

    get idx() {
        return this.cidx;
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTimer(evt) {
        this.timer = null;
        // grab current index
        let cidx = this.cidx;
        // advance frame accounting for timer overflow
        let overflow = evt.overflow || 0;
        let updated = false;
        do {
            this.advance();
            // we did not advance a cel, so last timer was for last cel
            if (this.cidx === cidx) {
                if (!this._done) {
                    this._done = true;
                    this.evt.trigger(this.constructor.evtDone, {actor: this});
                }
                break;
            }
            // otherwise, continue to advance cels while cel ttl is < overflow
            updated = true;
            if (this.cel.ttl >= overflow) {
                this.timer = new Timer({ttl: this.cel.ttl-overflow, cb: this.onTimer});
                break;
            } else {
                overflow -= this.cel.ttl;
            }
        } while (overflow > 0);
        if (updated) {
            this.evt.trigger(this.constructor.evtUpdated, {actor: this});
        }
    }

    // METHODS -------------------------------------------------------------
    show() {
        if (this.cels.length > 0) {
            this.cels[this.cidx].sketch.show();
        }
        if (this.cels.length > 1) {
            if (!this.timer) this.timer = new Timer({ttl: this.cel.ttl, cb: this.onTimer});
        }
    }

    hide() {
        if (this.cels.length > 0) {
            this.cels[this.cidx].sketch.hide();
        }
        if (this.timer) {
            this.timer.destroy();
            this.timer = undefined;
        }
    }

    reset() {
        this.cidx = 0;
        this._done = false;
    }

    advance() {
        this.cels[this.cidx].sketch.hide();
        this.cidx++;
        if (this.cidx >= this.cels.length) {
            if (this.loop) {
                this.cidx = 0;
            } else {
                this.cidx = this.cels.length-1;
            }
        }
        this.cels[this.cidx].sketch.show();
    }

    rewind() {
        this.cels[this.cidx].sketch.hide();
        this.cidx--;
        if (this._done && this.cels.length > 1) this._done = false;
        if (this.cidx < 0) {
            if (this.loop) {
                this.cidx = this.cels.length-1;
            } else {
                this.cidx = 0;
            }
        }
        this.cels[this.cidx].sketch.show();
    }

    _render(renderCtx, x=0, y=0, width=0, height=0) {
        this.sketch.width = width;
        this.sketch.height = height;
        this.sketch.render(renderCtx, x, y);
    }

}