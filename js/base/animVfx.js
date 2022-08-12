export { AnimVfx };

import { Events } from './event.js';
import { Game } from './game.js';
import { Mathf } from './math.js';
import { Sketch } from './sketch.js';
import { Text } from './text.js';
import { Timer } from './timer.js';
import { UxFader } from './uxFader.js';
import { UxText } from './uxText.js';
import { Vfx } from './vfx.js';

class AnimVfx extends Vfx {
    static dfltTTL = 1000;

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.fade = spec.hasOwnProperty('fade') ? spec.fade : false;
        this.fadein = spec.hasOwnProperty('fadein') ? spec.fadein : false;
        this.float = spec.float || 0;
        this.floatAngle = spec.hasOwnProperty('floatAngle') ?  spec.floatAngle : -Math.PI*.5;
        this.anim = spec.anim || Sketch.zero;
        let dfltTTL = (this.anim.cls === 'Animation') ? this.anim.duration : this.constructor.dfltTTL;
        this.ttl = spec.ttl || dfltTTL;
        this.elapsed = 0;
        if (spec.hasOwnProperty('textStr')) this.text.text = spec.textStr;
        let view = this;
        if (this.fade) {
            let fader = new UxFader({
                ttl: this.ttl,
                fadein: this.fadein,
            });
            view.adopt(fader);
            view = fader;
        }
        view.adopt(new UxPanel({ sketch: this.anim }));
        // -- event handlers
        this.onTimer = this.onTimer.bind(this);
        this.onTock = this.onTock.bind(this);
    }

    destroy() {
        if (this.timer) this.timer.destroy();
        Events.ignore(Game.evtTock, this.onTock);
        super.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTock(evt) {
        this.elapsed += evt.deltaTime;
        if (this.elapsed > this.ttl) this.elapsed = this.ttl;
        let tx = Math.cos(this.floatAngle)*this.float;
        let ty = Math.sin(this.floatAngle)*this.float;
        let dx = Mathf.lerp(0, this.ttl, 0, tx, this.elapsed);
        let dy = Mathf.lerp(0, this.ttl, 0, ty, this.elapsed);
        let sx = (this.actor) ? this.actor.xform.x : 0;
        let sy = (this.actor) ? this.actor.xform.y : 0;
        this.xform.x = sx + dx;
        this.xform.y = sy + dy;
    }

    onTimer(evt) {
        this.destroy();
    }

    onAnimDone(evt) {
        actor.evt.ignore(actor.constructor.evtUpdate, onActorUpdate);
        actor.evt.ignore(actor.constructor.evtDestroyed, onActorDestroyed);
        anim.evt.ignore(anim.constructor.evtDone, onAnimDone);
        panel.destroy();
    };

    // METHODS -------------------------------------------------------------
    show() {
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
        // handle float
        if (this.float) Events.listen(Game.evtTock, this.onTock);
    }
}