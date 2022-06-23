export { LoSSystem };

import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { System } from '../base/system.js';
import { UxDbg } from '../base/uxDbg.js';

class LoSSystem extends System {

    static evtUpdated = 'los.updated';

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this.lvl = spec.lvl;
        //this.gameEvt = spec.gameEvt || Events.main;
        this.active = false;
        this.eidxs = new Map();
        this.checkBlockFcn = spec.checkBlockFcn || (v=>v.kind === 'wall');
        this.onEntityUpdated = this.onEntityUpdated.bind(this);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLoadLevel(evt) {
    }

    onLevelUpdate(evt) {
    }

    onEntityAdded(evt) {
        if (this.matchPredicate(evt.actor)) {
            let actor = evt.actor;
            if (this.dbg && this.dbg.console) console.log(`${this} onEntityAdded: ${Fmt.ofmt(evt)} gid: ${actor.gid}`);
            this.store.set(actor.gid, actor);
            this.eidxs.set(actor.gid, actor.idx);
            this.setLoS(actor);
            actor.evt.listen(actor.constructor.evtUpdated, this.onEntityUpdated);
        }
    }

    onEntityRemoved(evt) {
        let actor = evt.actor;
        if (!actor) return;
        if (this.dbg && this.dbg.console) console.log(`${this} onEntityRemoved: ${Fmt.ofmt(evt)}`);
        this.store.delete(actor.gid);
        this.eidxs.delete(actor.gid);
        actor.evt.ignore(actor.constructor.evtUpdated, this.onEntityUpdated);
    }

    onEntityUpdated(evt) {
        let actor = evt.actor;
        if (actor && this.eidxs.has(actor.gid)) {
            if (actor.idx !== this.eidxs.get(actor.gid)) {
                this.setLoS(actor);
                this.eidxs.set(actor.gid, actor.idx);
            }
        }
    }

    // METHODS -------------------------------------------------------------

    matchPredicate(e) {
        return e.losRange;
    }

    /**
     * override iterate, called when new level is loaded
     * @param {*} evt 
     * @param {*} e 
     */
    iterate(evt, e) {
        this.setLoS(e);
    }

    finalize(evt) {
        this.active = false;
    }

    testBlockedAlongLine(idxs, p1idx,p1x,p1y, p2idx,p2x,p2y) {
        // check if los is blocked by determining what is in line between test index and player
        for (const lidx of idxs) {
            if (lidx === p1idx || lidx === p2idx) continue;
            if (this.lvl.checkIdxIntersectSegment(lidx, p1x, p1y, p2x, p2y)) {
                // find objects at index
                if (this.lvl.anyidx(lidx, (v) => v.idx === lidx && this.checkBlockFcn(v))) return true;
            }
        }
        return false;
    }

    setLoS(e) {
        let inRange = Array.from(this.lvl.idxsInRange(e.idx, e.losRange));
        let visible = [];
        let blocked = [];
        // center of target (e)
        let cx = this.lvl.xfromidx(e.idx, true);
        let cy = this.lvl.yfromidx(e.idx, true);
        for (const tidx of inRange) {
            // min point from index
            let mx = this.lvl.xfromidx(tidx);
            let my = this.lvl.yfromidx(tidx);
            let isBlocked = true;
            for (const [tx,ty] of [ 
                Mathf.towards(mx, my, cx, cy, 1),
                Mathf.towards(mx+this.lvl.tileSize, my, cx, cy, 1),
                Mathf.towards(mx, my+this.lvl.tileSize, cx, cy, 1),
                Mathf.towards(mx+this.lvl.tileSize, my+this.lvl.tileSize, cx, cy, 1),
            ]) {
                isBlocked &= this.testBlockedAlongLine(inRange, e.idx, cx, cy, tidx, tx, ty)
            }
            if (isBlocked) {
                blocked.push(tidx);
            } else {
                visible.push(tidx);
            }
        }
        if (this.dbg && e.cls === 'Player') {
            if ((this.dbg.blocked || this.dbg.visible)) UxDbg.clear();
            if (this.dbg.blocked) {
                for (const idx of blocked) {
                    let x = this.lvl.xfromidx(idx);
                    let y = this.lvl.yfromidx(idx);
                    UxDbg.drawRect(x, y, this.lvl.tileSize, this.lvl.tileSize, { color: 'rgba(255,0,0,.25)'});
                }
            }
            if (this.dbg.visible) {
                for (const idx of visible) {
                    let x = this.lvl.xfromidx(idx);
                    let y = this.lvl.yfromidx(idx);
                    UxDbg.drawRect(x, y, this.lvl.tileSize, this.lvl.tileSize, { color: 'rgba(0,255,0,.25)'});
                }
            }
        }
        e.losIdxs = visible;
        this.evt.trigger(this.constructor.evtUpdated, {actor: e});
        if (this.dbg && this.dbg.console) console.log(`${this} set LoS for ${e} to ${visible}`);
    }

}