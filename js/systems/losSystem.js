export { LoSSystem };

import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { System } from '../base/system.js';
import { UxDbg } from '../base/uxDbg.js';

class LoSSystem extends System {

    static evtUpdated = 'los.updated';

    // STATIC METHODS ------------------------------------------------------
    static checkLoSBetweenIdxs(lvl, idx1, idx2, checkFcn=(v => (v.kind === 'wall') || (v.constructor.dynamicLoS && v.blocksLoS))) {
        for (const idx of lvl.idxsBetween(idx1, idx2)) {
            if (idx === idx1 || idx == idx2) continue;
            if (lvl.anyidx(idx, (v) => v.idx === idx && checkFcn(v))) return false;
        }
        return true;
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this.lvl = spec.lvl;
        //this.gameEvt = spec.gameEvt || Events.main;
        this.active = false;
        this.eidxs = new Map();
        // -- map of dynamic object gid -> array of entities impacted by dynamic object
        this.dynamicMap = {};
        // -- map of dependent entity (e.g.: has LoS enabled) gid -> array of dynamic objects
        this.dynamicDepMap = {};
        this.checkBlockFcn = spec.checkBlockFcn || (v => (v.kind === 'wall') || (v.constructor.dynamicLoS && v.blocksLoS));
        this.onEntityUpdated = this.onEntityUpdated.bind(this);
        this.onDynamicLosUpdate = this.onDynamicLosUpdate.bind(this);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onDynamicLosUpdate(evt) {
        if (evt.update && evt.update.hasOwnProperty('blocksLoS')) {
            if (this.dbg && this.dbg.console) console.log(`-- ${this} on dynamic update ${Fmt.ofmt(evt)}`);
            // iterate through entities that are impacted by actor
            for (const e of this.dynamicMap[evt.actor.gid]) {
                this.setLoS(e);
            }
        }
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
        // is entity tracking dynamic objects?
        for (const ode of Array.from(this.dynamicDepMap[actor.gid] || [])) {
            if (this.dbg && this.dbg.console) console.log(`remove dynamic map entry from ${actor} tracking ${ode}`)
            let dmap = this.dynamicMap[ode.gid];
            if (dmap) {
                let i = dmap.indexOf(actor);
                if (i !== -1) dmap.splice(i, 1);
                if (dmap.length === 0) {
                    if (this.dbg && this.dbg.console) console.log(`stop tracking updates for ${ode}`)
                    ode.evt.ignore(ode.constructor.evtUpdated, this.onDynamicLosUpdate);
                    delete this.dynamicMap[ode.gid];
                }
            }
        }
        delete this.dynamicDepMap[actor.gid];

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
        let dynamics = [];
        for (const tidx of inRange) {
            // check if dynamic los object is at given tidx
            for (const de of this.lvl.findidx(tidx, (v) => v.constructor.dynamicLoS)) {
                dynamics.push(de);
            }
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
        // see if any old los indices correspond to 
        for (const ode of Array.from(this.dynamicDepMap[e.gid] || [])) {
            if (!dynamics.includes(ode)) {
                if (this.dbg && this.dbg.console) console.log(`remove dynamic map entry from ${e} tracking ${ode}`)
                ode.evt.ignore(ode.constructor.evtUpdated, this.onDynamicLosUpdate);
                let dmap = this.dynamicMap[ode.gid];
                if (dmap) {
                    let i = dmap.indexOf(e);
                    if (i !== -1) dmap.splice(i, 1);
                    if (dmap.length === 0) delete this.dynamicMap[ode.gid];
                }
                let depmap = this.dynamicDepMap[e.gid];
                let i = depmap.indexOf(ode);
                if (i !== -1) depmap.splice(i, 1);
                if (depmap.length === 0) delete this.dynamicDepMap[e.gid];
            }
        }
        // update dynamic maps and event listeners for new dynamic LoS objects that are to be tracked
        for (const de of dynamics) {
            // is this dynamic already tracked?
            if (!(de.gid in this.dynamicMap)) {
                this.dynamicMap[de.gid] = [e];
                de.evt.listen(de.constructor.evtUpdated, this.onDynamicLosUpdate);
                if (this.dbg && this.dbg.console) console.log(`new dynamic map entry for ${de} tracking ${e}`)
            } else if (!this.dynamicMap[de.gid].includes(e)) {
                this.dynamicMap[de.gid].push(e);
                if (this.dbg && this.dbg.console) console.log(`update dynamic map entry for ${de} tracking ${e}`)
            }
            if (!(e.gid in this.dynamicDepMap)) {
                this.dynamicDepMap[e.gid] = [de];
                if (this.dbg && this.dbg.console) console.log(`new dep map entry for ${e} tracking ${de}`)
            } else if (!this.dynamicDepMap[e.gid].includes(de)) {
                this.dynamicDepMap[e.gid].push(de);
                if (this.dbg && this.dbg.console) console.log(`update dep map entry for ${e} tracking ${de}`)
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

        // -- map of dynamic object gid -> array of entities impacted by dynamic object
        
        e.losIdxs = visible;
        this.evt.trigger(this.constructor.evtUpdated, {actor: e});
        if (this.dbg && this.dbg.console) console.log(`${this} set LoS for ${e} to ${visible}`);
    }

}