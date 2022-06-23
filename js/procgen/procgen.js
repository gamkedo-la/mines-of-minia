export { ProcGen };

import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { SimpleNoise } from '../base/noise.js';
import { Prng } from '../base/prng.js';
import { Random } from '../base/random.js';
import { Util } from '../base/util.js';
import { UxDbg } from '../base/uxDbg.js';
import { Layout } from './layout.js';
import { Outline } from './outline.js';
import { ProcLevelOutline } from './plevel.js';
import { ProcPie } from './ppie.js';
import { ProcRoom, ProcRoomOutline } from './proom.js';
import { ProcTemplate } from './ptemplate.js';
import { Translate } from './translate.js';

class ProcGen {
    static dfltRows = 16;
    static dfltCols = 16;
    static dfltMinRoomWidth = 2;
    static dfltMaxRoomWidth = 12;

    static features = {
        none: 0,
        floor: 1,
        wall: 2,
        door: 3,
        blocked: 4,
    };

    static init(seed=1) {
        Prng.seed(seed);
    }

    static *initGenerator(template, pstate) {
        if (!template.seed) template.seed = Random.rangeInt(1,100000);
        Prng.seed(template.seed);
        pstate.pnoise = new SimpleNoise({
            seed: template.seed,
            scalex: template.noiseXScale || .04,
            scaley: template.noiseYScale || .05,
        });
        console.log(`procgen noise: ${pstate.pnoise}`);
        console.log(`procgen seed: ${template.seed}`);
        if (template.doyield) yield;
    }

    static *levelGenerator(template={}, pstate={}) {
        // -- general initialization
        yield *this.initGenerator(template, pstate);
        let validLevel = true;
        do {
            // -- generate room layout
            yield *Layout.generator(template, pstate);
            // -- generate level outline
            yield *Outline.generator(template, pstate);
            validLevel = Outline.validate(template, pstate);
            if (!validLevel) {
                for (const key in pstate) {
                    if (key !== 'pnoise') delete pstate[key];
                }
            }
        } while (!validLevel);
        // -- translate level outline to level data
        yield *Translate.generator(template, pstate);
    }

    static dbgGenerateLevel(generator, pstate) {
        // execute next step
        let stepv = generator.next();
        UxDbg.clear();
        for (const p of Object.values(pstate)) {
            if (Array.isArray(p)) {
                for (const sp of p) {
                    if (sp.draw) sp.draw();
                }
            } else {
                if (p.draw) p.draw();
            }
        }
        return stepv.done;
    }

    static genLvl(template) {
        let pstate = {};
        for (const step of this.levelGenerator(template, pstate));
        return pstate.plvl;
    }
    
    static genRandomRooms(spec={}) {
        let origx = spec.origx || 0;
        let origy = spec.origy || 0;
        //let radius = spec.radius || 300;
        let radius = 400;
        let minRoomRadius = spec.minRoomRadius || 20;
        let maxRoomRadius = spec.maxRoomRadius || 40;
        let minRooms = spec.minRooms || 8;
        let maxRooms = spec.maxRooms || 18;
        let nrooms = Prng.rangeInt(minRooms, maxRooms);
        let rooms = [];
        for (let i=0; i<nrooms; i++) {
            let angle = Prng.range(0,Math.PI*2);
            let range = Prng.range(0,radius);
            let rorigx = origx+Math.cos(angle)*range; 
            let rorigy = origy+Math.sin(angle)*range;
            let roomRadius = Prng.range(minRoomRadius,maxRoomRadius);
            let room = new ProcRoom({
                x: Math.round(rorigx), 
                y: Math.round(rorigy),
                radius: Math.round(roomRadius),
            });
            rooms.push(room);
        }
        return rooms;
    }

    /*
    static genPie(spec={}) {
        let origx = spec.origx || 0;
        let origy = spec.origy || 0;
        let radius = spec.radius || 200;
        let nodes = spec.nodes || 8;
        let sliceJitter = spec.sliceJitter || .4;
        let buffer = spec.hasOwnProperty('buffer') ? spec.buffer : true;
        let buffMin = spec.buffMin || .1;
        let buffMax = spec.buffMax || .25;
        let roomColor = spec.roomColor || 'yellow';
        let bufferColor = spec.bufferColor || 'green';
        let roomTag = spec.roomTag || 'room';
        let bufferTag = spec.bufferTag || 'buffer';
        let startAngle = Prng.range(0,Math.PI*2);
        let sliceAvg = Math.PI*2/nodes;
        let currentAngle = startAngle;
        let angleLeft = Math.PI*2;
        let ppie = new ProcPie({
            x: origx,
            y: origy,
            radius: radius,
            startAngle: startAngle,
        });
        for (let i=0; i<nodes; i++) {
            let nextAngle = (i!==nodes-1) ? Prng.jitter(sliceAvg, sliceJitter) : angleLeft;
            let bufferAngle = (buffer) ? nextAngle * Prng.range(buffMin, buffMax) : 0;
            let roomAngle = nextAngle - bufferAngle;
            ppie.add(currentAngle + roomAngle, roomTag, roomColor);
            if (buffer) ppie.add(currentAngle + roomAngle + bufferAngle, bufferTag, bufferColor);
            currentAngle += nextAngle;
            angleLeft -= nextAngle;
            sliceAvg = angleLeft/(nodes-(i+1));
        }
        return ppie;
    }

    static genSatellitePies(pie, spec={}, x_satellite={}) {
        // generate a template for the satellite rings
        let satellites = spec.satellites || 3;
        let orbitFactor = spec.orbitFactor || 1.5;
        let orbit = pie.radius * orbitFactor;
        let orbitJitter = spec.orbitJitter || .20;
        let radiusFactor = spec.orbitFactor || .5;
        let radiusJitter = spec.radiusJitter || .25;
        let pieNodes = pie.count((v)=>v.tag === 'room');
        let nodesMin = spec.nodesMin || Math.round(pieNodes * .25);
        let nodesMax = spec.nodesMax || Math.round(pieNodes * .75);
        let tpie = this.genPie({
            nodes: satellites,
            origx: pie.x,
            origy: pie.y,
            radius: orbit,
            buffer: false,
        });
        // now create the satelite rings
        let rings = [];
        for (const slice of tpie.slices) {
            // use slice angle to derive ring origin
            let jradius = Prng.jitter(orbit, orbitJitter);
            let nodes = Prng.rangeInt(nodesMin, nodesMax);
            let x_ring = Object.assign({}, x_satellite, {
                nodes: nodes,
                origx: pie.x + Math.cos(slice.angle)*jradius,
                origy: pie.y + Math.sin(slice.angle)*jradius,
                radius: Prng.jitter(pie.radius * radiusFactor, radiusJitter),
            });
            let ring = this.genPie(x_ring);
            rings.push(ring);
        }
        return rings;
    }

    static genRoomsFromPie(pie, spec={}) {
        let rangeMin = spec.rangeMin || .5;
        let rangeMax = spec.rangeMax || 1;
        let minRoomRadius = spec.minRoomRadius || 10;
        let rooms = [];
        let lastRoom;
        for (const slice of pie.findSlice((v) => v.tag === 'room')) {
            let range = Prng.range(rangeMin,rangeMax);
            let rorigx = pie.x+Math.cos(slice.angle)*pie.radius*range; 
            let rorigy = pie.y+Math.sin(slice.angle)*pie.radius*range;
            let roomRadius = Math.max(minRoomRadius, Math.min(((slice.endAngle-slice.startAngle) * pie.radius * range)/2, pie.radius/2));
            let room = new ProcRoom({
                x: Math.round(rorigx), 
                y: Math.round(rorigy),
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
    */

    static pickSpawnPoint(lvl, rooms) {
        // choose a starting room
        let room = Prng.choose(rooms);
        lvl.spawnIdx = room.cidx;
    }

    static ijasxy(lvl, i, j) {
        return [lvl.x+i*lvl.tileSize, lvl.y+j*lvl.tileSize];
    }

}