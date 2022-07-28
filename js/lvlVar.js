export { LvlVar };
import { Prng } from './base/prng.js';

class LvlVar {
    constructor(spec={}) {
        this.base = spec.base || 0;
        this.baseMin = spec.baseMin || 0;
        this.baseMax = spec.baseMax || 0;
        this.perLvlMin = spec.perLvlMin || 0;
        this.perLvlMax = spec.perLvlMax || 0;
        this.perLvl = spec.perLvl || 0;
    }

    calculate(lvl) {
        let v = (this.baseMin || this.baseMax) ? Prng.rangeInt(this.baseMin, this.baseMax) : this.base;
        for (let i=0; i<lvl; i++) {
            v += (this.perLvlMax || this.perLvlMin) ? Prng.rangeInt(this.perLvlMin, this.perLvlMax) : this.perLvl;
        }
        return Math.round(v);
    }
}