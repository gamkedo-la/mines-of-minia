export { ProcSlice, ProcPie }

import { Fmt } from "../base/fmt.js";
import { Prng } from "../base/prng.js";
import { UxDbg } from "../base/uxDbg.js";
import { ProcModel } from "./pmodel.js";

class ProcSlice {
    static dfltColor = "yellow";

    constructor(spec={}) {
        // -- origin
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        // -- start angle
        this.startAngle = spec.startAngle || 0;
        // -- end angle
        this.endAngle = spec.endAngle || 0;
        // -- radius
        this.radius = spec.radius || 0;
        // -- tag
        this.tag = spec.tag;
        // -- color
        this.color = spec.color || this.constructor.dfltColor;
    }

    get angle() {
        return (this.startAngle + this.endAngle)/2;
    }

    get arcmidx() {
        return this.x+Math.cos(this.angle)*this.radius;
    }
    get arcmidy() {
        return this.y+Math.sin(this.angle)*this.radius;
    }

    draw(tag) {
        UxDbg.drawLine(
            this.x, this.y, 
            this.x+Math.cos(this.startAngle)*this.radius, this.y+Math.sin(this.startAngle)*this.radius, 
            {color: this.color, tag:tag},
        );
        UxDbg.drawLine(
            this.x, this.y, 
            this.x+Math.cos(this.endAngle)*this.radius, this.y+Math.sin(this.endAngle)*this.radius, 
            {color: this.color, tag:tag},
        );
        UxDbg.drawArc(this.x, this.y, this.radius, {pie: true, color: this.color, startAngle: this.startAngle, endAngle: this.endAngle});
    }

    toString() {
        return Fmt.toString('ProcSlice', this.tag, this.x, this.y, this.radius, this.startAngle, this.endAngle);
    }
}

class ProcPie extends ProcModel {
    static dfltColor = "yellow";

    static genSlices(pie, spec={}) {
        let slices = spec.slices || 4;
        let sliceAvg = Math.PI*2/slices;
        let currentAngle = pie.startAngle;
        let angleLeft = Math.PI*2;

        let sliceJitter = spec.sliceJitter || .4;
        let buffer = spec.hasOwnProperty('buffer') ? spec.buffer : true;
        let buffMin = spec.bufferMinPct || .1;
        let buffMax = spec.bufferMaxPct || .25;
        let sradiusMin = spec.sliceRadiusMinPct || .5;
        let sradiusMax = spec.sliceRadiusMaxPct || 1;
        let sliceColor = spec.sliceColor || 'gray';
        let sliceTag = spec.sliceTag || 'room';

        for (let i=0; i<slices; i++) {
            let sradiusPct = Prng.range(sradiusMin, sradiusMax);
            let sradius = pie.radius * sradiusPct;
            let nextAngle = (i!==slices-1) ? Prng.jitter(sliceAvg, sliceJitter) : angleLeft;
            let bufferAngle = (buffer) ? nextAngle * Prng.range(buffMin, buffMax) : 0;
            let sliceAngle = nextAngle - bufferAngle;
            pie.add(currentAngle, currentAngle + sliceAngle, sliceTag, sliceColor, sradius);
            //if (buffer) ppie.add(currentAngle + roomAngle + bufferAngle, bufferTag, bufferColor);
            currentAngle += nextAngle;
            angleLeft -= nextAngle;
            sliceAvg = angleLeft/(slices-(i+1));
        }
    }

    constructor(spec={}) {
        super(spec);
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.radius = spec.radius || 0;
        this.color = spec.color || this.constructor.dfltColor;
        // -- starting angle
        this.startAngle = spec.startAngle || 0;
        // -- slices of pie
        this.slices = [];
        this.constructor.genSlices(this, spec);
    }

    /**
     * add new slice to pie
     */
    add(startAngle, endAngle, tag, color, radius) {
        if (!radius) radius = this.radius;
        let x_slice = {
            x: this.x,
            y: this.y,
            startAngle: startAngle,
            radius: radius,
            endAngle: endAngle,
            tag: tag,
            color: color,
        }
        let slice = new ProcSlice(x_slice);
        this.slices.push(slice);
    }

    *findSlice(filter=(v)=>true) {
        for (const slice of this.slices) {
            if (filter(slice)) yield slice;
        }
    }

    count(filter=(v)=>true) {
        let count = 0;
        for (const slice of this.slices) {
            if (filter(slice)) count++;
        }
        return count;
    }

    draw(tag) {
        // draw arc
        UxDbg.drawArc(this.x, this.y, this.radius, {color: this.color, tag:tag});
        // draw slices
        for (const slice of this.slices) slice.draw(tag);
    }

    toString() {
        return Fmt.toString('ProcPie', this.x, this.y, this.radius, this.slices.length);
    }
}