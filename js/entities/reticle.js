export { Reticle };

import { Rect } from '../base/rect.js';
import { Item } from './item.js';

class Reticle extends Item {
    static lootable = false;
    static get dfltSketch() {
        return new Rect({ width: 14, height: 14, border: 2, borderColor: 'rgba(255,0,255,.75)', fill: false });
    }
}