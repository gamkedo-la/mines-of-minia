export { XPSystem };

    import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Player } from '../entities/player.js';
import { OverlaySystem } from './overlaySystem.js';

class XPSystem extends System {

    cpost(spec) {
        super.cpost(spec);
        this.player;
        this.onEnemyDeath = this.onEnemyDeath.bind(this);
        this.onPlayerAttack = this.onPlayerAttack.bind(this);
        this.active = false;
    }

    onEntityAdded(evt) {
        if (this.matchPredicate(evt.actor)) {
            let actor = evt.actor;
            // has player emerged
            if (actor.cls === 'Player') {
                if (this.dbg) console.log(`-- ${this} player emerges: ${actor}`)
                this.player = actor;
                this.player.evt.listen(this.player.constructor.evtAttacked, this.onPlayerAttack);
            } else {
                if (this.dbg) console.log(`-- ${this} tracking enemy death: ${actor}`)
                actor.evt.listen(actor.constructor.evtDeath, this.onEnemyDeath);
            }
        }
    }

    onPlayerAttack(evt) {
        if (this.dbg) console.log(`${this} on player attack: ${evt.actor}`);
        if (this.player) {
            let kind = evt.weapon.kind;
            let xp = this.player.weaponxps[kind] || 0;
            let update = {
                weaponxps: {
                    [kind]: xp + 1,
                }
            }
            UpdateSystem.eUpdate(this.player, update);
            if (this.dbg) console.log(`player weaponxp: ${Fmt.ofmt(this.player.weaponxps)}`);
        }
    }

    onEnemyDeath(evt) {
        if (this.dbg) console.log(`${this} on enemy death: ${evt.actor}`);
        if (this.player) {
            Events.trigger(OverlaySystem.evtNotify, {which: 'popup.green', actor: this.player, msg: `+${evt.actor.xp} xp`});
            let update = {
                xp: this.player.xp + evt.actor.xp,
            }
            // determine xp required for next level
            let needxp = Player.xpReqsByLvl[this.player.lvl];
            if (this.dbg) console.log(`-- need xp: ${needxp} update.xp: ${update.xp}`);
            if (needxp && update.xp >= needxp) {
                Events.trigger(OverlaySystem.evtNotify, {which: 'info', actor: this.player, msg: `-- player level up --`});
                update.lvl = this.player.lvl + 1;
                // update player atts
                let attUpdates = Player.attUpdatesByLvl[update.lvl];
                if (attUpdates) {
                    for (const [k,v] of Object.entries(attUpdates)) {
                        // healthMax also updates current health
                        if (k === 'healthMax') update.health = this.player.health + v;
                        update[k] = this.player[k] + v;
                    }
                }
                if (this.dbg) console.log(`update player level: ${this.player.lvl} -> ${update.lvl}`);
            }
            UpdateSystem.eUpdate(this.player, update);
        }
    }

    matchPredicate(e) {
        return e.cls === 'Player' || e.xp;
    }

}