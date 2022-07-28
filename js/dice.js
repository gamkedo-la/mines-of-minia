export { Dice };

import { Prng } from './base/prng.js';

class Dice {
    static fromStr(str) {
        // XdX[(H|L)X][(+|-)X]
        // eg: 2d6H1+5
        // -- 2: two dice
        // -- d6: type of dice (# sides)
        // -- H1: take top 1 rolls, L1 to take bottom 1 roll
        // -- +5: modifier for final result (+/- added to total dice roll)
        let re = /([0-9]+)d([0-9]+)(([H|L])([0-9]+))*([+-][0-9]+)*/;
        let m = str.match(re);
        console.log(`m: ${m}`);
        let x_roll = {};
        if (m) {
            x_roll.num = parseInt(m[1]);
            x_roll.sides = parseInt(m[2]);
            if (m[3]) {
                if (m[4] === 'H') {
                    x_roll.hi = Math.min(num, parseInt(m[5]))
                } else {
                    x_roll.lo = Math.min(num, parseInt(m[5]))
                }
            }
            if (m[6]) {
                x_roll.mod = parseInt(m[6]);
            }
        }
        return new Dice(x_roll);
    }

    static roll(str) {
        let dice = this.fromStr(str);
        return dice.roll();
    }

    constructor(spec={}) {
        this.sides = spec.sides || 1;
        this.num = spec.num || 1;
        this.hi = spec.hi || 0;
        this.lo = spec.lo || 0;
        this.mod = spec.mod || 0;
    }

    roll() {
        let rolls = [];
        for (let i=0; i<this.num; i++) rolls.push(Prng.rangeInt(1,this.sides));
        rolls.sort();
        let s = (this.hi) ? rolls.length-this.hi : 0;
        let e = (this.lo) ? this.lo : rolls.length;
        let v = rolls.slice(s,e).reduce((p,c) => p+c, 0);
        return v+this.mod;
    }

    toString() {
        let str = `${this.num}d${this.sides}`;
        if (this.hi) str += `H${this.hi}`;
        if (this.lo) str += `L${this.lo}`;
        if (this.mod > 0) str += `+${this.mod}`;
        if (this.mod < 0) str += `${this.mod}`;
        return str;
    }

}