export { Growth };

    import { DropLootAction } from '../actions/loot.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Fmt } from '../base/fmt.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Trap } from './trap.js';

/**
 * Growth is vegetation or similar in a dungeon that blocks line-of-sight.  If you step on it, it gets trampled, and you can then see again.
 * Derived from trap, as it's behavior is similar (triggered when something lands on it).
 */
class Growth extends Trap {
    // -- object has dynamic LoS block (can change during game state)
    static dynamicLoS = true;
    static flammable = true;

    static get dfltTriggerSfx() {
        if (!this._dfltTriggerSfx) this._dfltTriggerSfx = Assets.get('growth.trigger', true);
        return this._dfltTriggerSfx;
    }
    cpost(spec) {
        super.cpost(spec);
        this.bgoZed = spec.bgoZed || Config.bgoZed;
        // -- los state
        this.blocksLoS = (this.state === 'armed');
        // -- loot
        this.loot = spec.loot || [];
    }
 
    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            bgoZed: this.bgoZed,
            loot: this.loot,
        });
    }

    trigger(actor) {
        super.trigger(actor);
        // spawn any loot
        for (let loot of (this.loot || [])) {
            ActionSystem.assign(this, new DropLootAction({
                lootSpec: loot,
            }));
        }
        // once triggered, growth no longer blocks LoS
        UpdateSystem.eUpdate(this, { blocksLoS: false, z: this.bgoZed });
    }

    burn(actor) {
        super.trigger(actor);
        // once triggered, growth no longer blocks LoS
        UpdateSystem.eUpdate(this, { blocksLoS: false, z: this.bgoZed });
    }

}