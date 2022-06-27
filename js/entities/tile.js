export { Tile };

import { Assets } from "../base/assets.js";
import { Direction } from "../base/dir.js";
import { Events } from "../base/event.js";
import { Fmt } from "../base/fmt.js";
import { Rect } from "../base/rect.js";
import { MiniaModel } from "./miniaModel.js";

class Tile extends MiniaModel {
    static dfltKind = 'tile';
    static dfltTileSize = 16;

    static get dfltSketch() {
        return new Rect({ width: 16, height: 16, color: 'rgba(255,255,0,.75)' });
    }

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        // -- base tile values
        this.tileSize = spec.tileSize || this.constructor.dfltTileSize;
        this.halfSize = this.tileSize/2;
        this.kind = spec.kind || this.constructor.dfltKind;
        this.baseAssetTag = spec.baseAssetTag || this.constructor.dfltKind;
        // -- level data accessors
        this.anyidx = spec.anyidx || ((v,f) => false);
        this.idxfromdir = spec.idxfromdir || ((idx, dir) => -1);
        this.fowidx = spec.fowidx || ((idx) => true);
        this.fowmask = spec.fowmask || ((idx) => Direction.diagonal);
        // -- update xform
        this.xform.height = (this.kind === 'wall') ? this.halfSize*3 : this.tileSize;
        this.xform.width = this.tileSize;
        this.xform.offy = (this.kind === 'wall') ? -(this.tileSize) : -(this.halfSize);
        this.xform.offx = -(this.halfSize);
        // -- update
        if (this.kind === 'wall' || this.kind === 'pit') {
            this.blocks = this.constructor.block.all;
        } else {
            this.blocks = 0;
        }
        // -- events
        this.onLevelLoaded = this.onLevelLoaded.bind(this);
        Events.listen('lvl.loaded', this.onLevelLoaded, Events.once);

    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        this.computeSketches();
        // FIXME: if tiles are created or destroyed after this, the change will not be reflect
        // -- tie to create/destroy events...
    }

    // METHODS -------------------------------------------------------------
    get neighborMask() {
        let matchDirs = 0;
        for (const dir of Direction.all) {
            let oidx = this.idxfromdir(this.idx, dir);
            if (this.anyidx(oidx, (v) => v.kind === this.kind && v.idx === oidx)) matchDirs |= dir;
        }
        return matchDirs;
    }

    computeSketches() {
        let bltag, brtag;
        let etltag, etrtag, ebltag, ebrtag;
        let mask;
        // evaluate neighbors
        let matchDirs = this.neighborMask;
        // base tile left (d|j|m|o|q|z)
        // edge tile bottom-left (d|j|h|i|z)
        mask = (Direction.west|Direction.south|Direction.southWest);
        switch (matchDirs&mask) {
            case Direction.south:
            case Direction.south|Direction.southWest:
                //bltag = 'd';
                ebltag = 'd';
                break;
            case Direction.west|Direction.south:
                //bltag = 'j';
                ebltag = 'j';
                break;
            case Direction.southWest:
            case Direction.none:
                if (this.kind === 'wall') bltag = 'm';
                ebltag = 'h';
                break;
            case Direction.west:
                if (this.kind === 'wall') bltag = 'o';
                ebltag = 'i';
                break;
            case Direction.west|Direction.southWest:
                if (this.kind === 'wall') bltag = 'q';
                ebltag = 'i';
                break;
            case Direction.west|Direction.south|Direction.southWest:
                //bltag = 'z';
                ebltag = 'z';
                break;
        }
        //console.log(`-- dir: ${matchDirs&mask} bltag: ${bltag}`);
        //console.log(`ebltag: ${ebltag}`);
        // base tile right (e|k|n|o|p|z)
        // edge tile bottom-right (e|k|n|o|p|z)
        mask = (Direction.east|Direction.south|Direction.southEast);
        switch (matchDirs&mask) {
            case Direction.south:
            case Direction.south|Direction.southEast:
                //brtag = 'e';
                ebrtag = 'e';
                break;
            case Direction.east|Direction.south:
                //brtag = 'k';
                ebrtag = 'k';
                break;
            case Direction.southEast:
            case Direction.none:
                if (this.kind === 'wall') brtag = 'p';
                ebrtag = 'l';
                break;
            case Direction.east:
                if (this.kind === 'wall') brtag = 'o';
                ebrtag = 'i';
                break;
            case Direction.east|Direction.southEast:
                if (this.kind === 'wall') brtag = 'n';
                ebrtag = 'i';
                break;
            case Direction.east|Direction.south|Direction.southEast:
                //brtag = 'z';
                ebrtag = 'z';
                break;
        }
        //console.log(`-- dir: ${matchDirs&mask} brtag: ${brtag}`);
        //console.log(`ebrtag: ${ebrtag}`);
        // edge tile top-left (a|b|d|f||z)
        mask = (Direction.west|Direction.north|Direction.northWest);
        switch (matchDirs&mask) {
            case Direction.northWest:
            case Direction.none:
                etltag = 'a';
                break;
            case Direction.west:
            case Direction.west|Direction.northWest:
                etltag = 'b';
                break;
            case Direction.north:
            case Direction.north|Direction.northWest:
                etltag = 'd';
                break;
            case Direction.west|Direction.north:
                etltag = 'f';
                break;
            case Direction.west|Direction.north|Direction.northWest:
                etltag = 'z';
                break;
        }
        //console.log(`-- dir: ${matchDirs&mask} etltag: ${etltag}`);
        // edge tile top-right etrtag (a|b|d|f||z)
        mask = (Direction.east|Direction.north|Direction.northEast);
        switch (matchDirs&mask) {
            case Direction.northEast:
            case Direction.none:
                etrtag = 'c';
                break;
            case Direction.east:
            case Direction.east|Direction.northEast:
                etrtag = 'b';
                break;
            case Direction.north:
            case Direction.north|Direction.northEast:
                etrtag = 'e';
                break;
            case Direction.east|Direction.north:
                etrtag = 'g';
                break;
            case Direction.east|Direction.north|Direction.northEast:
                etrtag = 'z';
                break;
        }
        //console.log(`-- dir: ${matchDirs&mask} etrtag: ${etrtag}`);
        // build out sprites
        if (bltag) {
            let assetTag = `${this.baseAssetTag}.${bltag}`;
            let sketch = Assets.get(assetTag, true) || this.constructor.dfltSketch;
            this._linkSketch('sketchbl', sketch)
        }
        if (brtag) {
            let assetTag = `${this.baseAssetTag}.${brtag}`;
            let sketch = Assets.get(assetTag, true) || this.constructor.dfltSketch;
            this._linkSketch('sketchbr', sketch)
        }
        if (ebltag) {
            let assetTag = `${this.baseAssetTag}.${ebltag}`;
            let sketch = Assets.get(assetTag, true) || this.constructor.dfltSketch;
            this._linkSketch('sketchebl', sketch)
        }
        if (ebrtag) {
            let assetTag = `${this.baseAssetTag}.${ebrtag}`;
            let sketch = Assets.get(assetTag, true) || this.constructor.dfltSketch;
            this._linkSketch('sketchebr', sketch)
        }
        if (etltag) {
            let assetTag = `${this.baseAssetTag}.${etltag}`;
            let sketch = Assets.get(assetTag, true) || this.constructor.dfltSketch;
            this._linkSketch('sketchetl', sketch)
        }
        if (etrtag) {
            let assetTag = `${this.baseAssetTag}.${etrtag}`;
            let sketch = Assets.get(assetTag, true) || this.constructor.dfltSketch;
            this._linkSketch('sketchetr', sketch)
        }

        this.evt.trigger(this.constructor.evtUpdated,{actor: this});

    }

    _render(ctx) {
        // bottom-left
        let render = this.fowmask(this.idx) & Direction.southWest;
        if (render) {
            if (this.sketchbl) this.sketchbl.render(ctx, this.xform.minx, this.xform.miny+this.tileSize);
            if (this.sketchebl) this.sketchebl.render(ctx, this.xform.minx, this.xform.miny+this.halfSize);
        }

        // bottom-right
        render = this.fowmask(this.idx) & Direction.southEast;
        if (render) {
            if (this.sketchbr) this.sketchbr.render(ctx, this.xform.minx+this.halfSize, this.xform.miny+this.tileSize);
            if (this.sketchebr) this.sketchebr.render(ctx, this.xform.minx+this.halfSize, this.xform.miny+this.halfSize);
        }

        // top-left
        if (this.kind === 'ground') {
            render = (this.fowmask(this.idx) & (Direction.northWest|Direction.southWest)) === (Direction.northWest|Direction.southWest);
        } else {
            render = this.fowmask(this.idx) & Direction.northWest;
        }
        if (render) {
            if (this.sketchetl) this.sketchetl.render(ctx, this.xform.minx, this.xform.miny);
        }

        // top-right
        if (this.kind === 'ground') {
            render = (this.fowmask(this.idx) & (Direction.northWest|Direction.southEast)) === (Direction.northWest|Direction.southEast);
        } else {
            render = this.fowmask(this.idx) & Direction.northEast;
        }
        if (render) {
            if (this.sketchetr) this.sketchetr.render(ctx, this.xform.minx+this.halfSize, this.xform.miny);
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.gid, this.tag, this.x, this.y, this.z, this.idx, this.kind);
    }

}