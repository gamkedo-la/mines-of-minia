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
        this.dodiscovery = spec.hasOwnProperty('dodiscovery') ? spec.dodiscovery : true;
        this.dospawn = spec.hasOwnProperty('dospawn') ? spec.dospawn : true;
        // -- level dimensions
        this.maxCols = spec.maxCols || 140;
        this.maxRows = spec.maxRows || 100;
        this.unitSize = spec.unitSize || 6;
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
        this.outline.colOverflow = Util.getpath(spec, 'outline.colOverflow', 1);
        this.outline.rowOverflow = Util.getpath(spec, 'outline.rowOverflow', 1);
        this.outline.hallWidth = Util.getpath(spec, 'outline.hallWidth', 3);
        this.outline.minRoomDim = Util.getpath(spec, 'outline.minRoomDim', 6);

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
        this.translate.area = Util.getpath(spec, 'translate.area', 'rock');

        // -- spawn
        this.spawn = {};
        this.spawn.stairsUp = Util.getpath(spec, 'spawn.stairsUp');
        this.spawn.stairsDown = Util.getpath(spec, 'spawn.stairsDown');
        this.spawn.door = Util.getpath(spec, 'spawn.door');
        // -- loot

        this.spawn.enemyLootOptions = Util.getpath(spec, 'spawn.enemyLootOptions', [
            { weight: .5, kind: 'tokens'},
            { weight: .2, kind: 'cog'},
            { weight: .2, kind: 'gem'},
            { weight: .1, kind: 'weapon'},
            { weight: .1, kind: 'reactor'},
            { weight: .1, kind: 'shielding'},
            { weight: .1, kind: 'gadget'},
        ]);

        // -- chests
        this.spawn.chestMin = Util.getpath(spec, 'spawn.chestMin', 1);
        this.spawn.chestMax = Util.getpath(spec, 'spawn.chestMin', 4);
        this.spawn.chestTermRoomPct = Util.getpath(spec, 'spawn.chestTermRoomPct', .5);
        this.spawn.chestRoomPct = Util.getpath(spec, 'spawn.chestRoomPct', .1);
        this.spawn.chestLootOptions = Util.getpath(spec, 'spawn.chestLootOptions', [
            { weight: .5, kind: 'tokens'},
            { weight: .3, kind: 'cog'},
            { weight: .3, kind: 'gem'},
            { weight: .1, kind: 'weapon'},
            { weight: .1, kind: 'reactor'},
            { weight: .1, kind: 'shielding'},
            { weight: .1, kind: 'gadget'},
        ]);

        // -- secrets
        this.spawn.secretRoomMin = Util.getpath(spec, 'spawn.secretRoomMin', 1);
        this.spawn.secretRoomMax = Util.getpath(spec, 'spawn.secretRoomMax', 4);
        this.spawn.secretTermRoomPct = Util.getpath(spec, 'spawn.secretTermRoomPct', .5);
        this.spawn.secretRoomPct = Util.getpath(spec, 'spawn.secretRoomPct', .1);
        this.spawn.secretCacheMin = Util.getpath(spec, 'spawn.secretCacheMin', 1);
        this.spawn.secretCacheMax = Util.getpath(spec, 'spawn.secretCacheMax', 4);

        // -- locked
        this.spawn.lockRoomMin = Util.getpath(spec, 'spawn.lockRoomMin', 1);
        this.spawn.lockRoomMax = Util.getpath(spec, 'spawn.lockRoomMax', 2);
        this.spawn.lockChestPct = Util.getpath(spec, 'spawn.lockChestPct', .6);

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
        this.spawn.trapHiddenPct = Util.getpath(spec, 'spawn.trapHiddenPct', .75);
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
        this.spawn.clutterFreePct = Util.getpath(spec, 'spawn.clutterFreePct', .03);
        // -- machinery
        this.spawn.machineTags = Util.getpath(spec, 'spawn.machineTags', []);
        this.spawn.machineRoomPct = Util.getpath(spec, 'spawn.machineRoomPct', .3);

    }
}