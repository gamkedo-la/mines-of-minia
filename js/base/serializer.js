export { Serializer };

import { Gizmo } from "./gizmo.js";

class Serializer {

    static serializeLoot(loot) {
        let x_loot = [];
        for (const l of loot) {
            if (l.x_sketch) l.x_sketch = { cls: 'AssetRef', tag: l.x_sketch.tag };
            if (l.sketch) {
                l.x_sketch = { cls: 'AssetRef', tag: l.x_sketch.tag };
                delete l.sketch;
            }
            x_loot.push(l);
        }
        return x_loot;
    }

    static _xify(obj) {
        // falsy value
        if (!obj) return obj;
        // non objects
        if (typeof obj !== 'object') return obj;
        let kvs = {};
        for (const key of Object.getOwnPropertyNames(obj)) {
            let k = key;
            let v = obj[key];
            // handle special case keys
            if (key.startsWith("__")) { console.log(`--skip: ${key}`); continue };
            if (`_serialize_skip_${key}` in obj.constructor) { console.log(`-- skip: ${key}`); continue };
            if (key.startsWith("_")) k = key.slice(1);
            if (v instanceof Gizmo) {
                k = `x_${k}`;
            }
            // handle translation of value
            // handle special serialization rules
            if (`_serialize_${key}` in obj.constructor) {
                v = obj.constructor[`_serialize_${key}`](v);
            } else if (v && v.serialize) {
                v = v.serialize();
            } else {
                v = this._xify(v);
            }
            /*
            } else if (v && typeof v === 'object') {
                v = this._kvs(v);
            } else if (v && Array.isArray(v)) {
                v = v.map((x) => this._kvs(x));
            }
            */
            kvs[k] = v;
        }
        return kvs;
    }

    static serialize(obj) {
        // translate object to kv dict
        let kvs = this._xify(obj);
        /*
        let skip = obj.constructor._serialize_skip || [];
        console.log(`skip: ${skip}`);
        for (const key of Object.getOwnPropertyNames(obj)) {
            let k = key;
            let v = obj[key];
            // handle special case keys
            if (key.startsWith("__" || skip.includes(key))) continue;
            // handle special serialization rules
            if (obj.constructor.hasOwnProperty(`_serialize_${key}`)) {
                v = obj.constructor[`_serialize_${key}`](v);
            } else if (key.startsWith("_")) {
                k = key.slice(1);
            }
            // handle translation of value
            if (v && v.serialize) {
                newvalue = v.serialize();
            }
            kvs[k] = v;
        }
        */
        return JSON.stringify(kvs);
    }

    static spec(str) {
        return JSON.parse(str);
    }
}