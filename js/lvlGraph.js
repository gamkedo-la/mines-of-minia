export { LevelGraph };

    import { OpenAction } from './actions/open.js';
import { MoveAction } from './base/actions/move.js';
import { Assets } from './base/assets.js';
import { Direction } from './base/dir.js';
import { Events } from './base/event.js';
import { Vect } from './base/vect.js';
import { Door } from './entities/door.js';

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
                // is the other object a locked door?
                if ((other instanceof Door) && other.locked) continue;
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
        let facing = (tov.x > fromv.x) ? Direction.east : (tov.x < fromv.x) ? Direction.west : 0;
        cost += Math.round(Vect.dist(fromv, tov)); 

        // check for a door...
        let door = this.lvl.firstidx(to, (v) => v instanceof Door);
        if (door && door.state === 'close') {
            actions.push( new OpenAction({ target: door }));
        }

        // push move action
        let action = new MoveAction({ 
            x: tov.x, 
            y: tov.y, 
            snap: true, 
            update: { idx: to },
            facing: facing,
            sfx: e.moveSfx,
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