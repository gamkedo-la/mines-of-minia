export { ProcTemplate };

import { Fmt } from "../base/fmt.js";
import { Util } from "../base/util.js";


class ProcTemplate {
    static dfltFloor = 'floor';
    static dfltWall = 'wall';
    static dfltDoor = 'door';

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
        this.width = this.maxCols*this.unitSize;
        this.height = this.maxRows*this.unitSize;
        this.doorWidth = spec.doorWidth || 1;
        this.minRoomUnits = spec.minRoomUnits || 5;
        this.tileSize = spec.tileSize || 16;
        // -- zed values
        this.bgZed = spec.bgZed || 1;
        this.bgoZed = spec.bgoZed || 2;
        this.fgZed = spec.bgZed || 3;
        this.fgoZed = spec.bgoZed || 4;

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
        this.spawn.door = Util.getpath(spec, 'spawn.door');
        // -- enemy
        this.spawn.enemyList = Util.getpath(spec, 'spawn.enemyList', []);
        this.spawn.enemyLvlOptions = Util.getpath(spec, 'spawn.enemyLvlOptions', [
            { weight: .5, delta: 0 },
            { weight: .25, delta: 1 },
            { weight: .25, delta: -1 },
            { weight: .1, delta: 5 },
        ]);
        this.spawn.enemyRoomOptions = Util.getpath(spec, 'spawn.enemyRoomOptions', [
            { weight: .2, chance: 0 },
            { weight: .6, chance: 1, min: 1, max: 3 },
            { weight: .2, chance: 1, min: 3, max: 7 },
        ]);
        this.spawn.enemyHallOptions = Util.getpath(spec, 'spawn.enemyHallOptions', [
            { weight: .5, chance: 0 },
            { weight: .5, chance: 1, min: 1, max: 2 },
        ]);
        //this.spawn.roomSpawnChance = Util.getpath(spec, 'spawn.roomSpawnChance', .5);
        // -- traps
        this.spawn.trapList = Util.getpath(spec, 'spawn.trapList', []);
        this.spawn.roomTrapOptions = Util.getpath(spec, 'spawn.roomTrapOptions', [
            { weight: .25, chance: 0 },
            { weight: .5, chance: 1, min: 1, max: 2 },
            { weight: .25, chance: 1, min: 3, max: 7 },
        ]);
        this.spawn.hallTrapOptions = Util.getpath(spec, 'spawn.hallTrapOptions', [
            { weight: .5, chance: 0 },
            { weight: .5, chance: 1, min: 1, max: 2 },
        ]);
        // -- growth
        this.spawn.growth = Util.getpath(spec, 'spawn.growth');
        // -- sample period for noise function
        this.spawn.growthNoisePeriod = Util.getpath(spec, 'spawn.growthNoisePeriod', 2);
        // -- sample pct for noise function
        this.spawn.growthNoisePct = Util.getpath(spec, 'spawn.growthNoisePct', 0);
        this.spawn.growthFreePct = Util.getpath(spec, 'spawn.growthFreePct', 0);
        // -- clutter
        this.spawn.clutter = Util.getpath(spec, 'spawn.clutter');
        this.spawn.clutterFreePct = Util.getpath(spec, 'spawn.clutterFreePct', .05);

    }
}