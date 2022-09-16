export { Layout };

import { Mathf } from '../base/math.js';
import { Prng } from '../base/prng.js';
import { UxDbg } from '../base/uxDbg.js';
import { ProcPie } from './ppie.js';
import { ProcRoom } from './proom.js';


/**
 * class holding room layout generators...
 */
class Layout {

    static *generator(template={}, pstate={}) {
        // FIXME: layout generator can be specific to level...
        //yield *this.roomRingsGenerator(template, pstate);
        //yield *this.roomRandomGenerator(template, pstate);
        if (template.boss === 'rock') {
            yield *this.rockBossRoomGenerator(template, pstate);
        } else {
            yield *this.roomRingsGenerator(template, pstate);
        }
    }

    static *rockBossRoomGenerator(template, pstate) {
        // pull rrooms config from template
        let rrooms = template.rrooms || {};
        let width = template.width || 400;
        let height = template.height || 400;
        let origx = Math.floor(width/2);
        let origy = Math.floor(height/2);
        let radius = Math.min(origx, origy);
        let minUnits = template.roomMinUnits || 5;
        let minRoomRadius = template.unitSize * minUnits;
        let maxRoomRadius = rrooms.maxRoomRadius || minRoomRadius*1.5;
        let minRooms = rrooms.minRooms || 8;
        let maxRooms = rrooms.maxRooms || 12;
        let nrooms = Prng.rangeInt(minRooms, maxRooms);
        let rooms = [];
        // start with boss room in the middle
        let r = (template.unitSize * 10);
        let room = new ProcRoom({
            x: Math.round(origx), 
            y: Math.round(origy),
            radius: Math.round(r),
            // ensures a square room
            outlineSchemes: [ {weight: 1, minWidthPct: Math.SQRT2/2, minHeightPct: Math.SQRT2/2}, ],
            critical: true,
            boss: true
        });
        rooms.push(room);
        // create other random rooms around boss room
        for (let i=0; i<nrooms; i++) {
            let rorigx, rorigy, roomRadius;
            let ok = false;
            for (let iters=0; iters<100; iters++) {
                let angle = Prng.range(0,Math.PI*2);
                let range = Prng.range(0,radius);
                rorigx = origx+Math.cos(angle)*range; 
                rorigy = origy+Math.sin(angle)*range;
                roomRadius = Prng.range(minRoomRadius,maxRoomRadius);
                // check for overlap
                if (rooms.some((v) => Mathf.distance(v.x, v.y, rorigx, rorigy) < v.radius+roomRadius)) continue;
                ok = true;
                break;
            }
            if (ok) {
                let room = new ProcRoom({
                    x: Math.round(rorigx), 
                    y: Math.round(rorigy),
                    radius: Math.round(roomRadius),
                });
                rooms.push(room);
            }
        }
        // ## save state
        pstate.prooms = rooms;
        if (template.doyield) yield;
        // ## merge rooms
        let mrooms = this.mergeRooms(template, pstate.prooms);
        pstate.prooms = mrooms;
        if (template.doyield) yield;
        // ## connect rooms
        let crooms = this.connectRooms(template, pstate.prooms);
        pstate.prooms = crooms;
        if (template.doyield) yield;
        // ## choose primary/secondary rooms
        // -- top third of rooms farthest away are primary
        // -- center rooms are secondary
        let sorted = Array.from(pstate.prooms);
        let top = Math.max(1, Math.floor(pstate.prooms.length/3));
        sorted.sort((a,b) => {
            let ad = Mathf.distance(a.x, a.y, origx, origy);
            let bd = Mathf.distance(b.x, b.y, origx, origy);
            return bd-ad;
        });
        for (let i=0; i<top; i++) {
            let proom = sorted[i];
            let d = Mathf.distance(proom.x, proom.y, origx, origy);
            console.log(`${proom} d: ${d}`);
            proom.primary = true;
        }
    }

    static *roomRandomGenerator(template, pstate) {
        // pull rrooms config from template
        let rrooms = template.rrooms || {};
        let width = template.width || 400;
        let height = template.height || 400;
        let origx = Math.floor(width/2);
        let origy = Math.floor(height/2);
        let radius = Math.min(origx, origy);
        let minUnits = template.roomMinUnits || 5;
        let minRoomRadius = template.unitSize * minUnits;
        let maxRoomRadius = rrooms.maxRoomRadius || minRoomRadius*2.5;
        let minRooms = rrooms.minRooms || 8;
        let maxRooms = rrooms.maxRooms || 18;
        let nrooms = Prng.rangeInt(minRooms, maxRooms);
        let rooms = [];
        for (let i=0; i<nrooms; i++) {
            let rorigx, rorigy, roomRadius;
            let ok = false;
            for (let iters=0; iters<100; iters++) {
                let angle = Prng.range(0,Math.PI*2);
                let range = Prng.range(0,radius);
                rorigx = origx+Math.cos(angle)*range; 
                rorigy = origy+Math.sin(angle)*range;
                roomRadius = Prng.range(minRoomRadius,maxRoomRadius);
                // check for overlap
                if (rooms.some((v) => Mathf.distance(v.x, v.y, rorigx, rorigy) < v.radius+roomRadius)) continue;
                ok = true;
                break;
            }
            if (ok) {
                let room = new ProcRoom({
                    x: Math.round(rorigx), 
                    y: Math.round(rorigy),
                    radius: Math.round(roomRadius),
                });
                rooms.push(room);
            }
        }
        // ## save state
        pstate.prooms = rooms;
        if (template.doyield) yield;
        // ## merge rooms
        let mrooms = this.mergeRooms(template, pstate.prooms);
        pstate.prooms = mrooms;
        if (template.doyield) yield;
        // ## connect rooms
        let crooms = this.connectRooms(template, pstate.prooms);
        pstate.prooms = crooms;
        if (template.doyield) yield;
        // ## choose primary/secondary rooms
        // -- top third of rooms farthest away are primary
        // -- center rooms are secondary
        let sorted = Array.from(pstate.prooms);
        let top = Math.max(1, Math.floor(pstate.prooms.length/3));
        sorted.sort((a,b) => {
            let ad = Mathf.distance(a.x, a.y, origx, origy);
            let bd = Mathf.distance(b.x, b.y, origx, origy);
            return bd-ad;
        });
        for (let i=0; i<top; i++) {
            let proom = sorted[i];
            let d = Mathf.distance(proom.x, proom.y, origx, origy);
            console.log(`${proom} d: ${d}`);
            proom.primary = true;
        }
    }

    /**
     * create a rings of rooms w/ overlapping connections
     */
    static *roomRingsGenerator(template={}, pstate={}) {
        // pull rings config from template
        let rings = template.rings || {};
        // ## step 1 --- create a pie in center of level, where each slice of the pie will end up representing a room...
        let x_pie = {}
        // -- compute origin to be middle of level
        let width = template.width || 400;
        let height = template.height || 400;
        console.log(`rings dim: ${width},${height}`);
        x_pie.x = Math.floor(width/2);
        x_pie.y = Math.floor(height/2);
        // -- radius is computed from min dimension
        let dim = Math.min(width, height);
        let sizePct = rings.sizePict || .5;
        x_pie.radius = Math.floor(dim*sizePct/2);
        // -- starting angle is random
        x_pie.startAngle = Prng.range(0,Math.PI*2);
        // -- pie slice config
        let slicesMin = rings.slicesMin || 6;
        let slicesMax = rings.slicesMax || 10;
        x_pie.sliceJitter = rings.sliceJitter;
        x_pie.slices = Prng.rangeInt(slicesMin, slicesMax);
        x_pie.buffer = rings.hasOwnProperty('sliceBuffer') ? rings.sliceBuffer : true;
        x_pie.bufferMinPct = rings.sliceBufferMinPct;
        x_pie.bufferMaxPct = rings.sliceBufferMaxPct;
        x_pie.sliceRadiusMinPct = rings.sliceRadiusMinPct;
        x_pie.sliceRadiusMaxPct = rings.sliceRadiusMaxPct;
        x_pie.sliceColor = rings.sliceColor;
        x_pie.sliceTag = rings.sliceTag;
        // -- generate the pie
        let ppie = new ProcPie(x_pie);
        pstate.grrpie = ppie;
        // ## end of step 1
        if (template.doyield) yield;

        // ## step 2
        // -- generate rooms from pie slices
        let prooms = Layout.genRoomsFromPie(ppie, template, true);
        pstate.prooms = prooms;
        if (template.doyield) yield;
        delete pstate.grrpie;

        // ## step 3
        // -- generate a pie to represent satellite ring distribution around original ring
        let satsMin = rings.satsMin || 2;
        let satsMax = rings.satsMax || 4;
        let orbitFactor = rings.orbitFactor || 1.5;
        let x_spie = {
            x: ppie.x,
            y: ppie.y,
            slices: Prng.rangeInt(satsMin, satsMax),
            sliceJitter: rings.satJitter || .3,
            sliceRadiusMinPct: rings.orbitMinPct || .9,
            sliceRadiusMaxPct: rings.orbitMaxPct || 1.1,
            radius: ppie.radius * orbitFactor,
            buffer: false,
        };
        let spie = new ProcPie(x_spie);
        pstate.grrspie = spie;
        if (template.doyield) yield;

        // ## step 4
        // -- for each slice of the satellite pie, create a satellite ring
        let psats = [];
        let satRoomsMin = rings.satRoomsMin || Math.round(ppie.count() * .25);
        let satRoomsMax = rings.satRoomsMax || Math.round(ppie.count() * .75);

        for (const slice of spie.slices) {

            // use slice angle to derive ring origin
            let x_sat = {}
            // -- compute origin to be middle of level
            x_sat.x = slice.arcmidx;
            x_sat.y = slice.arcmidy;
            // -- radius is computed based on center pie radius
            let radiusFactor = rings.satRadiusFactor || .5;
            let radiusJitter = rings.satRadiusJitter || .25;
            x_sat.radius = Prng.jitter(ppie.radius * radiusFactor, radiusJitter),
            // -- starting angle is random
            x_sat.startAngle = Prng.range(0,Math.PI*2);

            // -- pie slice config
            x_sat.sliceJitter = rings.sliceJitter;
            x_sat.slices = Prng.rangeInt(satRoomsMin, satRoomsMax);
            x_sat.buffer = rings.hasOwnProperty('sliceBuffer') ? rings.sliceBuffer : true;
            x_sat.bufferMinPct = rings.sliceBufferMinPct;
            x_sat.bufferMaxPct = rings.sliceBufferMaxPct;
            x_sat.sliceRadiusMinPct = rings.sliceRadiusMinPct;
            x_sat.sliceRadiusMaxPct = rings.sliceRadiusMaxPct;
            x_sat.sliceColor = rings.sliceColor;
            x_sat.sliceTag = rings.sliceTag;
            // -- generate the pie
            let psat = new ProcPie(x_sat);
            psats.push(psat);
        }
        pstate.grrsats = psats;
        if (template.doyield) yield;

        // ## step 5
        // -- generate rooms for satellites
        for (const psat of psats) {
            let satrooms = Layout.genRoomsFromPie(psat, template, false);
            pstate.prooms = pstate.prooms.concat(satrooms);
        }
        if (template.doyield) yield;
        delete pstate.grrspie;
        delete pstate.grrsats;

        // ## step 6
        // -- merge rooms
        let mrooms = this.mergeRooms(template, pstate.prooms);
        pstate.prooms = mrooms;
        if (template.doyield) yield;

        // ## step 6
        // -- connect rooms
        let crooms = this.connectRooms(template, pstate.prooms);
        pstate.prooms = crooms;
        if (template.doyield) yield;

    }

    static genRoomsFromPie(pie, template={}, primary=false) {
        let minUnits = template.roomMinUnits || 5;
        let minRoomRadius = template.unitSize * minUnits;
        let rooms = [];
        let lastRoom;
        for (const slice of pie.findSlice((v) => v.tag === 'room')) {
            let rorigx = pie.x+Math.cos(slice.angle)*slice.radius; 
            let rorigy = pie.y+Math.sin(slice.angle)*slice.radius;
            let roomRadius = Math.max(minRoomRadius, Math.min(((slice.endAngle-slice.startAngle) * slice.radius)/2, pie.radius/2));
            let room = new ProcRoom({
                x: Math.round(rorigx), 
                y: Math.round(rorigy),
                primary: primary,
                radius: Math.round(roomRadius),
            });
            if (lastRoom) {
                room.addConnection(lastRoom);
                lastRoom.addConnection(room);
            }
            rooms.push(room);
            lastRoom = room;
        }
        // connect first/last rooms
        rooms[0].addConnection(lastRoom);
        lastRoom.addConnection(rooms[0]);
        return rooms;
    }

    static findRoomIntersections(candidate, others) {
        let intersections = [];
        for (const other of others) {
            let d = Mathf.distance(candidate.x, candidate.y, other.x, other.y);
            if (d < candidate.radius+other.radius) {
                intersections.push(other);
            }
        }
        return intersections;
    }

    static mergeRoomIntersections(candidate, others) {
        let merged;
        let intersections = this.findRoomIntersections(candidate, others);
        while (intersections.length) {
            candidate.roomColor = this.mergeColor;
            candidate.draw('dbg');
            //console.log(`candidate: ${candidate} intersections: ${intersections}`);
            // create new merge candidate
            let mx = intersections.reduce((acc, item) => acc + item.x, candidate.x)/(intersections.length+1);
            let my = intersections.reduce((acc, item) => acc + item.y, candidate.y)/(intersections.length+1);
            let r = intersections.reduce((acc, item) => Math.max(acc, item.radius), candidate.radius);
            merged = new ProcRoom({
                x: Math.round(mx),
                y: Math.round(my),
                radius: Math.round(r),
                roomColor: 'cyan',
            });
            // candidate is replaced with merged in all of its connections
            for (const neighbor of candidate.connections) {
                //console.log(`-- removing candidate neighbor: ${neighbor}`)
                if (neighbor !== candidate && !intersections.includes(neighbor)) {
                    merged.addConnection(neighbor);
                    //console.log(`   -- added neighbor: ${neighbor} to merged ${merged}`);
                    neighbor.addConnection(merged);
                    //console.log(`   -- added merged: ${merged} to neighbor ${neighbor}`);
                }
                neighbor.removeConnection(candidate);
            }
            // each intersection is replaced with merged in all of its connections
            // -- intersected node is also removed from others list
            for (const intersection of intersections) {
                // -- remove from others
                let idx = others.indexOf(intersection);
                others.splice(idx, 1);
                for (const neighbor of intersection.connections) {
                    //console.log(`-- removing intersection ${intersection} neighbor: ${neighbor}`)
                    if (neighbor !== candidate && !intersections.includes(neighbor)) {
                        merged.addConnection(neighbor);
                        //console.log(`   -- added neighbor: ${neighbor} to merged ${merged}`);
                        neighbor.addConnection(merged);
                        //console.log(`   -- added merged: ${merged} to neighbor ${neighbor}`);
                    }
                    neighbor.removeConnection(intersection);
                }
            }
            // candidate now becomes new merged node
            candidate = merged;
            // recheck intersections
            intersections = this.findRoomIntersections(candidate, others);
        }
        return merged;
    }

    static mergeRooms(template, rooms) {
        let unsorted = Array.from(rooms);
        let merged = [];
        while (unsorted.length) {
            // pop first item from unsorted list
            let r1 = unsorted.shift();
            // check/merge candidate against unsorted rooms
            let merge = this.mergeRoomIntersections(r1, unsorted);
            if (merge) {
                // check/merge merge against sorted rooms
                let finalMerge = this.mergeRoomIntersections(merge, merged);
                if (finalMerge) {
                    //console.log(`=== finaleMerge: ${finalMerge}`);
                    merged.push(finalMerge);
                } else {
                    //console.log(`=== merge: ${merge} => ${merge.connections}`);
                    merged.push(merge);
                }
            } else {
                r1.roomColor = 'green';
                merged.push(r1)
            }
        }
        return merged;
    }

    static countGraphs() {
        let graphs = this.computeGraphs(...arguments);
        return graphs.length;
    }

    static computeGraphs() {
        let graphs = [];
        for (const node of arguments) {
            // is node already in a graph
            let found = false;
            for (const graph of graphs) {
                if (graph.includes(node)) {
                    found = true;
                    break;
                }
            }
            // node is not in graph... build new graph starting at node
            if (!found) {
                let graph = [];
                let toprocess = [node];
                while(toprocess.length) {
                    let check = toprocess.shift();
                    if (graph.includes(check)) continue;
                    graph.push(check);
                    for (const conn of check.connections) if (!graph.includes(conn)) toprocess.push(conn);
                }
                graphs.push(graph);
            }
        }
        return graphs;
    }

    static connectRooms(template, rooms) {
        let unsorted = Array.from(rooms);
        let graphs = this.computeGraphs(...unsorted);
        while (graphs.length > 1) {
            let targetGraph = graphs[0];
            let bestTargetRoom, bestOtherRoom, bestDistance;
            // iterate through each room in target graph
            for (const room of targetGraph) {
                // iterate through all other rooms to check distances (skipping any rooms in current graph)
                for (const other of unsorted) {
                    // -- skip other room if in target graph
                    if (targetGraph.includes(other)) continue;
                    // compute distance between current room and other room
                    let d = Mathf.distance(room.x, room.y, other.x, other.y);
                    if (!bestDistance || d<bestDistance) {
                        bestDistance = d;
                        bestTargetRoom = room;
                        bestOtherRoom = other;
                    }
                }
            }
            // connect best target/other rooms
            bestTargetRoom.addConnection(bestOtherRoom);
            bestOtherRoom.addConnection(bestTargetRoom);
            // recompute graphs
            graphs = this.computeGraphs(...unsorted);
        }
        return unsorted;
    }

}