export { LevelGraph };

import { MoveAction } from './base/actions/move.js';
import { Direction } from './base/dir.js';
import { Events } from './base/event.js';
import { Vect } from './base/vect.js';

class LevelGraph {
    constructor(spec={}) {
        this.lvl = spec.lvl;
    }

    blocks(e, other) {
        let v = (e.blockedBy & other.blocks);
        return v;
    }

    contains(node) {
        if (!this.lvl) return false;
        return true;
    }

    *getNeighbors(e, node) {
        if (!this.lvl) return;
        // look along each direction
        for (const dir of Direction.all) {
            let nidx = this.lvl.idxfromdir(node, dir);
            if (nidx < 0) continue;
            // can't path through reserved indices
            if (this.lvl.isIdxReserved(nidx)) continue;
            // find any objects that might be blocking our path
            let blocked = false;
            for (const other of this.lvl.findidx(nidx, (gzo) => gzo !== e)) {
                // does the other object block pathfinding entity (e)
                if (!this.blocks(e, other)) continue;
                // otherwise... blocked
                blocked = true;
                break;
            }
            if (!blocked) yield nidx;
        }
    }

    getActions(e, target, baseCost, from, to) {
        let actions = [];
        let cost = baseCost;
        let fromv = this.lvl.vfromidx(from, true);
        let tov = this.lvl.vfromidx(to, true);
        // FIXME: ground based move cost?
        cost += Math.round(Vect.dist(fromv, tov)); 
            // anything at target to?
            /*
            let gidx = this.grid.idxfromxy(to.x, to.y);
            for (const obj of this.grid.findgidx(gidx, (gzo) => !gzo.pathfinding && gzo.collider && gzo.collider.blocking && gzo.bypassAction)) {
                actions.push(obj.bypassAction());
            }
            */
        //if (to.extraAction) actions.push(to.extraAction);

        // push move action
        let action = new MoveAction({ 
            x: tov.x, 
            y: tov.y, 
            snap: true, 
            update: { idx: to },
        });
        action.evt.listen(action.constructor.evtStarted, (evt) => this.lvl.reserveIdx(to), Events.once );
        action.evt.listen(action.constructor.evtDone, (evt) => this.lvl.releaseIdx(to), Events.once );
        actions.push(action);
        //actions.push(new UpdateAction({ update: { idx: to }, points: 0}));
        return { 
            from: from, 
            cost: cost,
            actions: actions,
        };
    }
}