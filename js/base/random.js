export { Random };

class Random {
    static random() {
        return Math.random();
    }

    static randomInt() {
        return Math.random() * Number.MAX_SAFE_INTEGER;
    }

    static rangeInt(min, max) {
        return Math.floor(Math.random() * (Math.abs(max-min)+1)) + Math.min(min,max);
    }

    static jitter(base, pct) {
        let v = base * pct * Math.random();
        return (Math.random() > .5) ? base + v : base - v;
    }

    static range(min, max) {
        return Math.random() * (max-min);
    }

    static choose(arr) {
        if (arr.length === 0) return undefined
        if (arr.length === 1) return arr[0];
        let choice = Math.floor(Math.random() * arr.length);
        return arr[choice];
    }

    static flip(pct=.5) {
        return (Math.random() < pct);
    }

}
