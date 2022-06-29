export { Generator };

    import { Assets } from "./assets.js";
    import { Fmt } from "./fmt.js";
import { Gizmo }                from "./gizmo.js";
import { Registry }             from "./registry.js";

class Generator {
    // STATIC VARIABLES ----------------------------------------------------
    static _instance;

    // STATIC PROPERTIES ---------------------------------------------------
    static get instance() {
        if (!this._instance) this._instance = new this();
        return this._instance;
    }

    // STATIC METHODS ------------------------------------------------------
    static generate(spec) {
        let obj = this.instance.generate(spec);
        if (!obj) console.error(`generator failed for ${Fmt.ofmt(spec)}`);
        return obj;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.registry = spec.registry || Registry;
        if (spec.hasOwnProperty('evtCreated')) this.evtCreated = spec.evtCreated;
        if (spec.hasOwnProperty('evtDestroyed')) this.evtDestroyed = spec.evtDestroyed;
    }

    // METHODS -------------------------------------------------------------
    resolve(spec) {
        for (const [k,v] of Object.entries(spec)) {
            if (k.startsWith('x_')) {
                let nv = undefined;
                if (Array.isArray(v)) {
                    nv = [];
                    for (const xchild of v) {
                        let obj = this.generate(xchild);
                        if (obj) nv.push(obj);
                    }
                } else {
                    if (v.cls === 'AssetRef') {
                        nv = Assets.get(v.tag, true);
                    } else {
                        nv = this.generate(v);
                    }
                }
                let nk = k.slice(2);
                spec[nk] = nv;
                delete spec[k];
            }
        }
    }

    generate(spec) {
        if (!spec) return undefined;
        // resolve sub references within spec...
        // -- sub references all start with 'x_' and are replaced with the generated object under a new key where the 'x_' has been stripped
        this.resolve(spec);
        // look up class definition
        let cls = this.registry.get(spec.cls);
        if (!cls) return undefined;
        // handle Gizmo specific event setting
        if (cls.prototype instanceof Gizmo) {
            if (this.evtCreated && !spec.evtCreated) spec.evtCreated = this.evtCreated;
            if (this.evtDestroyed && !spec.evtDestroyed) spec.evtDestroyed = this.evtDestroyed;
        }
        if (cls) return new cls(spec);
        return undefined;
    }

}