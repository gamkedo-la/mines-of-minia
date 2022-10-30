export { Translate };

import { Array2D } from '../base/array2d.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { Prng } from '../base/prng.js';
import { Random } from '../base/random.js';
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
        // -- generate the new level
        let plvl = new ProcLevel({
            index: template.index,
            cols: plvlo.cols,
            rows: plvlo.rows,
        });
        // -- store data
        pstate.plvl = plvl;
        // -- choose critical level path (spawn point, exit point, rooms in between)
        this.chooseCriticalPath(template, pstate);
        // -- noisify level
        this.noisifyFloor(template, pstate);
        if (template.doyield) yield;
        // -- keep track of translated idxs
        let transidxs = [];
        // -- translate rooms
        for (const proom of prooms) {
            this.translateRoom(template, pstate, proom, transidxs);
        }
        // -- translate halls
        for (const phall of phalls) {
            this.translateHall(template, pstate, phall, transidxs);
            //if (template.doyield) yield;
        }
        // yield
        if (template.doyield) yield;
    }

    static sampleFloor(plvlo, pnoise, idx) {
        let i = plvlo.data.ifromidx(idx);
        let j = plvlo.data.jfromidx(idx);
        let sample = pnoise.sample(i,j);
        // -- default to standard floor
        let kind = 'floor';
        if (sample < -.5) {
            kind = 'pit';
        } else if (sample < -.3) {
            kind = 'pitb';
        } else if (sample > .5) {
            kind = 'obs';
        } else if (sample > .3) {
            kind = 'obsb';
        }
        return kind;
    }

    static noisifyFloor(template, pstate) {
        let noise = pstate.pnoise;
        let plvlo = pstate.plvlo;
        let prooms = pstate.prooms || [];
        // is there a boss room
        let bossRoom = prooms.find((v) => v.boss);
        //console.log(`-- bossRoom: ${bossRoom}`);
        // iterate through all floor tiles
        for (let i=0; i<plvlo.data.nentries; i++) {
            // skip noise for boss room
            if (bossRoom && bossRoom.idxs.includes(i)) continue;
            let kind = plvlo.data.getidx(i);
            if (kind === 'floor') {
                let nkind = this.sampleFloor(plvlo, noise, i)
                if (nkind !== 'floor') plvlo.data.setidx(i,nkind);
            }
        }
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
        // -- if boss level, boss room is target room
        // -- chosen from a secondary room that is at minimum number of rooms away
        let best;
        for (let i=0; i<5; i++) {
            // -- look for boss room
            endRoom = prooms.find((v) => v.boss);
            // -- otherwise randomly choose from secondary rooms
            if (!endRoom) endRoom = Prng.choose(secondary);
            let path = ProcRoom.findShortestPath(prooms, startRoom, endRoom);
            if (endRoom.boss || path.length >= minCriticalPath) {
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
        plvl.startIdx = startRoom.cidx;
        plvl.testIdx = plvl.startIdx;
        startRoom.pois.push(plvl.startIdx);
        // choose ending index
        plvl.exitIdx = endRoom.cidx;
        endRoom.pois.push(plvl.exitIdx);
        //console.log(`critical path: ${best}`);

        // FIXME: remove
        /*
        let bossRoom = prooms.find((v) => v.boss);
        if (bossRoom) {
            plvl.testIdx = bossRoom.cidx;
            plvl.startIdx = bossRoom.cidx;
            // pick hall connected to boss room
            for (const phall of phalls) {
                if (phall.connections.includes(bossRoom)) {
                    for (const idx of Prng.shuffle(phall.idxs)) {
                        if (plvl.entities.some((v) => v.idx === idx && v.kind !== 'floor')) continue;
                        plvl.startIdx = idx;
                        break;
                    }
                    if (plvl.startIdx !== bossRoom.cidx) break;
                }
            }
        }
        */

        // FIXME: remove
        /*
        let idx = Array2D.idxfromdir(plvl.startIdx, Direction.north, plvl.cols, plvl.rows);
        idx = Array2D.idxfromdir(idx, Direction.north, plvl.cols, plvl.rows);
        plvl.exitIdx = idx;
        */
    }

    static translateRoom(template, pstate, proom, transidxs) {
        // FIXME: handle different type of room translators here...
        if (proom.boss === 'rock') {
            this.translateRockBossRoom(template, pstate, proom, transidxs);
        } else if (proom.boss === 'bio') {
            this.translateBioBossRoom(template, pstate, proom, transidxs);
        } else {
            this.translateEmptyRoom(template, pstate, proom, transidxs);
        }
    }

    static translateHall(template, pstate, proom, transidxs) {
        // FIXME: handle different type of hall translators here...
        this.translateEmptyRoom(template, pstate, proom, transidxs);
    }

    static makeRoomViable(template, pstate, proom) {
        // pull state
        let plvlo = pstate.plvlo;
        // points of interest... all must be reachable
        let poiIdxs = Array.from(proom.exits);
        poiIdxs = poiIdxs.concat(proom.pois);
        if (poiIdxs.length === 1) {
            poiIdxs.push(proom.cidx);
        }
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

        let dbg = true;
        plvlo.pathfilter = (v) => proom.idxs.includes(v);
        if (poiIdxs.length > 1) {
            // run pathfinding for each point of interest combo of room
            for (let i=0; i<poiIdxs.length-1; i++) {
                for (let j=i+1; j<poiIdxs.length; j++) {
                    let idx1 = poiIdxs[i];
                    let idx2 = poiIdxs[j];
                    // first try solution avoiding pits/obstacles
                    plvlo.pathfilter = (v) => proom.idxs.includes(v) && plvlo.data.getidx(v) !== 'pit' && plvlo.data.getidx(v) !== 'obs';
                    let solution = plvlo.pathfinder.find({}, idx1, idx2);
                    plvlo.pathfilter = (v) => proom.idxs.includes(v);
                    if (!solution) {
                        solution = plvlo.pathfinder.find({}, idx1, idx2);
                        if (solution) {
                            for (const pidx of solution.path) {
                                if (!proom.viablePath.includes(pidx)) proom.viablePath.push(pidx);
                                let kind = plvlo.data.getidx(pidx);
                                if (kind in swap) {
                                    let skind = swap[kind];
                                    plvlo.data.setidx(pidx, skind);
                                }
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
        // -- pull data
        let plvlo = pstate.plvlo;
        let plvl = pstate.plvl || [];
        let tags = {};
        let floorTag = t_spec.hasOwnProperty('floor') ? t_spec['floor'] : 'floor';
        if (proom.critical) {
            tags = {
                floor: 'punk.floor',
                pit: t_spec.hasOwnProperty('pit') ? t_spec['pit'] : 'pit',
                pitb: 'punk.pit.border',
                wall: 'punk.wall',
                door: t_spec.hasOwnProperty('door') ? t_spec['door'] : 'door',
                obs: t_spec.hasOwnProperty('obs') ? t_spec['obs'] : 'obs',
                obsb: 'punk.floor',
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
            // -- back, mid, fore tags and kinds
            let bgTag, bgKind;
            let fgTag, fgKind;
            switch (kind) {
                case 'pit':
                    bgKind = 'pit';
                    bgTag = tags[kind];
                    break;
                case 'pitb':
                    bgKind = 'floor';
                    bgTag = tags[kind];
                    break;
                case 'floor':
                    bgKind = 'floor';
                    bgTag = tags[kind];
                    break;
                case 'wall':
                    fgKind = 'wall';
                    fgTag = tags[kind];
                    break;
                case 'door':
                    bgKind = 'floor';
                    bgTag = tags['floor'];
                    break;
                case 'obs':
                    fgKind = 'wall';
                    fgTag = tags[kind];
                    break;
                case 'obsb':
                    bgKind = 'floor';
                    bgTag = tags[kind];
                    break;
            }
            if (fgTag) {
                plvl.entities.push({
                    cls: 'Tile',
                    kind: fgKind,
                    boss: proom.boss,
                    tileSize: template.tileSize,
                    baseAssetTag: fgTag,
                    idx: idx,
                    z: template.fgZed,
                });
            }
            if (bgTag) {
                plvl.entities.push({
                    cls: 'Tile',
                    kind: bgKind,
                    boss: proom.boss,
                    tileSize: template.tileSize,
                    baseAssetTag: bgTag,
                    idx: idx,
                    z: template.bgZed,
                });
            }
        }
    }

    static translateRockBossRoom(template, pstate, proom, transidxs) {
        let plvl = pstate.plvl || [];
        let plvlo = pstate.plvlo || [];
        // update data for boss room
        // -- find center index
        let ci = plvlo.data.ifromidx(proom.cidx);
        let cj = plvlo.data.jfromidx(proom.cidx);
        // -- update exit
        plvl.exitIdx = plvlo.data.idxfromij(ci, cj-5);
        // -- position walls around exit
        for (const dir of Direction.all) {
            let widx = plvlo.data.idxfromdir(plvl.exitIdx, dir);
            if (dir !== Direction.south) {
                plvlo.data.setidx(widx, 'wall');
            } else {
                plvl.finalDoorIdx = widx;
                plvl.finalDoorFacing = 'ns';
            }
        }
        // run final translation
        this.translateEmptyRoom(template, pstate, proom, transidxs);
    }

    static translateBioBossRoom(template, pstate, proom, transidxs) {
        //console.log(`-- translate bio boss room`);
        let plvl = pstate.plvl || [];
        let plvlo = pstate.plvlo || [];
        // update data for boss room
        // -- find center index
        let ci = plvlo.data.ifromidx(proom.cidx);
        let cj = plvlo.data.jfromidx(proom.cidx);

        // -- update exit
        // -- determine which directions are blocked by entrance to boss room
        let dirMask = Direction.north|Direction.west|Direction.south|Direction.east;
        let bi = plvlo.data.ifromidx(proom.cidx);
        let bj = plvlo.data.jfromidx(proom.cidx);
        for (const other of proom.connections) {
            // find cardinal direction of other
            let oi = plvlo.data.ifromidx(other.cidx);
            let oj = plvlo.data.jfromidx(other.cidx);
            let dir = Direction.cardinalFromXY(oi-bi, oj-bj);
            dirMask &= ~dir;
        }
        // -- pick viable exit
        let exitDir;
        for (const dir of Direction.cardinals) {
            if (dirMask&dir) {
                exitDir = dir;
                break;
            }
        }
        let oi = Direction.asX(exitDir)*6;
        let oj = Direction.asY(exitDir)*6;
        plvl.exitIdx = plvlo.data.idxfromij(ci+oi, cj+oj);
        if (!proom.idxs.includes(plvl.exitIdx)) proom.idxs.push(plvl.exitIdx);
        plvlo.data.setidx(plvl.exitIdx, 'floor');

        // -- position walls around exit
        for (const dir of Direction.all) {
            let widx = plvlo.data.idxfromdir(plvl.exitIdx, dir);
            if (dir !== Direction.opposite(exitDir)) {
                if (!proom.idxs.includes(widx)) proom.idxs.push(widx);
                plvlo.data.setidx(widx, 'wall');
            } else {
                plvlo.data.setidx(widx, 'floor');
                plvl.finalDoorIdx = widx;
                plvl.finalDoorFacing = (exitDir&(Direction.north|Direction.south)) ? 'ns' : 'ew';
            }
        }

        // position pits
        for (const [oi,oj] of [
            [-3,-2], [-2,-3], [-2,-2],
            [-3,2], [-2,3], [-2,2],
            [3,-2], [2,-3], [2,-2],
            [3,2], [2,3], [2,2],
        ]) {
            let idx = plvlo.data.idxfromij(ci+oi, cj+oj);
            plvlo.data.setidx(idx, 'pit');
        }

        // run final translation
        this.translateEmptyRoom(template, pstate, proom, transidxs);
    }

}