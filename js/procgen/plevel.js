export { ProcLevel, ProcLevelOutline };

import { Array2D } from "../base/array2d.js";
import { Direction } from "../base/dir.js";
import { Fmt } from "../base/fmt.js";
import { Pathfinder } from "../base/pathfinder.js";
import { UxDbg } from "../base/uxDbg.js";

class ProcLevel {
    constructor(spec={}) {
        // -- max level rows
        this.rows = spec.rows || this.dfltRows;
        // -- max level columns
        this.cols = spec.cols || this.dfltCols;
        // level entities
        this.entities = [];
    }
}

class ProcLevelGraph {
    constructor(spec={}) {
        this.lvl = spec.lvl;
    }

    contains(idx) {
        return true;
    }

    *getNeighbors(e, node) {
        if (!this.lvl) return;
        // look along each direction
        for (const dir of Direction.all) {
            let nidx = this.lvl.data.idxfromdir(node, dir);
            if (nidx < 0) continue;
            let kind = this.lvl.data.getidx(nidx);
            if (kind === 'wall') continue;
            if (this.lvl.pathfilter && !this.lvl.pathfilter(nidx)) continue;
            //if (kind === 'void') continue;
            //if (kind === 'block') continue;
            // find any objects that might be blocking our path
            yield nidx;
        }
    }

    getActions(e, target, baseCost, from, to) {
        let kind = this.lvl.data.getidx(to);
        let cost = baseCost + 1;
        if (kind === 'void') cost += 9;
        if (kind === 'block') cost += 9;
        return { 
            from: from, 
            cost: cost,
            actions: [],
        };
    }

}

class ProcLevelOutline {
    static dfltRows = 16;
    static dfltCols = 16;
    static _id = 1;
    static get id() {
        return this._id++;
    }
    static blockSwap = {
        'pit': 'pitb',
        'obs': 'obsb',
    }
    static tiles = {
        'floor': 'green',
        'pit': 'black',
        'pitb': 'gray',
        'obs': 'rgba(50,0,50,1)',
        'obsb': 'rgba(150,0,150,1)',
        'wall': 'blue',
        'door': 'red',
        'fill': 'rgba(45,45,45,.5)',
    }
    constructor(spec={}) {
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.unitSize = spec.unitSize || 1;
        this.id = this.constructor.id;
        // -- max level rows
        this.rows = spec.rows || this.dfltRows;
        // -- max level columns
        this.cols = spec.cols || this.dfltCols;
        // -- 2d data array
        this.data = spec.data || new Array2D({cols: this.cols, rows: this.rows});
        // -- spawn index
        this.spawnIdx;
        // -- pathfinder
        this.graph = new ProcLevelGraph({lvl: this});
        this.pathfilter;
        this.pathfinder = new Pathfinder({
            graph: this.graph,
            heuristicFcn: this.idxdist.bind(this),
            dbg: false,
        });
    }
    toString() {
        return Fmt.toString(this.constructor.name, this.gid, this.x, this.y, this.cols, this.rows);
    }

    idxdist(idx1, idx2) {
        let dx = this.data.ifromidx(idx1)-this.data.ifromidx(idx2);
        let dy = this.data.jfromidx(idx1)-this.data.jfromidx(idx2);
        return Math.sqrt(dx*dx+dy*dy);
    }

    getEdgeDir(idx) {
        let i = this.data.ifromidx(idx);
        let j = this.data.jfromidx(idx);
        for (const dir of Direction.cardinals) {
            if (!this.data.getij(i+Direction.asX(dir), j+Direction.asY(dir))) return dir;
        }
        return 0;
    }

    draw(tag) {
        let opts = {
            tag: tag,
            x: this.x,
            y: this.y,
            tileSize: this.unitSize,
            fill: true,
        }
        for (const [idx,v] of this.data.find((v=>v))) {
            let i=this.data.ifromidx(idx);
            let j=this.data.jfromidx(idx);
            opts.color = this.constructor.tiles[v] || 'white';
            UxDbg.drawTile(i, j, opts);
        }
    }

}