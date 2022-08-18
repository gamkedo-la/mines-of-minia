export { AnimVfx };

    import { Config } from './config.js';
import { Events } from './event.js';
import { Game } from './game.js';
import { Mathf } from './math.js';
import { Sketch } from './sketch.js';
import { Timer } from './timer.js';
import { UxFader } from './uxFader.js';
import { UxPanel } from './uxPanel.js';
import { Vfx } from './vfx.js';
import { XForm } from './xform.js';

class AnimVfx extends Vfx {
    static dfltTTL = 1000;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        if (!spec.xform && spec.anim) {
            spec.xform = new XForm({
                stretch: false, 
                width: spec.anim.width, 
                height: spec.anim.height, 
                offx: -spec.anim.width*.5, 
                offy: (spec.anim.height > Config.tileSize) ? Config.tileSize*.5-spec.anim.height : -spec.anim.height*.5,
            });
        }
    }
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
        UpdateSystem.eUpdate(this, { xform: {x: sx+dx, y: sy+dy }});
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