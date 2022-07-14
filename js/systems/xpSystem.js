export { XPSystem };

import { System } from '../base/system.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';

class XPSystem extends System {

    cpost(spec) {
        super.cpost(spec);
        this.player;
        this.onEnemyDeath = this.onEnemyDeath.bind(this);
        this.active = false;
    }

    onEntityAdded(evt) {
        if (this.matchPredicate(evt.actor)) {
            let actor = evt.actor;
            // has player emerged
            if (actor.cls === 'Player') {
                console.log(`-- ${this} player emerges: ${actor}`)
                this.player = actor;
            } else {
                console.log(`-- ${this} tracking enemy death: ${actor}`)
                actor.evt.listen(actor.constructor.evtDeath, this.onEnemyDeath);
            }
        }
    }

    onEnemyDeath(evt) {
        console.log(`${this} on enemy death: ${evt.actor}`);
        if (this.player) {
            let update = {
                xp: this.player.xp + evt.actor.xp,
            }
            UpdateSystem.eUpdate(this.player, update);
        }
    }

    matchPredicate(e) {
        return e.cls === 'Player' || e.xp;
    }

}