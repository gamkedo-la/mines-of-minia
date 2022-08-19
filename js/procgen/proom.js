export { ProcRoom }

import { Fmt } from '../base/fmt.js';
import { UxDbg } from '../base/uxDbg.js';
import { ProcModel } from './pmodel.js';

class ProcRoom extends ProcModel {
    static dfltRoomColor = 'blue';
    static dfltConnColor = 'orange';

    static findShortestPath(rooms, room1, room2) {
        let roomMap = {};
        for (const room of rooms) roomMap[room.cidx] = room;
        let visited = [room1.cidx];
        let q = [];
        let solutions = [];
        // build out initial queue of potential solutions
        for (const conn of room1.connections) {
            visited.push(conn.cidx);
            q.push([conn, room1]);
        }
        // iterate through items in the solution queue
        while (q.length) {
            // pop item from queue
            let candidate = q.shift();
            if (candidate[0] === room2) {
                solutions.push(candidate);
                continue;
            }
            for (const conn of candidate[0].connections) {
                if (!visited.includes(conn.cidx)) {
                    visited.push(conn.cidx);
                    q.push(new Array(conn, ...candidate));
                }
            }
        }
        // find best solution
        let best;
        for (const solution of solutions) {
            if (!best || solution.length<best.length) {
                best = solution;
            }
        }
        return best;
    }

    constructor(spec={}) {
        super(spec);
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.radius = spec.radius || 0;
        this.connections = spec.connections || [];
        this.roomColor = spec.roomColor || this.constructor.dfltRoomColor;
        this.connColor = spec.connColor || this.constructor.dfltConnColor;
        this.primary = spec.hasOwnProperty('primary') ? spec.primary : false;
        this.critical = spec.hasOwnProperty('critical') ? spec.critical : false;
        // keep track of all indices in room that are considered part of viable paths
        // -- i.e.: paths between critical points of interest in room
        this.viablePath = [];
        // all tiles associated with this room
        this.idxs = [];
        // map of connected rooms and the overlapping indices
        this.overlaps = {};
        // edge tiles
        this.edges = [];
        this.pois = [];
        // exit map of exit/door index to adjacent room (ProcRoom)
        this.exits = [];
        this.exitMap = {};
        // center index
        this.cidx = 0;
        // dimensions
        this.cols = 0;
        this.rows = 0;
        this.mini = 0;
        this.maxi = 0;
        this.minj = 0;
        this.maxj = 0;
    }

    addConnection(other) {
        if (!this.connections.includes(other)) {
            this.connections.push(other);
        }
    }

    removeConnection(other) {
        if (this.connections.includes(other)) {
            let idx = this.connections.indexOf(other);
            this.connections.splice(idx, 1);
        }
    }

    setidx(idx, kind) {
        if (!this.idxs.includes(idx)) this.idxs.push(idx);
        if (kind === 'wall' && !this.edges.includes(idx)) this.edges.push(idx);
        //if (kind === 'door' && !this.doors.includes(idx)) this.doors.push(idx);
    }

    clearidx(idx) {
        let i;
        i = this.idxs.indexOf(idx);
        if (i !== -1) this.idxs.splice(i, 1);
        i = this.edges.indexOf(idx);
        if (i !== -1) this.edges.splice(i, 1);
        delete this.exits[idx];
    }

    draw(tag) {
        // room bounds
        UxDbg.drawArc(this.x, this.y, this.radius, { color: this.roomColor, tag:tag });
        // room connections
        for (const conn of this.connections) {
            UxDbg.drawLine(this.x, this.y, conn.x, conn.y, { color: this.connColor, tag:tag });
        }
    }
    
    toString() {
        return Fmt.toString('proom', this.x, this.y, this.radius);
    }

}