export { MoveSystem };

import { Stats } from '../stats.js';
import { System } from '../system.js';
import { UxView } from '../uxView.js';
import { UpdateSystem } from './updateSystem.js';


/**
 * reads:
 * - heading
 * - speed
 * - x,y
 */
class MoveSystem extends System {
    //static dfltIterateTTL = 15;
    static dfltIterateTTL = 0;


    cpost(spec) {
        super.cpost(spec);
        // bind event handlers 
        this.onEntityIntent = this.onEntityIntent.bind(this);
        this.evt.listen(UxView.evtIntent, this.onEntityIntent);
    }

    destroy() {
        super.destroy();
        this.evt.ignore(UxView.evtIntent, this.onEntityIntent);
    }

    onEntityIntent(evt) {
        let actor = evt.actor;
        let update = evt.update;
        // only care about speed updates
        if (!actor || !update || !update.hasOwnProperty('speed')) return;
        let speed = update.speed;
        if (speed) {
            if (!this.store.has(actor.gid)) {
                if (this.dbg) console.log(`${this} detected speed set on non-moving object, update to track ${actor}`);
                this.store.set(actor.gid, actor);
            }
        } else {
            if (this.store.has(actor.gid)) {
                if (this.dbg) console.log(`${this} detected speed zeroed on moving object, update to no longer track ${actor}`);
                this.store.delete(actor.gid, actor);
            }
        }
    }

    iterate(evt, e) {
        Stats.count('move.iterate');
        // determine movement speed... skip if not moving...
        let speed = e.speed;
        if (!speed) return;
        speed *= evt.elapsed;

        // determine desired position based on speed and heading
        let wantx = Math.round(e.xform.x + speed * Math.cos(e.heading));
        let wanty = Math.round(e.xform.y + speed * Math.sin(e.heading));
        if (wantx === e.x && wanty === e.y) return;
        if (this.dbg) console.log(`move transform from: ${e.xform.x},${e.xform.y} to: ${wantx},${wanty}`);

        // handle update
        UpdateSystem.eUpdate(e, { xform: {x: wantx, y: wanty }});
    }

    matchPredicate(e) {
        return e.speed;
    }


}