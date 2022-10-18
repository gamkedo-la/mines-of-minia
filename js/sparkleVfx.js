export { SparkleVfx };

import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Game } from './base/game.js';
import { Mathf } from './base/math.js';
import { Random } from './base/random.js';
import { Timer } from './base/timer.js';
import { Vfx } from './base/vfx.js';
import { Resurrect64 } from './resurrect64.js';

class Spark {
    constructor(spec={}) {
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.ttl = spec.ttl || 0;
        this.radius = spec.radius || 3;
        this.rate = spec.hasOwnProperty('rate') ? spec.rate : .01;
        this.startAlpha = spec.hasOwnProperty('startAlpha') ? spec.startAlpha : .25;
        this.targetAlpha = spec.hasOwnProperty('targetAlpha') ? spec.targetAlpha : .75;
        this.destroycb = spec.destroycb;
        this.updatecb = spec.updatecb;
        this.color = spec.color || Resurrect64.colors[48];
        this.elapsed = 0;
        this.angle = Random.range(0, Math.PI*2);
        this.alpha = this.startAlpha;
        this.onTock = this.onTock.bind(this);
        Events.listen(Game.evtTock, this.onTock);
    }
    destroy() {
        Events.ignore(Game.evtTock, this.onTock);
        if (this.destroycb) this.destroycb(this);
    }

    onTock(evt) {
        this.elapsed += evt.deltaTime;
        if (this.elapsed >= this.ttl) {
            this.destroy();
            return;
        }
        let half = this.ttl/2;
        // update alpha
        if (this.elapsed <= half) {
            this.alpha = Mathf.lerp(0, half, this.startAlpha, this.targetAlpha, this.elapsed);
        } else {
            this.alpha = Mathf.lerp(half, this.ttl, this.targetAlpha, this.startAlpha, this.elapsed);
        }
        // update angle
        this.angle += this.rate*evt.deltaTime;
        this.updatecb(this);
    }

    render(ctx) {
        // render at alpha
        let oalpha = ctx.globalAlpha;
        ctx.globalAlpha = this.alpha;
        // primary axis (half)
        let r = this.radius *.5;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x-r, this.y);
        ctx.lineTo(this.x+r, this.y);
        ctx.moveTo(this.x, this.y-r);
        ctx.lineTo(this.x, this.y+r);
        ctx.stroke();
        // primary axis (full)
        ctx.globalAlpha = this.alpha*.6;
        r = this.radius;
        ctx.moveTo(this.x-r, this.y);
        ctx.lineTo(this.x+r, this.y);
        ctx.moveTo(this.x, this.y-r);
        ctx.lineTo(this.x, this.y+r);
        ctx.stroke();
        // secondary axis
        ctx.globalAlpha = this.alpha*.6;
        ctx.beginPath();
        r = this.radius*.6;
        ctx.moveTo(this.x+r*Math.cos(this.angle), this.y+r*Math.sin(this.angle));
        ctx.lineTo(this.x-r*Math.cos(this.angle), this.y-r*Math.sin(this.angle));
        ctx.moveTo(this.x+r*Math.cos(this.angle+Math.PI*.5), this.y+r*Math.sin(this.angle+Math.PI*.5));
        ctx.lineTo(this.x-r*Math.cos(this.angle+Math.PI*.5), this.y-r*Math.sin(this.angle+Math.PI*.5));
        ctx.stroke();
        // restore alpha
        ctx.globalAlpha = oalpha;
    }

}

class SparkleVfx extends Vfx {

    cpost(spec) {
        super.cpost(spec);
        this.points = spec.points || [[0,0]];
        this.interval = spec.interval || 1000;
        this.jitter = spec.jitter || .5;
        this.sparkTTL = spec.sparkTTL || 500;
        this.sparkJitter = spec.sparkJitter || .2;
        this.sparkColor = spec.sparkColor || Resurrect64.colors[48];
        this.onTimer = this.onTimer.bind(this);
        this.sparks = [];
    }

    onTimer(evt) {
        // create a new spark
        // -- pick point
        let [xo,yo] = Random.choose(this.points);
        let spark = new Spark({
            x: xo,
            y: yo,
            color: this.sparkColor,
            rate: Random.range(-.01,.01),
            ttl: Random.jitter(this.sparkTTL, this.sparkJitter),
            evt: this.evt,
            updatecb: (v) => {
                this.evt.trigger(this.constructor.evtUpdated, { actor: this });
            },
            destroycb: (v) => {
                let idx = this.sparks.indexOf(v);
                if (idx !== -1) this.sparks.splice(idx);
            },
        });
        this.sparks.push(spark);
        this.timer = new Timer({ttl: Random.jitter(this.interval, this.jitter), cb: this.onTimer});
    }

    show() {
        this.timer = new Timer({ttl: Random.jitter(this.interval, this.jitter), cb: this.onTimer});
    }

    _render(ctx) {
        for (const spark of this.sparks) spark.render(ctx);
    }

}