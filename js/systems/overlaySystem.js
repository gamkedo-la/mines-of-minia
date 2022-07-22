export { OverlaySystem };

import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';

class OverlaySystem extends System {
    static evtWarn = 'overlay.warn';

    cpost(spec) {
        super.cpost(spec);
        this.onWarn = this.onWarn.bind(this);
        this.evt.listen(this.constructor.evtWarn, this.onWarn)
    }

    onWarn(evt) {
        console.log(`-- ${this} warning: ${Fmt.ofmt(evt)}`);
    }
}