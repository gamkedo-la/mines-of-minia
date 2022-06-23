export { UxDbg };

import { Util } from "./util.js";
import { UxView } from "./uxView.js";

class UxDbg extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltTag = 'dbg';
    static dfltColor = 'red';
    static canvases = {};
    static dfltWidth = 1000;
    static dfltHeight = 1000;
    static viewMap = {};
    static dbgColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

    // STATIC PROPERTIES ---------------------------------------------------
    static get dbgColor() {
        if (this.dbgColors.length) {
            return this.dbgColors.shift();
        } else {
            return 'pink';
        }
    }

    // STATIC METHODS ------------------------------------------------------
    static trigger(tag) {
        for (const view of (this.viewMap[tag]) || []) {
            if (!(view.triggered)) {
                view.triggered = true;
                view.evt.trigger(view.constructor.evtUpdated, {actor: view});
            }
        }
    }

    static clear(opts={}) {
        let tag = opts.tag || this.dfltTag;
        let cvs = this.getCanvas(tag);
        let ctx = this.getCtx(tag);
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        this.trigger(tag);
    }
    static drawLine(x1,y1, x2,y2, opts={}) {
        let tag = opts.tag || this.dfltTag;
        let color = opts.color || this.dfltColor;
        let ctx = this.getCtx(tag);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.stroke();
        this.trigger(tag);
    }

    static drawTile(i, j, opts={}) {
        let tag = opts.tag || this.dfltTag;
        let x = opts.x || 0;
        let y = opts.y || 0;
        let tileSize = opts.tileSize || 1;
        let color = opts.color || this.dfltColor;
        let fill = opts.fill || false;
        let ctx = this.getCtx(tag);
        let rx = x + i*tileSize;
        let ry = y + j*tileSize;
        if (fill) {
            ctx.fillStyle = color;
            ctx.fillRect(rx, ry, tileSize, tileSize);
        } else {
            ctx.strokeStyle = color;
            ctx.strokeRect(rx, ry, tileSize, tileSize);
        }
        this.trigger(tag);
    }

    static drawRect(x, y, w, h, opts={}) {
        let tag = opts.tag || this.dfltTag;
        let color = opts.color || this.dfltColor;
        let fill = opts.fill || false;
        let ctx = this.getCtx(tag);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        } else {
            ctx.strokeStyle = color;
            ctx.strokeRect(x, y, w, h);
        }
        this.trigger(tag);
    }

    static drawArc(x, y, radius, opts={}) {
        let tag = opts.tag || this.dfltTag;
        let color = opts.color || this.dfltColor;
        let fill = opts.fill || false;
        let startAngle = opts.startAngle || 0;
        let endAngle = opts.endAngle || Math.PI*2;
        let pie = opts.pie || false;
        let ctx = this.getCtx(tag);
        ctx.beginPath();
        if (pie) {
            ctx.moveTo(x, y);
            ctx.lineTo(x+Math.cos(startAngle)*radius, y+Math.sin(startAngle)*radius);
        }
        ctx.arc(x, y, radius, startAngle, endAngle);
        if (pie) {
            ctx.moveTo(x+Math.cos(endAngle)*radius, y+Math.sin(endAngle)*radius);
            ctx.lineTo(x,y);
        }
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        this.trigger(tag);
    }

    static getCanvas(tag) {
        if (tag in this.canvases) return this.canvases[tag];
        let cvs = document.createElement('canvas');
        cvs.id = tag;
        cvs.width = UxDbg.dfltWidth;
        cvs.height = UxDbg.dfltHeight;
        this.canvases[tag] = cvs;
        return cvs;
    }

    static getCtx(tag) {
        let cvs = this.getCanvas(tag);
        let ctx = cvs.getContext('2d');
        return ctx;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.cvs = this.constructor.getCanvas(this.tag);
        this.ctx = this.cvs.getContext('2d');
        this.onRooted = this.onRooted.bind(this);
        this.evt.listen(this.constructor.evtRooted, this.onRooted);
        Util.getOrAssign(this.constructor.viewMap, this.tag).push(this);
    }
    destroy() {
        let viewMap = Util.getOrAssign(this.constructor.viewMap, this.tag);
        let idx = viewMap.indexOf(this);
        if (idx !== -1) viewMap.splice(idx, 1);
    }

    onResized(evt) {
        if (this.cvs.width !== this.xform.width || this.cvs.height !== this.xform.height) {
            this.cvs.width = this.xform.width;
            this.cvs.height = this.xform.height;
        }
    }

    onRooted(evt) {
        if (this.cvs.width !== this.xform.width || this.cvs.height !== this.xform.height) {
            this.cvs.width = this.xform.width;
            this.cvs.height = this.xform.height;
        }
    }

    _render(ctx) {
        this.triggered = false;
        if (this.cvs.width && this.cvs.height) {
            ctx.drawImage(this.cvs, this.xform.minx, this.xform.miny);
        }

    }


}