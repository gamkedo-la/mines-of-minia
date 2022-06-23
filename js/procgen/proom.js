export { ProcRoom, ProcRoomOutline }

import { Array2D } from '../base/array2d.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { UxDbg } from '../base/uxDbg.js';
import { ProcModel } from './pmodel.js';

class ProcRoom extends ProcModel {
    static dfltRoomColor = 'blue';
    static dfltConnColor = 'orange';
    constructor(spec={}) {
        super(spec);
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.radius = spec.radius || 0;
        this.connections = spec.connections || [];
        this.roomColor = spec.roomColor || this.constructor.dfltRoomColor;
        this.connColor = spec.connColor || this.constructor.dfltConnColor;
        // all tiles associated with this room
        this.idxs = [];
        // map of connected rooms and the overlapping indices
        this.overlaps = {};
        // edge tiles
        this.edges = [];
        this.exits = [];
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

    draw(tag) {
        // room bounds
        UxDbg.drawArc(this.x, this.y, this.radius, { color: this.roomColor, tag:tag });
        // room connections
        for (const conn of this.connections) {
            UxDbg.drawLine(this.x, this.y, conn.x, conn.y, { color: this.connColor, tag:tag });
        }
    }
    
    toString() {
        return Fmt.toString('Rsv', this.x, this.y, this.radius);
    }

}

class ProcRoomOutline {
    static dfltRows = 16;
    static dfltCols = 16;
    static _id = 1;
    static get id() {
        return this._id++;
    }
    static tiles = {
        'floor': 'green',
        'wall': 'blue',
        'door': 'red',
        'fill': 'rgba(45,45,45,.5)',
    }
    constructor(spec={}) {
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.tileWidth = spec.tileWidth || 1;
        this.tileHeight = spec.tileHeight || 1;
        this.id = this.constructor.id;
        // -- max level rows
        this.rows = spec.rows || this.dfltRows;
        // -- max level columns
        this.cols = spec.cols || this.dfltCols;
        // -- 2d data array
        this.data = spec.data || new Array2D({cols: this.cols, rows: this.rows});
        this.exits = [];
        this.edges = [];
    }
    toString() {
        return Fmt.toString('Room', this.gid, this.x, this.y, this.cols, this.rows);
    }

    getEdgeDir(idx) {
        let i = this.data.ifromidx(idx);
        let j = this.data.jfromidx(idx);
        for (const dir of Direction.cardinals) {
            if (!this.data.getij(i+Direction.asX(dir), j+Direction.asY(dir))) return dir;
        }
        return 0;
    }

    draw(ctx) {
        for (const [idx,v] of this.data.find((v=>v))) {
            let i=this.data.ifromidx(idx);
            let j=this.data.jfromidx(idx);
            let color = this.constructor.tiles[v] || 'white';
            ctx.fillStyle = color;
            ctx.fillRect(this.x+i*this.tileWidth, this.y+j*this.tileHeight, this.tileWidth, this.tileHeight);
        }
    }

}