export { Outline };

import { Direction } from '../base/dir.js';
import { Mathf } from '../base/math.js';
import { Prng } from '../base/prng.js';
import { Util } from '../base/util.js';
import { UxDbg } from '../base/uxDbg.js';
import { ProcLevelOutline } from './plevel.js';
import { ProcRoom } from './proom.js';

class Outline {

    static *generator(template, pstate) {
        // -- generate level outline
        yield *this.levelGenerator(template, pstate);
        // -- carve the rooms into the level
        yield *this.roomsGenerator(template, pstate);
        // -- carve the halls between rooms
        yield *this.hallsGenerator(template, pstate);
    }

    static validate(template, pstate) {
        let plvlo = pstate.plvlo;
        let valid = true;
        // validate that each floor tile is not adjacent to fill
        for (const [idx,kind] of plvlo.data.find((v) => v === 'floor')) {
            for (const dir of Direction.all) {
                let nidx = plvlo.data.idxfromdir(idx, dir);
                if (nidx !== -1) {
                    let nkind = plvlo.data.getidx(nidx);
                    if (nkind === 'fill') {
                        console.log(`--- invalid level: floor tile ${idx} adjacent to fill ${nidx}`);
                        valid = false;
                        break;
                    }
                }
            }
        }
        return valid;
    }

    static sampleFloor(plvlo, pnoise, idx) {
        let i = plvlo.data.ifromidx(idx);
        let j = plvlo.data.jfromidx(idx);
        let sample = pnoise.sample(i,j);
        //let sample2 = pnoise.sample(i+plvlo.cols,j);
        let sample2 = pnoise.sample(i+plvlo.cols,j+plvlo.rows);
        // -- default to standard floor
        let kind = 'floor';

        if (sample < -.8) {
            kind = 'pit';
        } else if (sample < -.6) {
            kind = 'pitb';
        } else if (sample > .8) {
            kind = 'obs';
        } else if (sample > .6) {
            kind = 'obsb';
        }
        return kind;
    }

    static *levelGenerator(template, pstate) {
        let o_spec = template.outline || {};
        let rooms = pstate.prooms || [];
        let buffer = o_spec.buffer || 8;
        let unitSize = template.unitSize || 1;
        let fill = o_spec.fill || 'fill';
        // -- find min/max dimensions from all rooms
        let lminx = rooms[0].x-rooms[0].radius;
        let lminy = rooms[0].y-rooms[0].radius;
        let lmaxx = rooms[0].x+rooms[0].radius;
        let lmaxy = rooms[0].y+rooms[0].radius;
        for (const room of rooms) {
            let rminx = room.x-room.radius;
            let rminy = room.y-room.radius;
            let rmaxx = room.x+room.radius;
            let rmaxy = room.y+room.radius;
            if (rminx < lminx) lminx = rminx;
            if (rminy < lminy) lminy = rminy;
            if (rmaxx > lmaxx) lmaxx = rmaxx;
            if (rmaxy > lmaxy) lmaxy = rmaxy;
        }
        let x = Mathf.floorTo(lminx,unitSize) - buffer*unitSize;
        let y = Mathf.floorTo(lminy,unitSize) - buffer*unitSize;
        let cols = Math.floor((lmaxx-lminx)/unitSize) + 1 + buffer*2;
        let rows = Math.floor((lmaxy-lminy)/unitSize) + 1 + buffer*2;
        //console.log(`pos: ${x},${y} dim: ${cols},${rows}`);
        let outline = new ProcLevelOutline({
            x: x,
            y: y,
            rows: rows,
            cols: cols,
            unitSize: unitSize,
        });
        for (let i=0; i<outline.data.nentries; i++) {
            outline.data.setidx(i, fill);
        }
        // store outline
        pstate.plvlo = outline;
        if (template.doyield) yield;
    }

    static *roomsGenerator(template, pstate) {
        let o_spec = template.outline || {};
        // pull level outline
        let lvl = pstate.plvlo;
        let noise = pstate.pnoise;
        // pull rooms
        let prooms = pstate.prooms;
        for (const proom of prooms) {
            this.carveRoomOutline(template, lvl, noise, proom, o_spec);
        }
        if (template.doyield) yield;
    }

    static *hallsGenerator(template, pstate) {
        let o_spec = template.outline || {};
        // pull level outline
        let lvl = pstate.plvlo;
        let noise = pstate.pnoise;
        // pull rooms
        let prooms = pstate.prooms;
        let phalls = [];

        let visited = {};
        // iterate through rooms
        for (const room of prooms) {
            // check connections
            for (const conn of room.connections) {
                // check if connection has already been visited
                let minidx = Math.min(room.cidx, conn.cidx);
                let maxidx = Math.max(room.cidx, conn.cidx);
                if (minidx in visited && visited[minidx].includes(maxidx)) continue;
                // otherwise... mark as visited
                let vlist = visited[minidx];
                if (!vlist) {
                    vlist = [];
                    visited[minidx] = vlist;
                }
                vlist.push(maxidx);
                // process connection
                let phall = this.carveHall(lvl, noise, room, conn, o_spec);
                phalls.push(phall);
            }
        }
        // store halls
        pstate.phalls = phalls;
        if (template.doyield) yield;
    }

    static carveRoomOutline(template, lvl, noise, room, spec={}) {
        let schemes = spec.schemes || [
            {weight: .75, minWidthPct: .4, minHeightPct: .4},
            {weight: .25, minWidthPct: .2, minHeightPct: .2},
        ]
        let colOverflow = spec.colOverflow || 0;
        let rowOverflow = spec.rowOverflow || 0;
        let minRoomDim = spec.minRoomDim || 4;
        let totalWeight = schemes.reduce((acc, cv) => acc + cv.weight, 0);
        let weight = Prng.range(0, totalWeight);
        // pick room scheme based on weight
        let scheme = schemes[schemes.length-1];
        for (let i=0, acc=0; i<schemes.length; acc += schemes[i].weight, i++) {
            if (weight < schemes[i].weight+acc) {
                scheme = schemes[i];
                break;
            }
        }
        let hyp = room.radius*2;
        // compute room dimensions in x,y and i,j
        let unitSize = template.unitSize || 1;
        let minWidth = Math.max(minRoomDim*unitSize, Math.round(scheme.minWidthPct*hyp));
        let minHeight = Math.max(minRoomDim*unitSize, Math.round(scheme.minHeightPct*hyp));
        let minLeg = Math.min(minWidth, minHeight);
        let maxWidth = Math.floor(Math.sqrt(hyp*hyp - minLeg*minLeg));
        let maxHeight = Math.floor(Math.sqrt(hyp*hyp - minLeg*minLeg));
        // width/height of outline must fit within ProcRoom radius
        let x = room.x-lvl.x;
        let y = room.y-lvl.y;
        let width = Prng.rangeInt(minWidth,maxWidth);
        let height = Mathf.clamp(Math.floor(Math.sqrt(hyp*hyp - (width)*(width))), minHeight, maxHeight);
        room.cols = Math.floor(width/unitSize) + colOverflow;
        room.rows = Math.floor(height/unitSize) + rowOverflow;
        room.mini = Math.floor(x/unitSize-room.cols/2);
        room.minj = Math.floor(y/unitSize-room.rows/2);
        room.maxi = room.mini+room.cols;
        room.maxj = room.minj+room.rows;
        room.cidx = lvl.data.idxfromij(Math.floor(x/unitSize), Math.floor(y/unitSize));
        // carve
        for (let i=room.mini; i<=room.maxi; i++) {
            for (let j=room.minj; j<=room.maxj; j++) {
                let idx = lvl.data.idxfromij(i,j);
                // detect edge
                let isEdge = (i===room.mini || j===room.minj || i===room.maxi || j===room.maxj);
                let floorv = this.sampleFloor(lvl, noise, idx);
                let v = (isEdge) ? 'wall': floorv;
                // detect overlap with another room
                let ov = lvl.data.getidx(idx);
                if (ov !== 'fill') {
                    let overlapRoom;
                    // find which room we are overlapping with (assumes one that we are connected with)
                    for (overlapRoom of room.connections) if (overlapRoom.idxs.includes(idx)) break;
                    if (overlapRoom) {
                        Util.getOrAssign(room.overlaps, overlapRoom.cidx).push(idx);
                        Util.getOrAssign(overlapRoom.overlaps, room.cidx).push(idx);
                    }
                    // handle overlap data
                    if (ov !== 'wall') v = floorv;
                }
                // set data for room
                // -- level data
                lvl.data.setidx(idx,v);
                // -- add room index
                room.idxs.push(idx);
                // -- add edge index
                if (isEdge) room.edges.push(idx);
            }
        }
    }

    static carveHall(lvl, noise, r1, r2, spec={}) {

        let hallWidth = spec.hallWidth || 1;
        let r1doorWidth = spec.doorWidth || 1;
        let r2doorWidth = spec.doorWidth || 1;

        UxDbg.drawLine(r1.x, r1.y, r2.x, r2.y, { color: 'aqua'})

        let [r1midi, r1midj] = lvl.data.ijfromidx(r1.cidx);
        let [r2midi, r2midj] = lvl.data.ijfromidx(r2.cidx);
        let ioverlap = Mathf.overlap(r1.mini, r1.maxi, r2.mini, r2.maxi);
        let joverlap = Mathf.overlap(r1.minj, r1.maxj, r2.minj, r2.maxj);

        let x = (r1.x+r2.x)/2;
        let y = (r1.y+r2.y)/2;

        let r1door = 'door';
        let r2door = 'door';
        let r1port, r1dir;
        let r2port, r2dir;

        // create proc hall instance
        let phall = new ProcRoom({
            x: x,
            y: y,
        });
        // halls are connected to rooms
        phall.addConnection(r1);
        phall.addConnection(r2);

        // check for overlapping room
        if (r2.cidx in r1.overlaps) {
            //ctx.strokeStyle = this.dbgColor;
            //ctx.strokeRect(lvl.x + r1.mini*lvl.tileSize, lvl.y + r1.minj*lvl.tileSize, r1.cols*lvl.tileSize, r1.rows*lvl.tileSize);
            //console.log(`  exception: handle overlap`);
            // turn overlap area into hallway
            // -- overlap region becomes floor
            let overlaps = r1.overlaps[r2.cidx];
            for (const idx of overlaps) {
                let floorv = this.sampleFloor(lvl, noise, idx);
                lvl.data.setidx(idx, floorv);
                phall.setidx(idx, floorv);
            }
            // -- widen "hallway" based on hall width
            let hminidx = overlaps[0];
            let hmaxidx = overlaps[0];
            for (let z=0; z<Math.floor(hallWidth/2); z++) {
                let edges = this.findEdgesForIdxs(lvl, overlaps);
                for (const idx of edges) {
                    if (idx < hminidx) hminidx = idx;
                    if (idx > hmaxidx) hmaxidx = idx;
                    let floorv = this.sampleFloor(lvl, noise, idx);
                    lvl.data.setidx(idx, floorv);
                    phall.setidx(idx, floorv);
                    overlaps.push(idx);
                }
            }
            // -- surround "hallway" with walls
            let edges = this.findEdgesForIdxs(lvl, overlaps);
            for (const idx of edges) {
                if (idx < hminidx) hminidx = idx;
                if (idx > hmaxidx) hmaxidx = idx;
                lvl.data.setidx(idx, 'wall');
                phall.setidx(idx, 'wall');
            }
            // compute overlap of hallway w/ room1
            let [hmini, hminj] = lvl.data.ijfromidx(hminidx);
            let [hmaxi, hmaxj] = lvl.data.ijfromidx(hmaxidx);
            let [o1mini,o1maxi] = Mathf.projectSegment(r1.mini, r1.maxi, hmini, hmaxi);
            let [o1minj,o1maxj] = Mathf.projectSegment(r1.minj, r1.maxj, hminj, hmaxj);
            //console.log(`  hallway i: ${hmini},${hmaxi} j: ${hminj},${hmaxj}`);
            //console.log(`  room1 i: ${r1.mini},${r1.maxi} j: ${r1.minj},${r1.maxj}`);
            // choose side w/ greatest overlap
            if (o1maxi-o1mini > o1maxj-o1minj) {
                //console.log(`  r1 max i o1i: ${o1mini},${o1maxi} o1j: ${o1minj},${o1maxj}`);
                r1port = lvl.data.idxfromij(Math.floor((o1maxi+o1mini)/2), (r1midj < o1minj) ? o1minj : o1maxj);
                r1dir = (r1midj<o1minj) ? Direction.north : Direction.south;
            } else {
                //console.log(`  r1 max j o1i: ${o1mini},${o1maxi} o1j: ${o1minj},${o1maxj}`);
                r1port = lvl.data.idxfromij( (r1midi < o1mini) ? o1mini : o1maxi, Math.floor((o1maxj+o1minj)/2));
                r1dir = (r1midi<o1mini) ? Direction.west : Direction.east;
            }
            // compute overlap of hallway w/ room1
            let [o2mini,o2maxi] = Mathf.projectSegment(r2.mini, r2.maxi, hmini, hmaxi);
            let [o2minj,o2maxj] = Mathf.projectSegment(r2.minj, r2.maxj, hminj, hmaxj);
            // choose side w/ greatest overlap
            if (o2maxi-o2mini > o2maxj-o2minj) {
                //console.log(`  r2 max i o2i: ${o2mini},${o2maxi} o2j: ${o2minj},${o2maxj}`);
                //console.log(`  r2: i ${r2.mini},${r2.maxi} j: ${r2.minj},${r2.maxj}`);
                r2port = lvl.data.idxfromij(Math.floor((o2maxi+o2mini)/2), (r2.minj < o2minj) ? o2minj : o2maxj);
                r2dir = (r2midj<o2minj) ? Direction.north : Direction.south;
                //console.log(`  r2port: ${r2port} ${lvl.data.ijfromidx(r2port)} dir: ${r2dir}`);
            } else {
                //console.log(`  max j`);
                r2port = lvl.data.idxfromij( (r2midi < o2mini) ? o2mini : o2maxi, Math.floor((o2maxj+o2minj)/2));
                r2dir = (r2midi<o2mini) ? Direction.west : Direction.east;
            }

            // -- create doors
            phall.cidx = r1port;
            this.drawDbgTileIdx(lvl, r1port, 'red');
            this.drawDbgTileIdx(lvl, r2port, 'yellow');
            this.carveDoor(lvl, noise, phall, r1, r1port, r1dir, r1doorWidth, r1door);
            this.carveDoor(lvl, noise, phall, r2, r2port, r2dir, r2doorWidth, r2door);
            return phall;
        }

        r1port = Util.findBest(
            r1.edges.filter( (v) => this.checkTileIntersectSegment(lvl, v, r1.x, r1.y, r2.x, r2.y)),
            (v) => Mathf.distance(lvl.data.ifromidx(v), lvl.data.jfromidx(v), r1midi, r1midj),
        );
        r1dir = this.getEdgeDirection(lvl, r1.idxs, r1port);
        //r1.edges[r1port];
        this.drawDbgTileIdx(lvl, r1port, 'red');

        // determine on/off axis for i/j based on direction of room 1 edge
        let onaxi = Math.abs(Direction.asX(r1dir));
        let onaxj = Math.abs(Direction.asY(r1dir));
        let offaxi = (onaxi) ? 0 : 1;
        let offaxj = (onaxj) ? 0 : 1;

        r2port = Util.findBest(
            r2.edges.filter( (v) => this.checkTileIntersectSegment(lvl, v, r1.x, r1.y, r2.x, r2.y)),
            (v) => Mathf.distance(lvl.data.ifromidx(v), lvl.data.jfromidx(v), r2midi, r2midj),
        );
        r2dir = this.getEdgeDirection(lvl, r2.idxs, r2port);
        this.drawDbgTileIdx(lvl, r2port, 'red');

        //console.log(`--- r1port: ${r1port} r1dir: ${r1dir} r2port: ${r2port} r2dir: ${r2dir}`);

        // if ports are facing opposite
        let r1hall = lvl.data.idxfromdir(r1port, r1dir);
        let r2hall = lvl.data.idxfromdir(r2port, r2dir);
        this.drawDbgTileIdx(lvl, r1hall, 'cyan');
        this.drawDbgTileIdx(lvl, r2hall, 'cyan');
        if (r1dir === Direction.opposite(r2dir)) {
            // space between rooms
            let space = Direction.distanceAlong(r1dir, lvl.data.ifromidx(r2port)-lvl.data.ifromidx(r1port), lvl.data.jfromidx(r2port)-lvl.data.jfromidx(r1port));
            // overlapping space along orthogonal
            let delta = Direction.distanceAlong(Direction.orthogonal(r1dir), ioverlap, joverlap);
            if (space >= hallWidth+2) {
                //console.log(`  normal switchback`);
                this.carveSwitchbackHall(lvl, noise, phall, r1hall, r1dir, r2hall, r2dir, spec);
            } else if (space>1 && delta>=(hallWidth)) {
                //console.log(`  straight`);
                //ctx.strokeStyle = this.dbgColor;
                //ctx.strokeRect(lvl.x + r1.mini*lvl.tileSize, lvl.y + r1.minj*lvl.tileSize, r1.cols*lvl.tileSize, r1.rows*lvl.tileSize);
                // compute overlap midpoint
                if (ioverlap) {
                    let [omini,omaxi] = Mathf.projectSegment(r1.mini, r1.maxi-1, r2.mini, r2.maxi-1);
                    r1port = lvl.data.idxfromij(omini+Math.floor((omaxi-omini)/2), lvl.data.jfromidx(r1port));
                    r2port = lvl.data.idxfromij(omini+Math.floor((omaxi-omini)/2), lvl.data.jfromidx(r2port));
                } else {
                    let [ominj,omaxj] = Mathf.projectSegment(r1.minj, r1.maxj-1, r2.minj, r2.maxj-1);
                    r1port = lvl.data.idxfromij(lvl.data.ifromidx(r1port), ominj+Math.floor((omaxj-ominj)/2));
                    r2port = lvl.data.idxfromij(lvl.data.ifromidx(r2port), ominj+Math.floor((omaxj-ominj)/2));
                }
                r1hall = lvl.data.idxfromdir(r1port, r1dir);
                r2hall = lvl.data.idxfromdir(r2port, r2dir);
                //console.log(`  final r1port: ${r1port} r1dir: ${r1dir} r2port: ${r2port} r2dir: ${r2dir}`);
                this.carveStraightHall(lvl, noise, phall, r1hall, r1dir, r2hall, r2dir, spec);
            } else {
                // case 1: delta too small
                if (delta < hallWidth) {
                    //console.log(`  exception 1: delta too small`);
                    // adjust door for room 1
                    // determine projections (normal/inverse) of room 2 to room1 on i/j
                    let [omini,omaxi] = Mathf.projectSegment(r1.mini, r1.maxi, r2.mini, r2.maxi);
                    let [ominj,omaxj] = Mathf.projectSegment(r1.minj, r1.maxj, r2.minj, r2.maxj);
                    let [nmini,nmaxi] = Mathf.invProjectSegment(r1.mini, r1.maxi, omini, omaxi);
                    let [nminj,nmaxj] = Mathf.invProjectSegment(r1.minj, r1.maxj, ominj, omaxj);

                    // compute bisector for room1 
                    let coord = Math.floor((nmini+nmaxi)*offaxi/2 + (nminj+nmaxj)*offaxj/2);
                    let bminx = lvl.x + ((r1.mini-1)*onaxi + coord*offaxi)*lvl.unitSize;
                    let bminy = lvl.y + ((r1.minj-1)*onaxj + coord*offaxj)*lvl.unitSize;
                    let bmaxx = lvl.x + ((r1.maxi+1)*onaxi + coord*offaxi)*lvl.unitSize;
                    let bmaxy = lvl.y + ((r1.maxj+1)*onaxj + coord*offaxj)*lvl.unitSize;
                    UxDbg.drawLine(bminx, bminy, bmaxx, bmaxy, {color: 'red'});

                    //console.log(`  -- old r1port: ${r1port}`);
                    r1port = Util.findBest(
                        r1.edges.filter( (v) => this.checkTileIntersectSegment(lvl, v, bminx, bminy, bmaxx, bmaxy)),
                        (v) => Mathf.distance(lvl.data.ifromidx(v), lvl.data.jfromidx(v), r2midi, r2midj),
                    );
                    //console.log(`  -- new r1port: ${r1port}`);
                    r1hall = lvl.data.idxfromdir(r1port, r1dir);

                    // pick a new direction for room 2
                    r2dir = Direction.cardinalFromXY(offaxi*(r1midi-r2midi),offaxj*(r1midj-r2midj));

                    //console.log(`  new r2dir: ${r2dir}`);

                    // pick a new point along edge of room 2 to act as door
                    if (r1.mini*onaxi+r1.minj*onaxj < r2.mini*onaxi + r2.minj*onaxj + 1) {
                        coord = Prng.rangeInt(r2.mini*onaxi + r2.minj*onaxj + 2, r2midi*onaxi + r2midj*onaxj-1);
                    } else {
                        coord = Prng.rangeInt(r2midi*onaxi + r2midj*onaxj, r2.maxi*onaxi + r2.maxj*onaxj - 2 - 1);
                    }
                    bminx = lvl.x + ((r2.mini-1)*offaxi + coord*onaxi)*lvl.unitSize;
                    bminy = lvl.y + ((r2.minj-1)*offaxj + coord*onaxj)*lvl.unitSize;
                    bmaxx = lvl.x + ((r2.maxi+1)*offaxi + coord*onaxi)*lvl.unitSize;
                    bmaxy = lvl.y + ((r2.maxj+1)*offaxj + coord*onaxj)*lvl.unitSize;
                    UxDbg.drawLine(bminx, bminy, bmaxx, bmaxy, {color: 'red'});

                    //console.log(`  old r2port: ${r2port}`);
                    r2port = Util.findBest(
                        r2.edges.filter( (v) => this.checkTileIntersectSegment(lvl, v, bminx, bminy, bmaxx, bmaxy)),
                        (v) => Mathf.distance(lvl.data.ifromidx(v), lvl.data.jfromidx(v), r1midi, r1midj),
                    );
                    //console.log(`  new r2port: ${r2port}`);
                    r2hall = lvl.data.idxfromdir(r2port, r2dir);
                    //console.log(`  final r1port: ${r1port} r1dir: ${r1dir} r2port: ${r2port} r2dir: ${r2dir}`);
                    this.carveAngleHall(lvl, noise, phall, r1hall, r1dir, r2hall, r2dir, spec);

                // case 2: could have hallway, but space between rooms is too small
                } else {
                    //console.log(`  exception 2: space too small`);
                    //ctx.strokeStyle = this.dbgColor;
                    //ctx.strokeRect(lvl.x + r1.mini*lvl.tileSize, lvl.y + r1.minj*lvl.tileSize, r1.cols*lvl.tileSize, r1.rows*lvl.tileSize);

                    // make sure r1 doorway is within room overlap
                    let [omini,omaxi] = Mathf.projectSegment(r1.mini, r1.maxi, r2.mini, r2.maxi);
                    let [ominj,omaxj] = Mathf.projectSegment(r1.minj, r1.maxj, r2.minj, r2.maxj);
                    if (omaxi>omini) {
                        r1port = lvl.data.idxfromij(Math.floor((omini+omaxi)/2),lvl.data.jfromidx(r1port));
                    } else {
                        r1port = lvl.data.idxfromij(lvl.data.ifromidx(r1port),Math.floor((ominj+omaxj)/2));
                    }
                    r1hall = lvl.data.idxfromdir(r1port, r1dir);
                    //console.log(`  new r1port: ${r1port}`);
                    this.drawDbgTileIdx(lvl, r1port, 'pink', true);

                    // align room 2's "door" to match room 1's and make it a floor tile
                    if (r1dir === Direction.east || r1dir === Direction.west) {
                        r2port = lvl.data.idxfromij(lvl.data.ifromidx(r2port), lvl.data.jfromidx(r1port));
                    } else {
                        r2port = lvl.data.idxfromij(lvl.data.ifromidx(r1port), lvl.data.jfromidx(r2port));
                    }
                    this.drawDbgTileIdx(lvl, r2port, 'white', true);
                    r2door = 'floor';
                    r2doorWidth = hallWidth;
                    //console.log(`  final r1port: ${r1port} r1dir: ${r1dir} r2port: ${r2port} r2dir: ${r2dir}`);
                }
            }
        } else {
            this.carveAngleHall(lvl, noise, phall, r1hall, r1dir, r2hall, r2dir, spec);
        }

        // carve doors
        phall.cidx = r1port;
        this.carveDoor(lvl, noise, phall, r1, r1port, r1dir, r1doorWidth, r1door);
        this.carveDoor(lvl, noise, phall, r2, r2port, r2dir, r2doorWidth, r2door);

        return phall;

    }

    static carveAngleHall(lvl, noise, phall, idx1, dir1, idx2, dir2, spec={}) {
        let width = spec.hallWidth || 1;
        let i1 = lvl.data.ifromidx(idx1);
        let j1 = lvl.data.jfromidx(idx1);
        let i2 = lvl.data.ifromidx(idx2);
        let j2 = lvl.data.jfromidx(idx2);
        // compute midpoint
        let mi = i1 + Math.abs(Math.round((i2-i1)))*Direction.asX(dir1);
        let mj = j1 + Math.abs(Math.round((j2-j1)))*Direction.asY(dir1);
        let midx = lvl.data.idxfromij(mi, mj);
        this.drawDbgTileIdx(lvl, midx, 'orange');
        // leg from idx1 to mid
        this.carveSegment(lvl, noise, phall, idx1, midx, width, dir1);
        // leg from idx2 to mid
        this.carveSegment(lvl, noise, phall, idx2, midx, width, dir2);
    }

    /**
     * carveSwitchbackHall
     * -- assumes connected points are facing each other 
     * @param {*} lvl 
     * @param {*} idx1 
     * @param {*} dir1 
     * @param {*} idx2 
     * @param {*} dir2 
     * @param {*} spec 
     */
    static carveSwitchbackHall(lvl, noise, phall, idx1, dir1, idx2, dir2, spec={}) {
        let width = spec.hallWidth || 1;
        let i1 = lvl.data.ifromidx(idx1);
        let j1 = lvl.data.jfromidx(idx1);
        let i2 = lvl.data.ifromidx(idx2);
        let j2 = lvl.data.jfromidx(idx2);
        // find switchback points
        let mi1 = i1 + Math.abs(Math.round((i2-i1)/2))*Direction.asX(dir1);
        let mj1 = j1 + Math.abs(Math.round((j2-j1)/2))*Direction.asY(dir1);
        let midx1 = lvl.data.idxfromij(mi1, mj1);
        //console.log(`  dir: ${dir1} asx: ${Direction.asX(dir1)} p1: ${i1},${j1} p2: ${i2},${j2} mi1: ${mi1} mj1: ${mj1}`);
        UxDbg.drawTile(mi1, mj1, {x: lvl.x, y: lvl.y, tileSize: lvl.unitSize, color: 'orange'});
        //this.drawDbgTile(lvl, mi1, mj1, 'orange');
        let mi2 = i2 - Math.abs(Math.floor((i2-i1)/2))*Direction.asX(dir1);
        let mj2 = j2 - Math.abs(Math.floor((j2-j1)/2))*Direction.asY(dir1);
        let midx2 = lvl.data.idxfromij(mi2, mj2);
        //this.drawDbgTile(lvl, mi2, mj2, 'orange');
        UxDbg.drawTile(mi2, mj2, {x: lvl.x, y: lvl.y, tileSize: lvl.unitSize, color: 'orange'});
        // leg from idx1
        this.carveSegment(lvl, noise, phall, idx1, midx1, width, dir1);
        // leg from idx2
        this.carveSegment(lvl, noise, phall, idx2, midx2, width, dir2);
        // middle of switchback
        this.carveSegment(lvl, noise, phall, midx1, midx2, width, Direction.orthogonal(dir1));
    }


    static carveStraightHall(lvl, noise, phall, idx1, dir1, idx2, dir2, spec={}) {
        let width = spec.hallWidth || 1;
        // single leg from idx1 to idx2
        this.carveSegment(lvl, noise, phall, idx1, idx2, width, dir1);
    }

    static carveDoor(lvl, noise, phall, proom, idx, dir, width, doorTile='door') {
        phall.exits.push(idx);
        proom.exits.push(idx);
        let i = lvl.data.ifromidx(idx);
        let j = lvl.data.jfromidx(idx);
        let widthDir = (dir === Direction.east || dir === Direction.west) ? Direction.south : Direction.east;
        let widthOff = Math.min(-Math.round(width/2)+1,0);
        for (let widx=0; widx<width; widx++) {
            let wi = Direction.asX(widthDir) * (widx + widthOff);
            let wj = Direction.asY(widthDir) * (widx + widthOff);
            lvl.data.setij(i+wi, j+wj, doorTile);
            phall.setidx(lvl.data.idxfromij(i+wi,j+wj), doorTile);
        }
    }

    static checkTileIntersectSegment(lvl, idx, x1, y1, x2, y2) {
        let i = lvl.data.ifromidx(idx);
        let j = lvl.data.jfromidx(idx);
        let bminx = lvl.x + i*lvl.unitSize;
        let bmaxx = lvl.x + (i+1)*lvl.unitSize;
        let bminy = lvl.y + j*lvl.unitSize;
        let bmaxy = lvl.y + (j+1)*lvl.unitSize;
        //console.log(`r min: ${bminx},${bminy} max: ${bmaxx},${bmaxy} p1: ${x1},${y1} p2: ${x2},${y2}`);
        return Mathf.checkIntersectRectSegment(bminx, bminy, bmaxx, bmaxy, x1, y1, x2, y2);
    }

    /**
     * determine edge direction assuming edge is within set of indices and wanted direction is towards the outside
     * @param {*} lvl - level data
     * @param {*} idxs - set of indices associated w/ edge (room/hallway/etc)
     * @param {*} edge - the edge index to evaluate
     */
    static getEdgeDirection(lvl, idxs, edge) {
        for (const dir of Direction.cardinals) {
            let oidx = lvl.data.idxfromdir(edge, dir);
            if (!idxs.includes(oidx)) return dir;
        }
        return Direction.none;
    }

    static findEdgesForIdxs(lvl, idxs) {
        let edges = [];
        for (const idx of idxs) {
            for (const dir of Direction.all) {
                let oidx = lvl.data.idxfromdir(idx, dir);
                if (!idxs.includes(oidx)) edges.push(oidx);
            }
        }
        return edges;
    }

    static drawDbgTileIdx(lvl, idx, color='green', fill=false, opts={}) {
        let tag = opts.tag || UxDbg.dfltTag;
        UxDbg.drawTile(lvl.data.ifromidx(idx), lvl.data.jfromidx(idx), {
            x: lvl.x,
            y: lvl.y,
            tileSize: lvl.unitSize,
            color: color,
            fill: fill,
            tag: tag,
        });
        //this.drawDbgTile(ctx, lvl, lvl.data.ifromidx(idx), lvl.data.jfromidx(idx), color, fill);
    }

    static carveSegment(lvl, noise, phall, idx1, idx2, width, dir) {
        // carve the hallway
        let i1 = lvl.data.ifromidx(idx1);
        let j1 = lvl.data.jfromidx(idx1);
        let i2 = lvl.data.ifromidx(idx2);
        let j2 = lvl.data.jfromidx(idx2);
        let i, j;
        let segidxs = [];
        if (idx1 !== idx2) {
            for ([i, j] of Util.pixelsInSegmentWidth( i1, j1, i2, j2, width)) {
                let idx = lvl.data.idxfromij(i,j);
                let floorv = this.sampleFloor(lvl, noise, idx);
                lvl.data.setidx(idx, floorv);
                segidxs.push(idx);
                phall.setidx(idx, floorv);
            };
        } else {
            for ([i, j] of Util.pixelsInCross( i1, j1, dir, width)) {
                let idx = lvl.data.idxfromij(i,j);
                let floorv = this.sampleFloor(lvl, noise, idx);
                lvl.data.setidx(idx, floorv);
                segidxs.push(idx);
                phall.setidx(idx, floorv);
            }
        }
        // carve the walls
        for (const idx of this.findEdgesForIdxs(lvl, segidxs)) {
            let otile = lvl.data.getidx(idx);
            if (!otile || otile === 'fill') {
                lvl.data.setidx(idx, 'wall');
                phall.setidx(idx, 'wall');
            }
        }
    }

}
