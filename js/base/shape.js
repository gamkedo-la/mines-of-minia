export { Shape };
import { Sketch }           from "./sketch.js";

/** ========================================================================
 * A shape is a simple sketch primitive utilizing js Path2D to render a shape
 */
class Shape extends Sketch {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.border = spec.border || 0;
        this.fill = spec.hasOwnProperty("fill") ? spec.fill : true;
        this.color = spec.color || "rgba(127,127,127,1)";
        this.borderColor = spec.borderColor || "black";
        let verts = spec.verts || [{x:0,y:0}, {x:20,y:0}, {x:20,y:20}, {x:0,y:20}];
        let [path, min, max] = this.toPath(verts)
        this.path = path;
        this.dx = -min.x;
        this.dy = -min.y;
        this._iwidth = max.x-min.x;
        this._iheight = max.y-min.y;
        if (!spec.hasOwnProperty('width')) this.width = this._iwidth;
        if (!spec.hasOwnProperty('height')) this.height = this._iheight;
    }

    // PROPERTIES ----------------------------------------------------------
    get iwidth() {
        return this._iwidth;
    }
    get iheight() {
        return this._iheight;
    }

    // METHODS -------------------------------------------------------------
    toPath(verts) {
        let path = new Path2D();
        let min = {x: verts[0].x, y:verts[0].y};
        let max = {x: verts[0].x, y:verts[0].y};
        path.moveTo(verts[0].x, verts[0].y);
        for (let i=1; i<verts.length; i++) {
            let vert = verts[i];
            if (vert.x < min.x) min.x = vert.x;
            if (vert.x > max.x) max.x = vert.x;
            if (vert.y < min.y) min.y = vert.y;
            if (vert.y > max.y) max.y = vert.y;
            path.lineTo(vert.x, vert.y);
        }
        path.closePath();
        return [path, min, max];
    }

    _render(ctx, x=0, y=0, width=0, height=0) {
        // translate
        let cform = ctx.getTransform();
        if (x || y) ctx.translate(x, y);
        let scalex = 1, scaley = 1;
        if ((this._iwidth && this._iheight) && (width !== this._iwidth || height !== this._iheight)) {
            scalex = width/this._iwidth;
            scaley = height/this._iheight;
            ctx.scale(scalex, scaley);
        }
        if (this.dx || this.dy) ctx.translate(this.dx, this.dy);
        if (this.fill) {
            ctx.fillStyle = this.color;
            ctx.fill(this.path);
        }
        if (this.border) {
            ctx.lineWidth = this.border;
            ctx.strokeStyle = this.borderColor;
            ctx.stroke(this.path);
        }
        ctx.setTransform(cform);
    }    
}