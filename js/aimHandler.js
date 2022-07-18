export { AimHandler };

import { Entity } from './base/entity.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Keys } from './base/keys.js';
import { MouseSystem } from './base/systems/mouseSystem.js';

/**
 * A mini-state to handle inputs during aiming
 */
class AimHandler extends Entity {
    cpost(spec) {
        super.cpost(spec);
        this.lvl = spec.lvl;
        // bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onLevelClick = this.onLevelClick.bind(this);
        this.onMouseMoved = this.onMouseMoved.bind(this);
        this.lvl.evt.listen(this.lvl.constructor.evtMouseClicked, this.onLevelClick);
        Events.listen(Keys.evtDown, this.onKeyDown);
        Events.listen(MouseSystem.evtMoved, this.onMouseMoved);
    }
    destroy() {
        super.destroy();
        this.lvl.evt.ignore(this.lvl.constructor.evtMouseClicked, this.onLevelClick);
        Events.ignore(Keys.evtDown, this.onKeyDown);
        Events.ignore(MouseSystem.evtMoved, this.onMouseMoved);
    }

    onKeyDown(evt) {
        console.log(`-- ${this} onKeyDown: ${Fmt.ofmt(evt)}`);
        switch (evt.key) {
            case 'Escape': {
                this.destroy();
                break;
            }
        }
    }

    onLevelClick(evt) {
        console.log(`-- ${this} onLevelClick: ${Fmt.ofmt(evt)}`);
    }

    onMouseMoved(evt) {
        console.log(`-- ${this} onMouseMoved: ${Fmt.ofmt(evt)}`);
    }

}