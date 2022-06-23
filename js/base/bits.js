export { Bits };

class Bits {

    static values = [];
    
    constructor(kvs={}) {
        this._tags = new Map();
        this._ids = new Map();
        this._id = 0;
        this.get = this.get.bind(this);
        this._all = 0;
        for (let [k,v] of this.constructor.values) {
            v = parseInt(v);
            this._all |= v;
            this._ids.set(v, k);
            this._tags.set(k, v);
        }
        for (let [k,v] of Object.entries(kvs)) {
            v = parseInt(v);
            this._all |= v;
            this._ids.set(v, k);
            this._tags.set(k, v);
        }

        let handler = {
            get: function (target, prop, receiver) {
                if ((!prop.startsWith('_') && prop !== 'get' && prop !== 'all')) {
                    return target.get(prop);
                }
                return Reflect.get(...arguments);
            },
        };
        return new Proxy(this, handler);
    }

    get all() {
        return this._all;
    }

    get(tag) {
        if (this._tags.has(tag)) {
            return this._tags.get(tag);
        }
        for (;this._ids.has(1<<this._id); this._id++);
        let mask = 1<<this._id;
        this._all |= mask;
        this._ids.set(mask, tag);
        this._tags.set(tag, mask);
        return mask;
    }

}