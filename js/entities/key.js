export { Key };

import { Item } from './item.js';

class Key extends Item {
    static slot = 'key';
    static stackable = true;

    static kinds = [
        'gold',
        'dark',
        'blue',
    ];
    static dfltKind = 'gold';

    cpost(spec) {
        super.cpost(spec);
        this.kind = spec.kind || this.constructor.dfltKind;
    }
}