export { HealthVfx };

    import { Config } from './base/config.js';
import { Events } from './base/event.js';
import { Game } from './base/game.js';
import { Mathf } from './base/math.js';
import { UpdateSystem } from './base/systems/updateSystem.js';
import { Timer } from './base/timer.js';
import { Util } from './base/util.js';
import { Vfx } from './base/vfx.js';

class HealthVfx extends Vfx {
    static dfltBgColor = 'rgba(45,45,45,.75)'
    static dfltFgColor = 'rgba(175,0,0,.75)'

    cpost(spec) {
        super.cpost(spec);
        this.bgColor = spec.bgColor || this.constructor.dfltBgColor;
        this.fgColor = spec.fgColor || this.constructor.dfltFgColor;
        this.lastHealth;
        this.xform.width = spec.hasOwnProperty('width') ? spec.width : Config.tileSize;
        this.xform.height = spec.hasOwnProperty('height') ? spec.height : Config.tileSize/8;
        this.xform.offx = -this.xform.width/2;
    }

    onActorUpdate(evt) {
        let update = {};
        if (evt.update && evt.update.xform && (evt.update.xform.hasOwnProperty('x') || evt.update.xform.hasOwnProperty('y'))) {
            if (this.xform.x !== evt.update.xform.x || this.xform.y !== evt.update.xform.y) {
                update.xform = { x: evt.update.xform.x, y: evt.update.xform.y };
            }
        }
        if (evt.update && evt.update.health) {
            if (this.lastHealth !== evt.update.health) {
                update.lastHealth = evt.update.health;
            }
        }
        if (!Util.empty(update)) {
            UpdateSystem.eUpdate(this, update);
        }
    }

    linkActor(actor) {
        super.linkActor(actor);
        this.xform.offy = Math.round(-actor.xform.height/2)-6;
    }

    _render(ctx) {
        // update sketch dimensions
        ctx.beginPath();
        // render background
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(this.xform.minx-1, this.xform.miny-1, this.xform.width+2, this.xform.height+2);
        // render foreground
        let fillWidth = Math.round(this.xform.width*this.actor.health/this.actor.healthMax);
        ctx.fillStyle = this.fgColor;
        ctx.fillRect(this.xform.minx, this.xform.miny, fillWidth, this.xform.height);
    }

}