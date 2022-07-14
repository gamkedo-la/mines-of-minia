export { XPSystem };

import { System } from '../base/system.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Player } from '../entities/player.js';

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
            // determine xp required for next level
            let needxp = Player.xpReqsByLvl[this.player.lvl];
            console.log(`-- need xp: ${needxp} update.xp: ${update.xp}`);
            if (needxp && update.xp >= needxp) {
                update.lvl = this.player.lvl + 1;
                // update player atts
                let attUpdates = Player.attUpdatesByLvl[update.lvl];
                if (attUpdates) {
                    for (const [k,v] of Object.entries(attUpdates)) {
                        // healthMax also updates current health
                        if (k === 'healthMax') update.health = v;
                        update[k] = this.player[k] + v;
                    }
                }
                console.log(`update player level: ${this.player.lvl} -> ${update.lvl}`);
            }
            UpdateSystem.eUpdate(this.player, update);
        }
    }

    matchPredicate(e) {
        return e.cls === 'Player' || e.xp;
    }

}