export { Key };

import { Assets } from '../base/assets.js';
import { Item } from './item.js';

class Key extends Item {
    static slot = 'key';
    static stackable = true;

    static kinds = [
        'blue',
        'dark',
        'green',
    ];
    static dfltKind = 'blue';

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // parse kind
        let kind = spec.kind || this.dfltKind;
        // final spec
        return Object.assign( {}, this.spec, {
            kind: kind,
            x_sketch: Assets.get(`key.${kind}`),
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
    }

    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            kind: this.kind,
        });
    }

}