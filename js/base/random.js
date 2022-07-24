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

    static chooseWeightedOption(arr) {
        // count weights
        if (!arr || !arr.length) return null;
        if (arr.length === 1) return arr[0];
        let weights = arr.reduce((pv, cv) => (pv.weight||1)+(cv.weight||1), 0);
        let choice = Math.random() * weights;
        for (let i=0, t=0; i<arr.length; i++) {
            let w = arr[i].weight || 1;
            if (choice >= t && choice < t+w) {
                return arr[i];
            }
            t += w;
        }
        return arr[arr.length-1];
    }

}
