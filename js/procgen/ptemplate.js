export { ProcTemplate };

import { Fmt } from "../base/fmt.js";
import { Util } from "../base/util.js";


class ProcTemplate {
    static dfltFloor = 'floor';
    static dfltWall = 'wall';
    static dfltDoor = 'door';

    get width() {
        return this.maxCols*this.unitSize;
    }

    get height() {
        return this.maxRows*this.unitSize;
    }

    constructor(spec={}) {
        // -- generator info
        this.doyield = (spec.hasOwnProperty('doyield')) ? spec.doyield : false;
        this.index = spec.index || 1;
        this.seed = spec.seed || 0;
        this.noiseXScale || .04;
        this.noiseYScale || .05;
        this.dospawn = spec.hasOwnProperty('dospawn') ? SecurityPolicyViolationEvent.dospawn : true;
        // -- level dimensions
        this.maxCols = spec.maxCols || 250;
        this.maxRows = spec.maxRows || 200;
        this.unitSize = spec.unitSize || 4;
        this.doorWidth = spec.doorWidth || 1;
        this.minRoomUnits = spec.minRoomUnits || 5;
        this.tileSize = spec.tileSize || 16;

        // -- main pie generation
        this.pie = {};
        // ---- percent of max rows/cols to be taken up by main pie
        this.pie.sizePct = Util.getpath(spec, 'pie.sizePct', .5);
        // ---- slices/nodes to generate (to be translated to rooms)
        this.pie.nodesMin = Util.getpath(spec, 'pie.nodesMin', 6);
        this.pie.nodesMax = Util.getpath(spec, 'pie.nodesMax', 10);
        // ---- jitter on the size of the slice
        this.pie.nodeJitter = Util.getpath(spec, 'pie.nodeJitter', .4);
        // ---- boolean indicating if a buffer should be added between room slices
        this.pie.nodeBuffer = Util.getpath(spec, 'pie.nodeBuffer', true);
        // ---- buffer min/max pcts (of slice)
        this.pie.nodeBuffMinPct = Util.getpath(spec, 'pie.nodeBuffMinPct', .1);
        this.pie.nodeBuffMaxPct = Util.getpath(spec, 'pie.nodeBuffMaxPct', .25);
        // ---- percent of pie radius at which room (center) may appear
        this.pie.roomRangeMinPct = Util.getpath(spec, 'pie.nodeBuffMaxPct', .5);
        this.pie.roomRangeMaxPct = Util.getpath(spec, 'pie.nodeBuffMaxPct', 1);
        // ---- minimum radius of room (in tile units)
        this.pie.roomMinUnits = Util.getpath(spec, 'pie.roomMinUnits', 5);

        // -- outline
        this.outline = {};
        this.outline.colOverflow = Util.getpath(spec, 'outline.colOverflow', 3);
        this.outline.rowOverflow = Util.getpath(spec, 'outline.rowOverflow', 3);
        this.outline.hallWidth = Util.getpath(spec, 'outline.hallWidth', 3);
        this.outline.minRoomDim = Util.getpath(spec, 'outline.hallWidth', 6);

        // -- satellite rooms
        this.spie = {};
        this.spie.satsMin = Util.getpath(spec, 'spie.satsMin', 2);
        this.spie.satsMax = Util.getpath(spec, 'spie.satsMax', 4);
        this.spie.orbitFactor = Util.getpath(spec, 'spie.orbitFactor', 1.5);
        this.spie.orbitJitter = Util.getpath(spec, 'spie.orbitJitter', .2);
        this.spie.radiusFactor = Util.getpath(spec, 'spie.radiusFactor', .5);
        this.spie.radiusJitter = Util.getpath(spec, 'spie.radiusFactor', .25);
        this.spie.nodesMin = Util.getpath(spec, 'pie.nodesMin', 6);
        this.spie.nodesMax = Util.getpath(spec, 'pie.nodesMax', 10);

        // -- translate
        this.translate = {};
        // -- level-specific tiles
        this.translate.floor = Util.getpath(spec, 'translate.floor', this.constructor.dfltFloor);
        this.translate.wall = Util.getpath(spec, 'translate.wall', this.constructor.dfltWall);
        this.translate.door = Util.getpath(spec, 'translate.door', this.constructor.dfltDoor);
        this.translate.pit = Util.getpath(spec, 'translate.pit');
        this.translate.pitb = Util.getpath(spec, 'translate.pitb');
        this.translate.obs = Util.getpath(spec, 'translate.obs');
        this.translate.obsb = Util.getpath(spec, 'translate.obsb');
        this.translate.doNoise = Util.getpath(spec, 'translate.doNoise', false);
        this.translate.minCriticalPath = Util.getpath(spec, 'translate.minCriticalPath', 5);

        // -- spawn
        this.spawn = {};
        this.spawn.stairsUp = Util.getpath(spec, 'spawn.stairsUp');
        this.spawn.stairsDown = Util.getpath(spec, 'spawn.stairsDown');

    }
}