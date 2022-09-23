export { HealthVfx };

    import { Config } from './base/config.js';
import { Events } from './base/event.js';
import { Game } from './base/game.js';
import { Mathf } from './base/math.js';
import { Timer } from './base/timer.js';
import { Vfx } from './base/vfx.js';

class HealthVfx extends Vfx {
    static dfltBgColor = 'rgba(45,45,45,.75)'
    static dfltFgColor = 'rgba(175,0,0,.75)'

    cpost(spec) {
        super.cpost(spec);
        this.bgColor = spec.bgColor || this.constructor.dfltBgColor;
        this.fgColor = spec.fgColor || this.constructor.dfltFgColor;
        this.offy = spec.hasOwnProperty('offy') ? spec.offy : -Config.tileSize;
        this.width = spec.hasOwnProperty('width') ? spec.width : Config.tileSize;
        // -- event handlers
    }

    show() {
        this.timer = new Timer({ttl: this.ttl, cb: this.onTimer});
        Events.listen(Game.evtTock, this.onTock);
    }

    linkActor(actor) {
        super.linkActor(actor);
        this.xform.width = actor.scanRange;
        this.xform.height = actor.scanRange;
    }

    _render(ctx) {
        // update sketch dimensions
        ctx.beginPath();
        ctx.arc(this.xform.minx, this.xform.miny, this.radius, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(155,171,178,.15)';
        ctx.stroke();
        ctx.arc(this.xform.minx, this.xform.miny, this.radius+1, 0, Math.PI*2);
        if (this.radius > 2) {
            ctx.arc(this.xform.minx, this.xform.miny, this.radius-1, 0, Math.PI*2);
        }
        ctx.strokeStyle = 'rgba(155,171,178,.05)';
        ctx.stroke();
    }

}