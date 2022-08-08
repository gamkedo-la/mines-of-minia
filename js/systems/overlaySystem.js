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
        switch (evt.which) {
            case 'info': {
                console.log(`-- ${this} info: ${evt.msg}`);
                break;
            }
            case 'warn': {
                console.log(`-- ${this} warn: ${evt.msg}`);
                break;
            }
            case 'vfx': {
                console.log(`-- ${this} start vfx: ${evt.vfx}`);
                break;
            }
        }

    }
}