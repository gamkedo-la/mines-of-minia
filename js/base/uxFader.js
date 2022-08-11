export { UxFader };

import { Events } from './event.js';
import { UxView } from './uxView.js';
import { Game } from './game.js';
import { Timer } from './timer.js';
import { Mathf } from './math.js';


/**
 * fader that uses global transparency to render children
 * -- ttl is used to either fade in or fade out
 */
class UxFader extends UxView {
    static dfltTTL = 1000;

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // fadein => transparent to visible
        // !fadein => visible to transparent
        this.fadein = spec.fadein || false;
        this.ttl = spec.ttl || this.constructor.dfltTTL;

        this.alpha = (this.fadein) ? 0 : 1;
        this.elapsed = 0;

        this.timer;
        // -- event handlers
        this.onTimer = this.onTimer.bind(this);
        this.onTock = this.onTock.bind(this);
        console.log(`ontock bind`);
    }

    destroy() {
        super.destroy();
        if (this.timer) this.timer.destroy();
    }

    // METHODS -------------------------------------------------------------
    show() {
        // start timer
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
        Events.listen(Game.evtTock, this.onTock);
        console.log(`ontock listen`);
    }

    onTock(evt) {
        this.elapsed += evt.deltaTime;
        if (this.fadein) {
            this.alpha = Mathf.clamp(Mathf.lerp(0, this.ttl, 0, 1, this.elapsed), 0, 1);
        } else {
            this.alpha = Mathf.clamp(Mathf.lerp(0, this.ttl, 1, 0, this.elapsed), 0, 1);
        }
    }

    onTimer(evt) {
        Events.ignore(Game.evtTock, this.onTock);
        this.timer = null;
    }

    reset(activate=false) {
        this.alpha = (this.fadein) ? 0 : 1;
        this.elapsed = 0;
        // restart timer if visible
        if (this.timer) this.timer.destroy();
        if (this.visible) this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
    }

    _childrender(ctx) {
        let oldAlpha = ctx.globalAlpha;
        ctx.globalAlpha = this.alpha;
        super._childrender(ctx);
        ctx.globalAlpha = oldAlpha;
    }

}