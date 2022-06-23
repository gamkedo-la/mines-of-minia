export { ProcHall };

class ProcHall {

    constructor(spec={}) {
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        // -- a hall connects rooms
        this.connections = spec.connections || [];
        // all tiles associated with this hall
        this.idxs = [];
        // map of connected rooms and the overlapping indices
        //this.overlaps = {};
        // edge tiles
        this.edges = [];
        this.exits = [];
        // door tiles
        this.doors = [];
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

    setidx(idx, kind='floor') {
        if (!this.idxs.includes(idx)) this.idxs.push(idx);
        if (kind === 'wall' && !this.edges.includes(idx)) this.edges.push(idx);
        if (kind === 'door' && !this.doors.includes(idx)) this.doors.push(idx);
    }

    clearidx(idx) {
        let i;
        i = this.idxs.indexOf(idx);
        if (i !== -1) this.idxs.splice(i, 1);
        i = this.edges.indexOf(idx);
        if (i !== -1) this.edges.splice(i, 1);
        idx = this.doors.indexOf(idx);
        if (i !== -1) this.doors.splice(i, 1);
    }

}