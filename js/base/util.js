export { Util };

import { Direction } from "./dir.js";
import { Fmt } from "./fmt.js";
import { Gizmo } from "./gizmo.js";
import { Mathf } from "./math.js";

// =========================================================================
class Util {

    static empty(obj) {
        if (!obj) return true;
        if (this.iterable(obj)) {
            for (const _ of obj) return false;
            return true;
        }
        return (Object.keys(obj).length === 0);
    }

    static *kvWalk(obj) {
        if (Array.isArray(obj)) {
            for (let i=0; i<obj.length; i++) {
                yield [i,obj[i],obj];
                yield *this.kvWalk(obj[i]);
            }
        } else if (typeof obj === 'object' && obj !== null) {
            for (const [k,v] of Object.entries(obj)) {
                yield [k,v,obj];
                yield *this.kvWalk(v);
            }
        }
    }

    static spliceStr(str, index, count, add) {
        var ar = str.split('');
        ar.splice(index, count, add);
        return ar.join('');
    }

    static basename(path, strip=false) { 
        path = path.replace(/.*\//, '');
        if (strip) path = path.replace(/\..*/, '');
        return path;
    }

    static arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i=0; i<len; i++) {
            binary += String.fromCharCode( bytes[i] );
        }
        return btoa( binary );
    }

    static colorRect(ctx, x, y, boxWidth, boxHeight, fillColor, alpha=1) {
        let origAlpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, boxWidth, boxHeight);
        ctx.globalAlpha = origAlpha;
    }

    static colorRectOutline(ctx, x, y, boxWidth, boxHeight, fillColor, alpha=1) {
        let origAlpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = fillColor;
        ctx.strokeRect(x, y, boxWidth, boxHeight);
        ctx.globalAlpha = origAlpha;
    }

    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", err => reject(err));
            img.src = src;
        });
    }

    static loadJson(src) {
        return new Promise((resolve, reject) => {
            // read json file contents
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", () => {
                let obj = JSON.parse(xhr.responseText);
                resolve(obj)
            });
            xhr.addEventListener("error", err => reject(err));
            xhr.open("GET", src, true);
            xhr.setRequestHeader("Cache-Control", "no-store");
            xhr.send();
        });
    }

    static objKeyValue(obj, key, dflt) {
        return (obj && obj.hasOwnProperty(key)) ? obj[key] : dflt;
    }

    static bind(obj, ...names) {
        for (const name of names) {
            obj[name] = obj[name].bind(obj);
        }
    }

    static feq(v1, v2) {
        return Math.abs(v1 - v2) < .00001;
    }

    static iterable(obj) {
        if (obj == null) return false;
        if (typeof obj[Symbol.iterator] === 'function') return true;
        return false;
    }

    /*
    static empty(obj) {
        if (!obj) return true;
        if (this.iterable(obj)) {
            for (const _ of obj) return false;
            return true;
        }
        if (obj.length) return false;
        return true;
    }
    */

    static arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        for (let i=0; i<a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    static arrayContains(array, obj) {
        if (!obj.equals) return false;
        for (const v of array) {
            if (obj.equals(v)) return true;
        }
        return false;
    }

    static getpath(obj, path, dflt=null) {
        let node = obj;
        for (const key of path.split('.')) {
            if (!node || !node.hasOwnProperty(key)) return dflt;
            node = node[key];
        }
        return (node !== undefined) ? node : dflt;
    }

    static setpath(obj, path, v) {
        let node = obj;
        let ptokens = path.split('.');
        let key = ptokens[ptokens.length-1];
        ptokens = ptokens.slice(0,-1);
        for (const token of ptokens) {
            if (!node.hasOwnProperty(token)) {
                node[token] = {}
            }
            node = node[token];
        }
        node[key] = v;
    }

    static delpath(obj, path) {
        let node = obj;
        let ptokens = path.split('.');
        let key = ptokens[ptokens.length-1];
        ptokens = ptokens.slice(0,-1);
        for (const token of ptokens) {
            if (!node.hasOwnProperty(token)) return;
            node = node[token];
        }
        delete node[key];
    }


    static _update(target, ext) {
        //console.log(`target: ${Fmt.ofmt(target)} exts: ${Fmt.ofmt(ext)}`)
        for (const [k,v] of Object.entries(ext)) {
            // -- handle simple values ... overwrite or assign target property
            if (!v || typeof v !== 'object' || v instanceof Gizmo || Array.isArray(v)) {
                target[k] = v;
            // -- handle objects
            } else {
                target[k] = this._update((k in target) ? target[k] : {}, v);
            }
        }
        return target;
    }

    /**
     * update performs a deep copy of the provided extension objects to the target object.
     * All updates are added as extensions to the original object, so nested values in the target are only overwritten if that same path/key is in the extension update
     * @param {*} target 
     * @param  {...any} exts 
     * @returns 
     */
    static update(target, ...exts) {
        if (target && typeof target === 'object') {
            for (const ext of exts) {
                if (ext && typeof ext === 'object') {
                    this._update(target, ext);
                }
            }
        }
        return target;
    }

    static findBest(items, evalFcn=(v)=>v, cmpFcn=(v1,v2) => v1<v2, filterFcn=(v)=>true, itemFilterFcn=(v)=>true) {
        let bestItem;
        let bestValue;
        for (const item of items) {
            let value = evalFcn(item);
            if (!filterFcn(value)) continue;
            if (!itemFilterFcn(item)) continue;
            if (!bestItem || cmpFcn(value,bestValue)) {
                bestItem = item;
                bestValue = value;
            }
        }
        return bestItem;
    }

    static getOrAssign(obj, tag, dflt=[]) {
        if (tag in obj) return obj[tag];
        obj[tag] = dflt;
        return dflt;
    }

    // Refer to: http://rosettacode.org/wiki/Bitmap/Bresenham's_line_algorithm#JavaScript
    static *pixelsInSegment(x0, y0, x1, y1) {
        let dx = Math.abs(x1 - x0);
        let sx = x0 < x1 ? 1 : -1;
        let dy = Math.abs(y1 - y0);
        let sy = y0 < y1 ? 1 : -1; 
        let err = (dx>dy ? dx : -dy)/2;        
        while (true) {
            yield [x0,y0];
            if (x0 === x1 && y0 === y1) break;
            var e2 = err;
            if (e2 > -dx) { 
                err -= dy; 
                x0 += sx; 
            }
            if (e2 < dy) { 
                err += dx; 
                y0 += sy; 
            }
        }
    }

    static *pixelsInCross(x, y, dir, width) {
        let ortho = Direction.orthogonal(dir);
        let x0 = Math.round(x-Math.abs(Direction.asX(ortho)*width/2));
        let y0 = Math.round(y-Math.abs(Direction.asY(ortho)*width/2));
        let x1 = Math.floor(x+Math.abs(Direction.asX(ortho)*width/2));
        let y1 = Math.floor(y+Math.abs(Direction.asY(ortho)*width/2));
        yield *this.pixelsInSegment(x0, y0, x1, y1);
    }

    static getSegmentIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
        let s1_x = p1_x - p0_x;     
        let s1_y = p1_y - p0_y;
        let s2_x = p3_x - p2_x;     
        let s2_y = p3_y - p2_y;
        let s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        let t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
        // collision detected
        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            return {x: p0_x + (t * s1_x), y: p0_y + (t * s1_y)};
        }
        // no collision
        return null;
    }

    static *pixelsInSegmentWidth(x0, y0, x1, y1, width) {
        if (width <= 1) {
            yield *this.pixelsInSegment(x0, y0, x1, y1);
            return;
        }
        // compute angle and perpindicular
        let angle = Mathf.angle(x0, y0, x1, y1, true);
        let pangle = angle + Math.PI / 2;
        // there are four points that create a rectangle
        let hw = (width / 2) - .5;
        let dx = Math.cos(pangle) * hw;
        let dy = Math.sin(pangle) * hw;
        let r0x = x0 + dx;
        let r0y = y0 + dy;
        let r1x = x0 - dx;
        let r1y = y0 - dy;
        let r2x = x1 + dx;
        let r2y = y1 + dy;
        let r3x = x1 - dx;
        let r3y = y1 - dy;
        let mini = Math.floor(Math.min(r0x, r1x, r2x, r3x));
        let maxi = Math.round(Math.max(r0x, r1x, r2x, r3x));
        let minj = Math.floor(Math.min(r0y, r1y, r2y, r3y));
        let maxj = Math.round(Math.max(r0y, r1y, r2y, r3y));
        // sweep rectangle
        if (Math.abs(angle) < Math.PI*.25 || Math.abs(angle) > Math.PI*.75) {
            // -- sweep full i range
            for (let i = mini; i <= maxi; i++) {
                let iminj = maxj;
                let imaxj = minj;
                for (const [s0x, s0y, s1x, s1y] of [
                    [r0x, r0y, r2x, r2y],
                    [r0x, r0y, r1x, r1y],
                    [r3x, r3y, r2x, r2y],
                    [r3x, r3y, r1x, r1y]
                ]) {
                // check for segment to sweep intersection
                let intersection = this.getSegmentIntersection(s0x, s0y, s1x, s1y, i, minj-1, i, maxj+1);
                if (intersection) {
                    let j = Math.round(intersection.y);
                    if (j > imaxj) imaxj = j;
                    if (j < iminj) iminj = j;
                }
                }
                // -- sweep j range based on detected intersections
                for (let j = iminj; j <= imaxj; j++) {
                    yield [i, j];
                }
            }

        } else {
            // -- sweep full j range
            for (let j = minj; j <= maxj; j++) {
                let imini = maxi;
                let imaxi = mini;
                for (const [s0x, s0y, s1x, s1y] of [
                    [r0x, r0y, r2x, r2y],
                    [r0x, r0y, r1x, r1y],
                    [r3x, r3y, r2x, r2y],
                    [r3x, r3y, r1x, r1y]
                ]) {
                // check for segment to sweep intersection
                let intersection = this.getSegmentIntersection(s0x, s0y, s1x, s1y, mini-1, j, maxi+1, j);
                if (intersection) {
                    let i = Math.round(intersection.x);
                    if (i > imaxi) imaxi = i;
                    if (i < imini) imini = i;
                }
                }
                // -- sweep i range based on detected intersections
                for (let i = imini; i <= imaxi; i++) {
                    yield [i, j];
                }
            }
        }

    }


}