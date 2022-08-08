export { DetectSystem };

    import { RevealAction } from '../actions/reveal.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { Random } from '../base/random.js';
import { System } from '../base/system.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Util } from '../base/util.js';
import { OverlaySystem } from './overlaySystem.js';

/**
 * passive secret detection system
 */
class DetectSystem extends System {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.player;
        this.onPlayerUpdate = this.onPlayerUpdate.bind(this);
        this.onHiddenUpdate = this.onHiddenUpdate.bind(this);
        this.active = false;
        this.revealed = false;
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEntityAdded(evt) {
        if (evt.actor.cls === 'Player') {
            this.player = evt.actor;
            this.player.evt.listen(this.player.constructor.evtUpdated, this.onPlayerUpdate);
        }
        if (this.matchPredicate(evt.actor)) {
            if (this.dbg) console.log(`${this} onEntityAdded: ${Fmt.ofmt(evt)} gid: ${evt.actor.gid}`);
            evt.actor.evt.listen(evt.actor.constructor.evtUpdated, this.onHiddenUpdate);
            this.store.set(evt.actor.gid, evt.actor);
        }
    }
    onEntityRemoved(evt) {
        if (this.dbg) console.log(`${this} onEntityRemoved: ${Fmt.ofmt(evt)}`);
        evt.actor.evt.ignore(evt.actor.constructor.evtUpdated, this.onHiddenUpdate);
        this.store.delete(evt.actor.gid);
    }

    onPlayerUpdate(evt) {
        // check if actor index has changed
        if (evt.update && evt.update.hasOwnProperty('idx')) {
            this.active = true;
        }
    }

    onHiddenUpdate(evt) {
        // -- if no longer hidden, remove entity from tracked secret list
        if (evt.update && evt.update.hasOwnProperty('hidden')) {
            if (!evt.update.hidden) {
                evt.actor.evt.ignore(evt.actor.constructor.evtUpdated, this.onHiddenUpdate);
                this.store.delete(evt.actor.gid);
            }
        }
    }

    iterate(evt, e) {
        if (!this.player) return;
        // detect distance comes from player
        let scanDistance = this.player.scanDistance;
        let distance = Mathf.distance(this.player.xform.x, this.player.xform.y, e.xform.x, e.xform.y);
        if (distance > scanDistance) return;
        // roll for player detection
        // -- detect chance based on player savvy
        let detectChance = Mathf.lerp(8, 21, .1, .5, this.player.savvy);
        if (Random.flip(detectChance)) {
            // setup reveal action on entity
            let action = new RevealAction();
            ActionSystem.assign(e, action);
            this.revealed = true;
        }
    }

    matchPredicate(e) {
        return e.hidden;
    }

    finalize(evt) {
        this.active = false;
        if (this.revealed ) {
            Events.trigger(OverlaySystem.evtNotify, { actor: this.player, which: 'info', msg: `you noticed something` });
            this.revealed = false;
        }
    }

}