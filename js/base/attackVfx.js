export { AttackVfx };

import { Assets } from './assets.js';
import { Config } from './config.js';
import { Direction } from './dir.js';
import { Events } from './event.js';
import { Game } from './game.js';
import { Mathf } from './math.js';
import { Sketch } from './sketch.js';
import { UpdateSystem } from './systems/updateSystem.js';
import { Timer } from './timer.js';
import { UxPanel } from './uxPanel.js';
import { Vfx } from './vfx.js';
import { XForm } from './xform.js';

class AttackVfx extends Vfx {
    static dfltTTL = 400;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        if (!spec.xform) {
            spec.xform = new XForm({
                stretch: false, 
                width: Config.tileSize,
                height: Config.tileSize,
                offx: -Config.tileSize/2,
                offy: (-Config.tileSize/2)-5,
            });
        }
    }
    cpost(spec) {
        super.cpost(spec);
        this.swing = spec.swing || Config.tileSize/2;
        let facing = spec.facing || this.actor.facing;
        this.swingAngle = spec.hasOwnProperty('angle') ? spec.angle : (facing === Direction.east) ? 0 : Math.PI;
        this.anim = (this.actor.inventory && this.actor.inventory.weapon) ? Assets.get(this.actor.inventory.weapon.sketch.tag, true, {lockRatio: true, state: 'carry'}) : Sketch.zero;
        this.ttl = spec.ttl || this.constructor.dfltTTL;
        this.elapsed = 0;
        let panel = new UxPanel({ sketch: this.anim });
        this.adopt(panel);
        if (facing !== Direction.east) {
            panel.xform.scalex = -1;
        }
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
        let tx, ty, dx, dy;
        tx = Math.cos(this.swingAngle)*this.swing;
        ty = Math.sin(this.swingAngle)*this.swing;
        if (this.elapsed < this.ttl/2) {
            dx = Mathf.lerp(0, this.ttl/2, 0, tx, this.elapsed);
            dy = Mathf.lerp(0, this.ttl/2, 0, ty, this.elapsed);
        } else {
            dx = Mathf.lerp(this.ttl/2, this.ttl, tx, 0, this.elapsed);
            dy = Mathf.lerp(this.ttl/2, this.ttl, ty, 0, this.elapsed);
        }
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
        // handle swing
        if (this.swing) Events.listen(Game.evtTock, this.onTock);
    }
}