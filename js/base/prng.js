export { Prng };

/**
 * PRNG and related utility functions
 * Original seed/randint/randfloat functions from: Blixt @ https://gist.github.com/blixt/f17b47c62508be59987b
 */
class Prng {

    // STATIC VARIABLES ----------------------------------------------------
    static main = new Prng();

    // STATIC METHODS ------------------------------------------------------
    static seed(v) {
        return this.main.seed(v);
    }
    static random() {
        return this.main.random();
    }
    static randomInt() {
        return this.main.randomInt();
    }
    static rangeInt(min, max) {
        return this.main.rangeInt(min, max);
    }
    static jitter(base, pct) {
        return this.main.jitter(base, pct);
    }
    static range(min, max) {
        return this.main.range(min, max);
    }
    static choose(arr) {
        return this.main.choose(arr);
    }
    static flip(pct=.5) {
        return this.main.flip(pct);
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(seed=1) {
        this.state = seed;
    }

    //static _seed = 1;

    /**
     * Creates a pseudo-random value generator. The seed must be an integer.
     *
     * Uses an optimized version of the Park-Miller PRNG.
     * http://www.firstpr.com.au/dsp/rand31/
     */
    seed(v) {
        const last = this.state;
        this.state = v % 2147483647;
        if (this.state <= 0) this.state += 2147483646;
        return last;
    }

    /**
     * Returns a pseudo-random value between 1 and 2^32 - 2.
     */
    randomInt() {
        return this.state = this.state * 16807 % 2147483647;
    }

    rangeInt(min, max) {
        let v = this.randomInt();
        v %= (Math.abs(max-min)+1);
        return v+Math.min(min,max);
    }

    jitter(base, pct) {
        let v = base * pct * this.random();
        return (this.random() > .5) ? base + v : base - v;
    }

    range(min, max) {
        if (max <= min) return min;
        let v = this.random();
        v *= (max-min);
        return v+min;
    }

    choose(arr) {
        if (!arr || !arr.length) return undefined;
        if (arr.length === 1) return arr[0];
        let choice = this.rangeInt(0,arr.length-1);
        return arr[choice];
    }

    flip(pct=.5) {
        return this.random() < pct;
    }

    /**
     * Returns a pseudo-random floating point number in range [0, 1).
     */
    random() {
        // We know that result of next() will be 1 to 2147483646 (inclusive).
        return (this.randomInt() - 1) / 2147483646;
    };

}