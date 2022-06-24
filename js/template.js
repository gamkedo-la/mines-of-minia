export { Template };

import { SheetRef } from "./base/assets.js";
import { Fmt } from "./base/fmt.js";
import { VarSprite } from "./base/varSprite.js";


class Template {

    static varsprite(file, tag, variations, spec={}) {
        let width = spec.width || 8;
        let height = spec.height || 8;
        return VarSprite.xspec({
            tag: tag,
            variations: variations.map(([i,j]) => new SheetRef({src: file, width: width, height: height, x: width*i, y: height*j})),
        });
    }

    static walls(file, tag, spec={}) {
        let vars = spec.vars || {};
        let x_refs = [
            this.varsprite(file, `${tag}.a`, vars.a || [[2,0],[0,2]], spec),
            this.varsprite(file, `${tag}.b`, vars.b || [[3,0],[1,2],[5,2]], spec),
            this.varsprite(file, `${tag}.c`, vars.c || [[4,0],[6,2]], spec),
            this.varsprite(file, `${tag}.d`, vars.d || [[2,1],[0,3]], spec),
            this.varsprite(file, `${tag}.e`, vars.e || [[4,1],[6,3]], spec),
            this.varsprite(file, `${tag}.f`, vars.f || [[2,2]], spec),
            this.varsprite(file, `${tag}.g`, vars.g || [[4,2]], spec),
            this.varsprite(file, `${tag}.h`, vars.h || [[0,4],[2,6]], spec),
            this.varsprite(file, `${tag}.i`, vars.i || [[3,6],[1,4],[5,4]], spec),
            this.varsprite(file, `${tag}.j`, vars.j || [[2,4]], spec),
            this.varsprite(file, `${tag}.k`, vars.k || [[4,4]], spec),
            this.varsprite(file, `${tag}.l`, vars.l || [[6,4],[4,6]], spec),
            this.varsprite(file, `${tag}.m`, vars.m || [[0,5],[2,7]], spec),
            this.varsprite(file, `${tag}.n`, vars.n || [[1,5]], spec),
            this.varsprite(file, `${tag}.o`, vars.o || [[3,7]], spec),
            this.varsprite(file, `${tag}.p`, vars.p || [[4,7],[6,5]], spec),
            this.varsprite(file, `${tag}.q`, vars.q || [[5,5]], spec),
            this.varsprite(file, `${tag}.z`, vars.z || [[3,1]], spec),
        ];
        return x_refs;
    }

    static tiles(file, tag, spec={}) {
        let vars = spec.vars || {};
        let x_refs = [
            this.varsprite(file, `${tag}.a`, vars.a || [[2,0],[0,2]], spec),
            this.varsprite(file, `${tag}.b`, vars.b || [[3,0],[1,2],[5,2]], spec),
            this.varsprite(file, `${tag}.c`, vars.c || [[4,0],[6,2]], spec),
            this.varsprite(file, `${tag}.d`, vars.d || [[2,1],[0,3]], spec),
            this.varsprite(file, `${tag}.e`, vars.e || [[4,1],[6,3]], spec),
            this.varsprite(file, `${tag}.f`, vars.f || [[2,2]], spec),
            this.varsprite(file, `${tag}.g`, vars.g || [[4,2]], spec),
            this.varsprite(file, `${tag}.h`, vars.h || [[0,4],[2,6]], spec),
            this.varsprite(file, `${tag}.i`, vars.i || [[3,6],[1,4],[5,4]], spec),
            this.varsprite(file, `${tag}.j`, vars.j || [[2,4]], spec),
            this.varsprite(file, `${tag}.k`, vars.k || [[4,4]], spec),
            this.varsprite(file, `${tag}.l`, vars.l || [[6,4],[4,6]], spec),
            this.varsprite(file, `${tag}.z`, vars.z || [[3,1]], spec),
        ];
        return x_refs;
    }

}