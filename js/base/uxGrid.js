export { UxGrid };

import { Fmt } from "./fmt.js";
import { Grid } from "./grid.js";
import { Stats } from "./stats.js";
import { UxView } from "./uxView.js";

class UxGrid extends UxView {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- event handlers
        this.onAdopted = this.onAdopted.bind(this);
        this.onOrphaned = this.onOrphaned.bind(this);
        this.onChildUpdate = this.onChildUpdate.bind(this);
        this.evt.listen(this.constructor.evtAdopted, this.onAdopted);
        this.evt.listen(this.constructor.evtOrphaned, this.onOrphaned);
        this.evt.listen(this.constructor.evtRooted, this.onResized);
        // -- render filter
        this.renderFilter = spec.renderFilter || ((idx, view) => true);
        // -- grid
        this.rows = spec.rows || this.constructor.dfltRows;
        this.cols = spec.cols || this.constructor.dfltCols;
        this.grid = new Grid({
            bounds: this.xform.bounds, 
            //dbg: true, 
            locator: (v) => v.xform.getWorldBounds(false),
            gridSort: (a, b) => (a.z === b.z) ? a.xform.y+a.maxy-(b.xform.y+b.maxy) : a.z-b.z,
        });
        this.gidupdates = new Set();
        // offscreen canvases for rendering
        this.sliceCanvas = document.createElement('canvas');
        this.sliceCtx = this.sliceCanvas.getContext('2d');
        this.gridCanvas = document.createElement('canvas');
        this.gridCtx = this.gridCanvas.getContext('2d');
    }
    destroy(spec) {
        this.evt.ignore(this.constructor.evtAdopted, this.onAdopted);
        this.evt.ignore(this.constructor.evtOrphaned, this.onOrphaned);
        this.evt.ignore(this.constructor.evtRooted, this.onResized);
        super.destroy();
    }

    // EVENT HANDLERS ------------------------------------------------------
    onAdopted(evt) {
        if (evt.actor !== this) return;
        let child = evt.child;
        //console.log(`-----  onAdopted: ${child}`)
        if (!child) return;
        // -- listen for child updates
        child.evt.listen(child.constructor.evtUpdated, this.onChildUpdate)
        // -- add to grid and note grid index updates
        this.grid.add(child);
        let gidx = this.grid.idxof(child);
        //if (child.idx === 6757) console.log(`====> ${child} has idxs: ${gidx}`);
        for (const idx of gidx) this.gidupdates.add(idx);
    }

    onOrphaned(evt) {
        if (evt.actor !== this) return;
        let child = evt.child;
        if (!child) return;
        // -- ignore child updates
        child.evt.ignore(child.constructor.evtUpdated, this.onChildUpdate)
        // -- remove from grid and note grid index updates
        let gidx = this.grid.idxof(child);
        for (const idx of gidx) this.gidupdates.add(idx);
        //console.log(`gid updates ${Array.from(this.gidupdates)}`);
        this.grid.remove(child);
        this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }

    onChildUpdate(evt) {
        Stats.count("UxGrid.onChildUpdate");
        let view = evt.actor;
        if (!this.grid.contains(view)) return;
        //console.error(`-- onChildUpdate: ${Fmt.ofmt(evt)}`);
        // -- keep track of grid indices that need to be rerendered (e.g.: all grid indices associated with updated view before and after rechecking grid)
        let gidx = this.grid.idxof(view);
        for (const idx of gidx) this.gidupdates.add(idx);
        // -- recheck grid to update grid position
        this.grid.recheck(view);
        gidx = this.grid.idxof(view);
        //if (view.idx === 6757) console.log(`====> ${view} has idxs: ${gidx}`);
        for (const idx of gidx) this.gidupdates.add(idx);
        this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }

    onResized(evt) {
        let bounds = this.xform.bounds;
        // grid update
        if (!bounds.equals(this.grid.bounds)) {
            this.grid.resize(bounds, this.grid.cols, this.grid.rows);
        }
        // canvas update
        if (bounds.width !== this.sliceCanvas.width || bounds.height !== this.sliceCanvas.height) {
            this.sliceCanvas.width = bounds.width;
            this.sliceCanvas.height = bounds.height;
            this.gridCanvas.width = bounds.width;
            this.gridCanvas.height = bounds.height;
            for (const gidx of this.grid.keys()) this.gidupdates.add(gidx);
        }
        //console.log(`*** uxGrid on resize: ${Fmt.ofmt(evt)} bounds: ${this.xform.bounds}`);
        super.onResized(evt);
    }

    // METHODS -------------------------------------------------------------

    renderSlice(idx) {
        // everything from the grid "slice" is rendered to an offscreen slice canvas
        let dx = this.grid.xfromidx(idx) - this.grid.minx;
        let dy = this.grid.yfromidx(idx) - this.grid.miny;
        let tx = -this.xform.minx;
        let ty = -this.xform.miny;
        this.sliceCtx.clearRect( dx, dy, this.grid.colSize, this.grid.rowSize );
        //console.log(`slice translate ${tx},${ty}`);
        this.sliceCtx.translate(tx, ty);
        // iterate through all views at given idx
        let rendered = false;
        for (const view of this.grid.getidx(idx)) {
            rendered = true;
            if (this.renderFilter(idx, view)) view.render(this.sliceCtx);
            //console.log(`    >> render ${view} ${this.renderFilter(idx, view)}`);
        }
        this.sliceCtx.translate(-tx, -ty);
        //console.log(`renderSlice: ${idx} dx: ${dx} dy: ${dy} rendered: ${rendered}`);
        // -- resulting slice is rendered to grid canvas
        this.gridCtx.clearRect(dx, dy, this.grid.colSize, this.grid.rowSize);
        //console.log(`drawImage: ${this.xform.minx+dx},${this.xform.miny+dy}`);
        this.gridCtx.drawImage(this.sliceCanvas, 
            dx, dy, this.grid.colSize, this.grid.rowSize, 
            dx, dy, this.grid.colSize, this.grid.rowSize);
    }

    _childrender(ctx) {
        // render any updated slices
        //console.log(`--- child render: ${Array.from(this.gidupdates).sort()}`);
        let gidupdates = Array.from(this.gidupdates);
        this.gidupdates.clear();
        for (const idx of gidupdates) {
            //console.log(`  >> render slice for ${idx}`);
            this.renderSlice(idx);
        }
        //console.log(`--- after renderslices: ${Array.from(this.gidupdates).sort()}`);
        // -- render grid canvas to given context
        if (this.gridCanvas.width && this.gridCanvas.height) {
            ctx.drawImage(this.gridCanvas, 
                0, 0, this.gridCanvas.width, this.gridCanvas.height,
                this.xform.minx, this.xform.miny, this.gridCanvas.width, this.gridCanvas.height);
        }
        if (this.gidupdates.size) this.evt.trigger(this.constructor.evtUpdated, {actor: this});
    }

    _render(ctx) {
        //console.log(`--- uxGrid._render bounds ${this.bounds}`);
        if (this.dbg && this.dbg.viewGrid) this.grid.render(ctx, this.xform.minx, this.xform.miny);
    }

}