export { Growth };

import { Assets } from '../base/assets.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Trap } from './trap.js';

/**
 * Growth is vegetation or similar in a dungeon that blocks line-of-sight.  If you step on it, it gets trampled, and you can then see again.
 * Derived from trap, as it's behavior is similar (triggered when something lands on it).
 */
class Growth extends Trap {
    // -- object has dynamic LoS block (can change during game state)
    static dynamicLoS = true;

    static get dfltTriggerSfx() {
        if (!this._dfltTriggerSfx) this._dfltTriggerSfx = Assets.get('growth.trigger', true);
        return this._dfltTriggerSfx;
    }
    cpost(spec) {
        super.cpost(spec);
        // -- los state
        this.blocksLoS = (this.state === 'armed');
    }

    trigger(actor) {
        super.trigger(actor);
        // once triggered, growth no longer blocks LoS
        UpdateSystem.eUpdate(this, { blocksLoS: false });
    }

}