export { TextVfx };

import { Events } from './event.js';
import { Game } from './game.js';
import { Mathf } from './math.js';
import { Text } from './text.js';
import { Timer } from './timer.js';
import { UxFader } from './uxFader.js';
import { UxText } from './uxText.js';
import { Vfx } from './vfx.js';

class TextVfx extends Vfx {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltTTL = 1000;

    // STATIC PROPERTIES ---------------------------------------------------
    static get dfltText() {
        return new Text({text: 'default text', color: 'red'});
    }

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.fade = spec.hasOwnProperty('fade') ? spec.fade : false;
        this.fadein = spec.hasOwnProperty('fadein') ? spec.fadein : false;
        this.float = spec.float || 0;
        this.floatAngle = spec.hasOwnProperty('floatAngle') ?  spec.floatAngle : -Math.PI*.5;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        this.text = spec.text || this.constructor.dfltText;
        this.elapsed = 0;
        if (spec.hasOwnProperty('textStr')) this.text.text = spec.textStr;
        let view = this;
        if (this.fade) {
            let fader = new UxFader({
                ttl: this.ttl,
                fadein: this.fadein,
            });
            this.adopt(fader);
            view = fader;
        }
        view.adopt(new UxText({ text: this.text }));
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

    // METHODS -------------------------------------------------------------
    show() {
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
        // handle float
        if (this.float) Events.listen(Game.evtTock, this.onTock);
    }
}