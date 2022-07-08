export { Token };

import { Item } from './item.js';

class Token extends Item {
    static slot = 'tokens';
    static stackable = true;
    cpost(spec) {
        super.cpost(spec);
        this.count = spec.count || 1;
    }
}