export { Enum };

class Enum {
    
    constructor(kvs={}) {
        this._tags = new Map();
        this._ids = new Map();
        this._id = 0;
        this.get = this.get.bind(this);
        for (let [k,v] of Object.entries(kvs)) {
            v = parseInt(v);
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

    get(tag) {
        if (this._tags.has(tag)) {
            return this._tags.get(tag);
        }
        for (;this._ids.has(this._id); this._id++);
        let id = this._id;
        this._ids.set(id, tag);
        this._tags.set(tag, id);
        return id;
    }

}