export { Cog };

import { Fmt } from '../base/fmt.js';
import { Item } from './item.js';

class Cog extends Item {
    static slot = 'belt';
    static stackable = true;
    static discoverable = true;
    cpost(spec) {
        super.cpost(spec);
    }
}