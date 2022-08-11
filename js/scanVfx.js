export { ScanVfx };

    import { Mathf } from './base/math.js';
import { Vfx } from './base/vfx.js';

class ScanVfx extends Vfx {
    static dfltTTL = 1000;

    cpost(spec) {
        super.cpost(spec);
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        this.timer;
        this.radius = 0;
        this.elapsed = 0;
        // -- event handlers
        this.onTock = this.onTock.bind(this);
        this.onTimer = this.onTimer.bind(this);
    }
    destroy() {
        Events.ignore(Game.evtTock, this.onTock);
        if (this.timer) this.timer.destroy();
        super.destroy();
    }

    onTock(evt) {
        // lerp radius
        this.radius = Mathf.lerp(0, this.ttl, 0, this.actor.scanRange, this.elapsed);
        this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }

    onTimer(evt) {
        this.destroy();
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
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        // render
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}