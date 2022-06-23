export { Array2D };

import { Direction } from "./dir.js";

class Array2D {
    static dfltCols = 16;
    static dfltRows = 16;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.cols = spec.cols || this.constructor.dfltCols;
        this.rows = spec.rows || this.constructor.dfltRows;
        this.nentries = this.cols * this.rows;
        this.grid = spec.grid || new Array(this.nentries);
    }

    // STATIC METHODS ------------------------------------------------------
    static ifromidx(idx, cols, nentries=undefined) {
        if (idx < 0) return -1;
        if (nentries && idx >= nentries) return -1;
        return idx % cols;
    }

    static jfromidx(idx, cols, nentries=undefined) {
        if (idx < 0) return -1;
        if (nentries && idx >= nentries) return -1;
        return Math.floor(idx/cols);
    }

    static ijfromidx(idx, cols, nentries=undefined) {
        if (idx < 0) return -1;
        if (nentries && idx >= nentries) return -1;
        return [idx % this.cols, Math.floor(idx/this.cols)];
    }

    static idxfromij(i, j, cols, rows) {
        if (i >= cols) return -1;
        if (j >= rows) return -1;
        return i + cols*j;
    }

    static idxfromdir(idx, dir, cols, rows) {
        return this.idxfromij(this.ifromidx(idx, cols) + Direction.asX(dir), this.jfromidx(idx, cols) + Direction.asY(dir), cols, rows);
    }

    // METHODS -------------------------------------------------------------
    // -- index methods
    ifromidx(idx) {
        if (idx < 0) return -1;
        if (idx >= this.nentries) return -1;
        return idx % this.cols;
    }

    jfromidx(idx) {
        if (idx < 0) return -1;
        if (idx >= this.nentries) return -1;
        return Math.floor(idx/this.cols);
    }

    ijfromidx(idx) {
        if (idx < 0) return -1;
        if (idx >= this.nentries) return -1;
        return [idx % this.cols, Math.floor(idx/this.cols)];
    }

    idxfromij(i,j) {
        if (i < 0) return -1;
        if (j < 0) return -1;
        if (i >= this.cols) return -1;
        if (j >= this.rows) return -1;
        return i + this.cols*j;
    }

    idxfromdir(idx, dir) {
        return this.idxfromij(this.ifromidx(idx) + Direction.asX(dir), this.jfromidx(idx) + Direction.asY(dir));
    }

    // -- accessor methods
    getij(i, j) {
        let idx = this.idxfromij(i, j);
        return this.grid[idx];
    }

    getidx(idx) {
        return this.grid[idx];
    }

    setij(i, j, v) {
        let idx = this.idxfromij(i, j);
        this.grid[idx] = v;
    }

    setidx(idx, v) {
        this.grid[idx] = v;
    }

    // -- iterators
    *[Symbol.iterator]() {
        for (let i=0; i<this.nentries; i++) {
            yield *this.grid[i];
        }
    }

    *find(filter=(v) => true) {
        for (let i=0; i<this.nentries; i++) {
            let v = this.grid[i];
            if (filter(v)) yield [i, v];
        }
    }

    // -- resize
    resize(cols, rows, offi=0, offj=0) {
        // re-align data
        let ngrid = new Array(rows*cols);
        for (let i=0; i<cols; i++) {
            for (let j=0; j<rows; j++) {
                let oi = i+offi;
                let oj = j+offj;
                if (oi >= 0 && oi < this.cols && oj >= 0 && oj < this.rows) {
                    let oidx = this.idxfromij(oi, oj);
                    let nidx = this.constructor.idxfromij(i, j, cols, rows);
                    ngrid[nidx] = this.grid[oidx];
                }
            }
        }
        this.grid = ngrid;
        this.nentries = ngrid.length;
        this.rows = rows;
        this.cols = cols;
    }

}