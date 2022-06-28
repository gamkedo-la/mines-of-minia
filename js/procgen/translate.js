export { Translate };

import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { SimpleNoise } from '../base/noise.js';
import { Prng } from '../base/prng.js';
import { UxDbg } from '../base/uxDbg.js';
import { ProcLevel, ProcLevelOutline } from './plevel.js';
import { ProcRoom } from './proom.js';

class Translate {
    static *generator(template, pstate) {
        let t_spec = template.translate || {};
        // -- pull data
        let plvlo = pstate.plvlo;
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        // -- initialize noise generator
        let pnoise = new SimpleNoise({
            seed: template.seed,
            scalex: t_spec.noiseXScale || .04,
            scaley: t_spec.noiseYScale || .05,
        });
        // -- generate the new level
        let plvl = new ProcLevel({
            cols: plvlo.cols,
            rows: plvlo.rows,
        });
        // -- store data
        pstate.pnoise = pnoise;
        pstate.plvl = plvl;
        // -- choose critical level path
        this.chooseCriticalPath(template, pstate);
        // -- keep track of translated idxs
        let transidxs = [];
        // -- translate rooms
        for (const proom of prooms) {
            this.translateRoom(template, pstate, proom, transidxs);
        }
        // -- translate halls
        for (const phall of phalls) {
            //console.log(`translate hall: ${phall.cidx}`);
            this.translateHall(template, pstate, phall, transidxs);
            //if (template.doyield) yield;
        }
        // -- pick spawn point
        let proom = Prng.choose(prooms);
        plvl.spawnIdx = proom.cidx;
        // yield
        if (template.doyield) yield;
    }

    static chooseCriticalPath(template, pstate) {
        // -- pull data
        let t_spec = template.translate || {};
        let minCriticalPath = t_spec.minCriticalPath || 5;
        let plvl = pstate.plvl;
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        // -- choose starting room
        // -- starting room will be chosen from primary rooms (rooms in the inner circle)
        let primary = [];
        let secondary = [];
        for (const proom of prooms) {
            if (proom.primary) {
                primary.push(proom);
            } else {
                secondary.push(proom);
            }
        }
        let startRoom = Prng.choose(primary);
        let endRoom;
        // -- choose target room
        // -- target room will be where the stairs up are
        // -- chosen from a secondary room that is at minimum number of rooms away
        let best;
        for (let i=0; i<5; i++) {
            endRoom = Prng.choose(secondary);
            let path = ProcRoom.findShortestPath(prooms, startRoom, endRoom);
            console.log(`try startRoom: ${startRoom} endRoom: ${endRoom} path: ${path}`);
            if (path.length >= minCriticalPath) {
                best = path;
                break;
            } else {
                if (!best || path.length > best.length) best = path;
            }
        }
        // mark rooms along path as critical
        for (const room of best) {
            room.critical = true;
        }
        // mark halls along path as critical
        for (const hall of phalls) {
            hall.critical = hall.connections.every((v)=>v.critical);
        }
        // choose starting index
        plvl.spawnIdx = startRoom.cidx;
        startRoom.pois.push(plvl.spawnIdx);
        // choose ending index
        plvl.exitIdx = endRoom.cidx;
        endRoom.pois.push(plvl.exitIdx);
        console.log(`critical path: ${best}`);
    }

    static translateRoom(template, pstate, proom, transidxs) {
        // FIXME: handle different type of hall translators here...
        this.translateEmptyRoom(template, pstate, proom, transidxs);
    }

    static translateHall(template, pstate, proom, transidxs) {
        // FIXME: handle different type of room translators here...
        this.translateEmptyRoom(template, pstate, proom, transidxs);
    }

    static makeRoomViable(template, pstate, proom) {
        // pull state
        let plvlo = pstate.plvlo;
        // points of interest... all must be reachable
        let poiIdxs = new Array(...proom.exits, ...proom.pois);
        let swap = ProcLevelOutline.blockSwap;

        // ensure each point of interest has floor immediately around it
        for (let i=0; i<poiIdxs.length; i++) {
            let pidx = poiIdxs[i];
            for (const dir of Direction.all) {
                let nidx = plvlo.data.idxfromdir(pidx, dir);
                let nkind = plvlo.data.getidx(nidx);
                if (nkind !== 'wall' && nkind !== 'door') {
                    plvlo.data.setidx(nidx, 'floor');
                }
            }
        }

        let dbg = false;
        plvlo.pathfilter = (v) => proom.idxs.includes(v);
        if (poiIdxs.length > 1) {
            // run pathfinding for each point of interest combo of room
            for (let i=0; i<poiIdxs.length-1; i++) {
                for (let j=i+1; j<poiIdxs.length; j++) {
                    let idx1 = poiIdxs[i];
                    let idx2 = poiIdxs[j];
                    let solution = plvlo.pathfinder.find({}, idx1, idx2);
                    //console.log(`${idx1} to ${idx2} ${solution.path}`);
                    if (dbg) console.log(`${idx1} to ${idx2} ${Array.from(solution.path.map((v) => `${v}:${plvlo.data.getidx(v)}`))}`);
                    for (const pidx of solution.path) {
                        let kind = plvlo.data.getidx(pidx);
                        if (kind in swap) {
                            let skind = swap[kind];
                            plvlo.data.setidx(pidx, skind);
                            for (const dir of Direction.all) {
                                let nidx = plvlo.data.idxfromdir(pidx, dir);
                                let nkind = plvlo.data.getidx(nidx);
                                if (nkind in swap) plvlo.data.setidx(nidx, swap[nkind]);
                            }
                        }
                    }
                }
            }
        }
        plvlo.pathfilter = null;

    }

    static translateEmptyRoom(template, pstate, proom, transidxs) {
        let t_spec = template.translate || {};
        let floor = t_spec.floor || 'floor';
        let wall = t_spec.wall || 'wall';

        // -- pull data
        let plvlo = pstate.plvlo;
        let plvl = pstate.plvl || [];

        //console.log(`proom: ${proom.cidx}`);
        let tags = {};
        let floorTag = t_spec.hasOwnProperty('floor') ? t_spec['floor'] : 'floor';
        if (proom.critical) {
            // FIXME
            /*
            for (const idx of proom.idxs) {
                let kind = plvlo.data.getidx(idx);
                if (kind !== 'wall') {
                    plvlo.data.setidx(idx, 'obsb');
                }
            }
            */
            tags = {
                floor: floorTag,
                pit: t_spec.hasOwnProperty('pit') ? t_spec['pit'] : 'pit',
                pitb: t_spec.hasOwnProperty('pitb') ? t_spec['pitb'] : floorTag,
                wall: t_spec.hasOwnProperty('wall') ? t_spec['wall'] : 'wall',
                door: t_spec.hasOwnProperty('door') ? t_spec['door'] : 'door',
                obs: t_spec.hasOwnProperty('obs') ? t_spec['obs'] : 'obs',
                obsb: t_spec.hasOwnProperty('obsb') ? t_spec['obsb'] : floorTag,
            };
        } else {
            tags = {
                floor: floorTag,
                pit: t_spec.hasOwnProperty('pit') ? t_spec['pit'] : 'pit',
                pitb: t_spec.hasOwnProperty('pitb') ? t_spec['pitb'] : floorTag,
                wall: t_spec.hasOwnProperty('wall') ? t_spec['wall'] : 'wall',
                door: t_spec.hasOwnProperty('door') ? t_spec['door'] : 'door',
                obs: t_spec.hasOwnProperty('obs') ? t_spec['obs'] : 'obs',
                obsb: t_spec.hasOwnProperty('obsb') ? t_spec['obsb'] : floorTag,
            };
        }

        // make sure room is viable
        this.makeRoomViable(template, pstate, proom);

        // iterate through room indices
        for (const idx of proom.idxs) {
            // index check... this ensures that an index will not get translated twice (e.g.: if a room overlaps w/ a hall, etc);
            if (transidxs.includes(idx)) continue;
            transidxs.push(idx);

            let kind = plvlo.data.getidx(idx);
            let byFloor = Direction.all.some((v) => plvlo.data.getidx(plvlo.data.idxfromdir(idx, v)) === 'floor');

            if (idx === 5934) console.log(`${idx} has kind: ${kind}`)

            // -- back, mid, fore tags and kinds
            let bgTag, bgKind;
            let mgTag, mgKind;
            let fgTag, fgKind;
            switch (kind) {
                case 'pit':
                    bgKind = 'pit';
                    bgTag = tags[kind];
                    /*
                    if (byFloor) {
                        mgKind = 'floor';
                        mgTag = floorTag;
                    }
                    */
                    break;
                case 'pitb':
                    bgKind = 'floor';
                    bgTag = tags[kind];
                    /*
                    if (byFloor && bgTag !== floorTag) {
                        mgKind = 'floor';
                        mgTag = floorTag;
                    }
                    */
                    break;
                case 'floor':
                    mgKind = 'floor';
                    mgTag = floorTag;
                    break;
                case 'wall':
                    fgKind = 'wall';
                    fgTag = tags[kind];
                    /*
                    if (byFloor) {
                        mgKind = 'floor';
                        mgTag = floorTag;
                    }
                    */
                    break;
                case 'door':
                    // FIXME
                    mgKind = 'floor';
                    mgTag = t_spec.hasOwnProperty('floor') ? t_spec['floor'] : 'floor';
                    break;
                case 'obs':
                    fgKind = 'wall';
                    fgTag = tags[kind];
                    //mgKind = 'floor';
                    //mgTag = tags['obsb'];
                    /*
                    if (byFloor) {
                        mgKind = 'floor';
                        mgTag = floorTag;
                    }
                    */
                    break;
                case 'obsb':
                    mgKind = 'floor';
                    mgTag = tags[kind];
                    /*
                    if (byFloor && fgTag !== floorTag) {
                        mgKind = 'floor';
                        mgTag = floorTag;
                    }
                    */
                    break;
            }

            if (idx === 5934) console.log(`${idx} has kind: ${kind} tags: ${fgTag} ${mgTag} ${bgTag}`);

            if (fgTag) {
                plvl.entities.push({
                    cls: 'Tile',
                    kind: fgKind,
                    tileSize: template.tileSize,
                    baseAssetTag: fgTag,
                    idx: idx,
                    z: 2,
                });
            }

            if (mgTag) {
                plvl.entities.push({
                    cls: 'Tile',
                    kind: mgKind,
                    tileSize: template.tileSize,
                    baseAssetTag: mgTag,
                    idx: idx,
                    z: 1,
                });
            }

            if (bgTag) {
                plvl.entities.push({
                    cls: 'Tile',
                    kind: bgKind,
                    tileSize: template.tileSize,
                    baseAssetTag: bgTag,
                    idx: idx,
                    z: 0,
                });
            }


            /*
            // add floor tile
            let x_ground = {
                cls: 'Tile',
                kind: 'ground',
                tileSize: template.tileSize,
                baseAssetTag: floor,
                idx: idx,
                z: 0,
            };
            plvl.entities.push(x_ground);

            // add wall tile
            if (plvlo.data.getidx(idx) === 'wall') {
                let x_wall = {
                    cls: 'Tile',
                    kind: 'wall',
                    tileSize: template.tileSize,
                    baseAssetTag: wall,
                    idx: idx,
                    z: 1,
                };
                plvl.entities.push(x_wall);
            }

            // add door tile 
            if (plvlo.data.getidx(idx) === 'door') {
                let byDoor = Direction.all.some((v) => doorIdxs.includes(plvlo.data.idxfromdir(idx, v)));
                if (!byDoor) doorIdxs.push(idx);
            }
            // FIXME
            */
        }


    }

}