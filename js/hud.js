export { Hud };

import { Sketch } from './base/sketch.js';
import { UxPanel } from './base/uxPanel.js';
import { UxView } from './base/uxView.js';


class Hud extends UxView {
    cpost(spec) {
        super.cpost(spec);
        // build out hud
        this.adopt( new UxPanel({
            sketch: Sketch.zero,
        }));
    }
}