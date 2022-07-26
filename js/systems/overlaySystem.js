export { OverlaySystem };

import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';

class OverlaySystem extends System {
    static evtNotify = 'overlay.notify';

    cpost(spec) {
        super.cpost(spec);
        this.onNotify = this.onNotify.bind(this);
        this.evt.listen(this.constructor.evtNotify, this.onNotify)
    }

    onNotify(evt) {
        console.log(`-- ${this} warning: ${Fmt.ofmt(evt)}`);
    }
}