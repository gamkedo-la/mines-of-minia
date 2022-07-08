export { Gem };

import { Fmt } from '../base/fmt.js';
import { Item } from './item.js';

class Gem extends Item {
    static slot = 'belt';
    static stackable = true;
    cpost(spec) {
        console.log(`gem spec: ${Fmt.ofmt(spec)}`);
        super.cpost(spec);
    }
}