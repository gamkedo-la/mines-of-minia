export { Level };

import { Direction } from "./base/dir.js";
import { Fmt } from "./base/fmt.js";
import { Mathf } from "./base/math.js";
import { Pathfinder } from "./base/pathfinder.js";
import { UxGrid } from "./base/uxGrid.js";
import { Vect } from "./base/vect.js";
import { LevelGraph } from "./lvlGraph.js";

class Level extends UxGrid {
    // STATIC VARIABLES ----------------------------------------------------
    static updateOnMouse = true;
    static dfltTileSize = 16;
    static dfltFoWColor = 'rgba(31,31,63,.5)';

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        if (!spec.renderFilter) spec.renderFilter = (idx, view) => {
            if (!this.losEnabled) return true;
            if (this.fowIdxs.includes(view.idx)) return true;
            if (this.fowIdxs.includes(idx)) return true;
            //if (this.losIdxs.includes(view.idx)) return true;
            return false;
        }
    }
    cpost(spec) {
        super.cpost(spec);
        this.tileSize = spec.tileSize || this.constructor.dfltTileSize;
        // -- fog-of-war indices (these are level indices the player has seen)
        this.fowIdxs = [];
        // -- fow masks (for indices at the edge of fog of war, identify what bits should be rendered)
        this.fowMasks = {};
        // -- line-of-sight indices (these are level indices the player currently can see)
        this.losIdxs = [];
        // -- reserved indices
        this.rsvIdxs = [];
        this.fowColor = spec.fowColor || this.constructor.dfltFoWColor;
        this.fowEnabled = spec.hasOwnProperty('fowEnabled') ? spec.fowEnabled : true;
        this.losEnabled = spec.hasOwnProperty('losEnabled') ? spec.losEnabled : true;
        this.graph = new LevelGraph({ lvl: this });
        this.pathfinder = new Pathfinder({
            graph: this.graph,
            heuristicFcn: this.idxdist.bind(this),
            dbg: false,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onResized(evt) {
        // compute current bounds, copare against grid bounds...
        let bounds = this.xform.bounds;
        if (!bounds.equals(this.grid.bounds)) {
            let cols = Math.round(bounds.width/this.tileSize);
            let rows = Math.round(bounds.height/this.tileSize);
            this.grid.resize(bounds, cols, rows);
        }
        // uxgrid resize
        super.onResized(evt);
    }

    onMouseClicked(evt) {
        super.onMouseClicked(evt);
        console.log(`lvl: ${this} clicked: ${Fmt.ofmt(evt)}`);
        // convert mouse position to local
        let lmouse = this.xform.getLocal(new Vect(evt.mouse.x, evt.mouse.y));
        let idx = this.grid.idxfromxy(lmouse.x, lmouse.y);
        console.log(`local: ${lmouse} idx: ${idx} values: ${Array.from(this.findidx(idx))}`);
    }

    // METHODS -------------------------------------------------------------

    idxfromdir(idx, dir) {
        return this.grid.idxfromdir(idx, dir);
    }

    idxfromxy(idx, x, y) {
        return this.grid.idxfromxy(idx, x, y);
    }

    idxfromij(idx, i, j) {
        return this.grid.idxfromij(idx, i, j);
    }

    ifromidx(idx) {
        return this.grid.ifromidx(idx);
    }
    jfromidx(idx) {
        return this.grid.jfromidx(idx);
    }

    xfromidx(idx, center) {
        return this.grid.xfromidx(idx, center);
    }
    yfromidx(idx, center) {
        return this.grid.yfromidx(idx, center);
    }
    vfromidx(idx, center) {
        return new Vect(this.grid.xfromidx(idx, center), this.grid.yfromidx(idx, center));
    }

    idxdist(idx1, idx2) {
        let dx = this.xfromidx(idx1)-this.xfromidx(idx2);
        let dy = this.yfromidx(idx1)-this.yfromidx(idx2);
        return Math.sqrt(dx*dx+dy*dy);
    }

    checkAdjacentIdx(idx1, idx2) {
        for (const dir of Direction.all) {
            if (this.idxfromdir(idx1, dir) === idx2) return true;
        }
        return false;
    }

    checkIdxIntersectSegment(idx, x1, y1, x2, y2) {
        let i = this.grid.ifromidx(idx);
        let j = this.grid.jfromidx(idx);
        let bminx = i*this.tileSize;
        let bmaxx = (i+1)*this.tileSize;
        let bminy = j*this.tileSize;
        let bmaxy = (j+1)*this.tileSize;
        return Mathf.checkIntersectRectSegment(bminx, bminy, bmaxx, bmaxy, x1, y1, x2, y2);
    }

    *idxsInRange(idx, range) {
        let ci = this.ifromidx(idx);
        let cj = this.jfromidx(idx);
        let rv = Math.round(range/this.tileSize);
        let mini = Math.max(ci-rv,0);
        let maxi = Math.min(ci+rv,this.grid.cols);
        let minj = Math.max(cj-rv,0);
        let maxj = Math.min(cj+rv,this.grid.rows);
        //console.log(`i: ${mini},${maxi} j: ${minj},${maxj}`);
        for (let i=mini; i<=maxi; i++) {
            for (let j=minj; j<=maxj; j++) {
                let oidx = this.idxfromij(i,j);
                let d = this.idxdist(idx, oidx);
                if (d<=range) yield oidx;
            }
        }
    }

    *findidx(idx, filter=(v)=>true) {
        yield *this.grid.findgidx(idx, (v) => (idx === v.idx && filter(v)));
    }

    someAdjacent(idx, filter=(v)=>true) {
        for (const dir of Direction.all) {
            let aidx = this.idxfromdir(idx, dir);
            let adjacent = false;
            for (const other of this.grid.findgidx(aidx, (v) => (aidx === v.idx && filter(v)))) return true;
        }
        return false;
    }

    anyidx(idx, filter=(v)=>true) {
        let found = Array.from(this.grid.findgidx(idx, (v) => (idx === v.idx && filter(v))));
        return found.length !== 0;
    }

    fowidx(idx) {
        if (!this.fowEnabled) return true;
        return (this.fowIdxs.includes(idx));
    }

    fowmask(idx) {
        if (!this.fowEnabled) return Direction.diagonal;
        return (this.fowMasks[idx] || 0);
    }

    reserveIdx(idx) {
        if (!this.rsvIdxs.includes(idx)) {
            this.rsvIdxs.push(idx);
        }
    }

    isIdxReserved(idx) {
        return this.rsvIdxs.includes(idx);
    }

    releaseIdx(idx) {
        let i = this.rsvIdxs.indexOf(idx);
        if (i !== -1) {
            this.rsvIdxs.splice(i, 1);
        }
    }

    updateLoS(idxs) {
        if (!this.losEnabled) return;
        //console.log(`updateLoS: ${idxs.sort()}`)
        // iterate through current LoS
        for (const idx of this.losIdxs) {
            // if new index set doesn't include old index, mark index as needing to be rendered
            if (!idxs.includes(idx)) this.gidupdates.add(idx);
        }
        // iterate through new LoS
        let fowUpdates = new Set();
        for (const idx of idxs) {
            // if old index set doesn't include new index...
            if (!this.losIdxs.includes(idx)) {
                this.gidupdates.add(idx);
                if (this.fowEnabled && !this.fowIdxs.includes(idx)) {
                    this.fowIdxs.push(idx);
                    fowUpdates.add(idx);
                    for (const nidx of Direction.all.map((v) => this.idxfromdir(idx, v))) {
                        if (this.fowIdxs.includes(nidx) || this.fowIdxs.includes(this.idxfromdir(nidx, Direction.north))) {
                            this.gidupdates.add(nidx);
                            fowUpdates.add(nidx);
                        }
                    }
                }
            }
        }
        // update fog-of-war masks
        if (this.fowEnabled) {
            //console.log(`fowupdates count: ${fowUpdates.size}`);
            for (const fowidx of fowUpdates) {
                let fowMask = 0;
                if (this.anyidx(fowidx, (v) => v.kind === 'wall' && v.idx === fowidx)) {
                    let walldirs = 0;
                    let fowdirs = 0;
                    for (const dir of Direction.all) {
                        let oidx = this.idxfromdir(fowidx, dir);
                        if (this.anyidx(oidx, (v) => v.kind === 'wall' && v.idx === oidx)) walldirs |= dir;
                        if (this.fowidx(oidx)) fowdirs |= dir;
                    }

                    // bottom-left (southwest)
                    let render = false;
                    switch (walldirs&(Direction.south|Direction.west)) {
                        case Direction.south:
                            render = fowdirs & (Direction.west);
                            break;
                        case Direction.west:
                            render = fowdirs & (Direction.south);
                            break;
                        case Direction.west|Direction.south:
                            render = fowdirs & (Direction.southWest);
                            break;
                        default:
                            render = (fowdirs & (Direction.west|Direction.south));
                            break;
                    }
                    if (render) fowMask |= Direction.southWest;

                    // bottom-right (southeast)
                    switch (walldirs&(Direction.south|Direction.east)) {
                        case Direction.south:
                            render = fowdirs & (Direction.east);
                            break;
                        case Direction.east:
                            render = fowdirs & (Direction.south);
                            break;
                        case Direction.east|Direction.south:
                            render = fowdirs & (Direction.southEast);
                            break;
                        default:
                            render = (fowdirs & (Direction.east|Direction.south));
                            break;
                    }
                    if (render) fowMask |= Direction.southEast;

                    // top-left (northwest)
                    switch (walldirs&(Direction.north|Direction.west)) {
                        case Direction.north:
                            render = fowdirs & (Direction.west);
                            break;
                        case Direction.west:
                            render = fowdirs & (Direction.north);
                            break;
                        case Direction.west|Direction.north:
                            render = fowdirs & (Direction.northWest);
                            break;
                        default:
                            render = (fowdirs & (Direction.west|Direction.north));
                            break;
                    }
                    if (render) fowMask |= Direction.northWest;

                    // top-right (northeast)
                    switch (walldirs&(Direction.north|Direction.east)) {
                        case Direction.north:
                            render = fowdirs & (Direction.east);
                            break;
                        case Direction.east:
                            render = fowdirs & (Direction.north);
                            break;
                        case Direction.east|Direction.north:
                            render = fowdirs & (Direction.northEast);
                            break;
                        default:
                            render = (fowdirs & (Direction.east|Direction.north));
                            break;
                    }
                    if (render) fowMask |= Direction.northEast;
                } else {
                    fowMask = Direction.diagonal;
                }
                this.fowMasks[fowidx] = fowMask;
                //console.log(`setting fowmask[${fowidx}] -> ${fowMask}`);

            }
        }
        this.losIdxs = Array.from(idxs);
    }

    _postrender(ctx) {
        // render fog of war
        if (this.fowEnabled) {
            for (const idx of this.fowIdxs) {
                // skip fog-of-war if in line-of-sight
                if (this.losIdxs.includes(idx)) continue;
                let x = this.xfromidx(idx);
                let y = this.yfromidx(idx);
                ctx.fillStyle = this.fowColor;
                ctx.fillRect(this.xform.minx+x, this.xform.miny+y, this.tileSize, this.tileSize);
            }
        }
    }

}