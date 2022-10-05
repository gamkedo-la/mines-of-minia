export { DetectSystem };

import { RevealAction } from '../actions/reveal.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { Random } from '../base/random.js';
import { System } from '../base/system.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { MiniaModel } from '../entities/miniaModel.js';
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
        this.lvl = spec.lvl;
        Events.listen(MiniaModel.evtUpdated, this.onHiddenUpdate);
    }
    destroy() {
        super.destroy();
        Events.ignore(MiniaModel.evtUpdated, this.onHiddenUpdate);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEntityAdded(evt) {
        if (evt.actor.cls === 'Player') {
            this.player = evt.actor;
            this.player.evt.listen(this.player.constructor.evtUpdated, this.onPlayerUpdate);
        }
        if (this.matchPredicate(evt.actor)) {
            if (this.dbg) console.log(`${this} onEntityAdded: ${Fmt.ofmt(evt)} gid: ${evt.actor.gid}`);
            this.store.set(evt.actor.gid, evt.actor);
        }
    }
    onEntityRemoved(evt) {
        if (this.dbg) console.log(`${this} onEntityRemoved: ${Fmt.ofmt(evt)}`);
        this.store.delete(evt.actor.gid);
    }

    onPlayerUpdate(evt) {
        // check if actor index has changed
        if (evt.update && evt.update.hasOwnProperty('idx')) {
            this.active = true;
        }
    }

    onHiddenUpdate(evt) {
        // ignore player
        if (evt.actor && evt.actor == this.player) return;
        // actor is tracked (hidden)
        if (this.store.has(evt.actor.gid)) {
            // -- if no longer hidden, remove entity from tracked secret list
            if (evt.update && evt.update.hasOwnProperty('hidden') && !evt.update.hidden) {
                this.store.delete(evt.actor.gid);
            }
        // actor is not currently tracked
        } else {
            // -- if newly hidden, add entity to tracked secret list
            if (evt.update && evt.update.hasOwnProperty('hidden') && evt.update.hidden) {
                this.store.set(evt.actor.gid, evt.actor);
            }
        }
    }

    iterate(evt, e) {
        if (!this.player) return;
        // detect distance comes from player
        let scanRange = this.player.scanRange;
        let distance = Mathf.distance(this.player.xform.x, this.player.xform.y, e.xform.x, e.xform.y);
        if (distance > scanRange) return;
        // check for LOS
        if (!this.player.losIdxs.includes(e.idx)) return;
        // roll for player detection
        // -- detect chance based on player savvy
        let detectChance = Mathf.lerp(8, 21, .1, .5, this.player.savvy);
        if (Random.flip(detectChance)) {
            // setup reveal action on entity
            let action = new RevealAction({
                lvl: this.lvl,
            });
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