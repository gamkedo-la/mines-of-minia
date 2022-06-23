export { AggroSystem };

import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { System } from '../base/system.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Util } from '../base/util.js';

class AggroSystem extends System {
    static dfltAggroTag = 'player';

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.aggroTargets = {};
        this.onAggroTargetUpdate = this.onAggroTargetUpdate.bind(this);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEntityAdded(evt) {
        if (this.matchPredicate(evt.actor)) {
            let actor = evt.actor;
            // aggro range means entity should track aggro of targets
            if (actor.aggroRange) {
                if (this.dbg) console.log(`${this} onEntityAdded: ${Fmt.ofmt(evt)} gid: ${actor.gid} -- aggro receiver for: ${actor.aggroTag}`);
                this.store.set(actor.gid, actor);
            }
            // aggro tag identifies entities that can draw aggro
            if (actor.team) {
                if (this.dbg) console.log(`${this} onEntityAdded: ${Fmt.ofmt(evt)} gid: ${actor.gid} -- aggro giver for ${actor.team}`);
                Util.getOrAssign(this.aggroTargets, actor.team).push(actor);
                actor.evt.listen(actor.constructor.evtUpdated, this.onAggroTargetUpdate);
            }
        }
    }

    onEntityRemoved(evt) {
        let actor = evt.actor;
        if (!actor) return;
        if (this.dbg) console.log(`${this} onEntityRemoved: ${Fmt.ofmt(evt)}`);
        this.store.delete(actor.gid);
        actor.evt.ignore(actor.constructor.evtUpdated, this.onAggroTargetUpdate);
        if (actor.team) {
            let targets = this.aggroTargets[actor.team] || [];
            let idx = targets.indexOf(actor);
            if (-1 !== idx) targets.splice(idx, 1);
        }
    }

    onAggroTargetUpdate(evt) {
        // check if actor index has changed
        if (evt.update && evt.update.hasOwnProperty('idx')) {
            //console.log(`onAggroTargetUpdate: ${Fmt.ofmt(evt)}`);
            // aggro actor has changed index, iterate
            this.active = true;
        }
    }

    iterate(evt, e) {
        // is entity already tracking an aggro target?
        if (e.aggroTarget) {
            let d = Mathf.distance(e.xform.x, e.xform.y, e.aggroTarget.xform.x, e.aggroTarget.xform.y);
            //console.log(`distance to aggro target: ${d} range: ${e.aggroRange}`);
            // check for loss of aggro
            if (d > e.aggroRange) {
                if (this.dbg) console.log(`${this} ${e} lost aggro for ${e.aggroTarget}`);
                e.aggroTarget = null;
                UpdateSystem.eUpdate(e, {aggroTarget: null});
                e.evt.trigger(e.constructor.evtAggroLost, {actor: e, target: e.aggroTarget});
            }
        } 
        // no aggro target...
        if (!e.aggroTarget) {
            let tag = e.aggroTag || this.constructor.dfltAggroTag;
            let targets = this.aggroTargets[tag] || [];

            let target = Util.findBest(
                targets,
                (v) => Mathf.distance(e.xform.x, e.xform.y, v.xform.x, v.xform.y),
                (v1,v2) => v1<v2,
                (v) => v <= e.aggroRange,
            );

            // if target, aggro has been gained
            if (target) {
                if (this.dbg) console.log(`${this} ${e} gained aggro for ${target}`);
                UpdateSystem.eUpdate(e, {aggroTarget: target});
                //e.aggroTarget = target;
                e.evt.trigger(e.constructor.evtAggroGained, {actor: e, target: target});
            }

        }
    }

    matchPredicate(e) {
        return e.aggroRange || e.team;
    }

    finalize(evt) {
        this.active = false;
    }

}