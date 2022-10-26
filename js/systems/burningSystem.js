export { BurningSystem };

    import { Direction } from '../base/dir.js';
    import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Charm } from '../charms/charm.js';
import { EnflamedCharm } from '../charms/enflamed.js';
import { TurnSystem } from './turnSystem.js';

class BurningSystem extends System {
    static dfltIterateTTL = 0;

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.lvl = spec.lvl;
        this.smoldering = new Set();
        // -- event handlers
        this.onTurnDone = this.onTurnDone.bind(this);
        this.onEntityUpdated = this.onEntityUpdated.bind(this);
        this.evt.listen(TurnSystem.evtDone, this.onTurnDone)
        this.active = false;
    }
    destroy(spec) {
        this.evt.ignore(TurnSystem.evtDone, this.onTurnDone)
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTurnDone(evt) {
        //if (evt.which !== 'leader') return;
        this.active = true;
        this.actionPoints = evt.points;
    }

    onEntityAdded(evt) {
        if (this.matchPredicate(evt.actor)) {
            //console.log(`enflamed entity added: ${evt.actor}`)
            // already enflamed?
            if (Charm.checkFor(evt.actor, 'EnflamedCharm')) {
                this.store.set(evt.actor.gid, evt.actor);
            }
            evt.actor.evt.listen(evt.actor.constructor.evtUpdated, this.onEntityUpdated);
        }
    }

    onEntityRemoved(evt) {
        if (this.matchPredicate(evt.actor)) {
            //console.log(`== enflamed entity removed: ${evt.actor}`)
            this.store.delete(evt.actor.gid);
            evt.actor.evt.ignore(evt.actor.constructor.evtUpdated, this.onEntityUpdated);
        }
    }

    onEntityUpdated(evt) {
        if (evt.update && evt.update.hasOwnProperty('charmed')) {
            //console.log(`-- onEntityUpdated: ${Fmt.ofmt(evt)}`);
            if (Charm.checkFor(evt.actor, 'EnflamedCharm')) {
                //console.log(`watching burning: ${evt.actor}`);
                this.store.set(evt.actor.gid, evt.actor);
            // not burning
            } else {
                if (this.store.has(evt.actor.gid)) {
                    //console.log(`no longer burning: ${evt.actor}`);
                    this.store.delete(evt.actor.gid);
                }
            }

        }
    }

    // METHODS -------------------------------------------------------------
    prepare(evt) {
        this.nowSmoldering = new Set();
    }

    iterate(evt, e) {
        //console.log(`${this} iterating on ${e}`);
        // check for flammable objects nearby
        for (const dir of Direction.all) {
            let idx = this.lvl.idxfromdir(e.idx, dir);
            for (const target of this.lvl.findidx(idx, (v) => v.constructor.flammable)) {
                // skip if already charred
                if (target.charred) continue;
                // skip if already burning?
                if (Charm.checkFor(target, 'EnflamedCharm')) continue;
                // if smoldering... apply enflamed
                if (this.smoldering.has(target.gid)) {
                    let charm = new EnflamedCharm();
                    target.addCharm(charm);
                // apply smoldering
                } else {
                    this.nowSmoldering.add(target.gid);
                    //console.log(`setting to smoldering: ${target}`);
                }
            }
        }
    }

    finalize(evt) {
        this.smoldering = this.nowSmoldering;
        // disable system after all entities have been processed
        this.active = false;
    }

    matchPredicate(e) {
        return (e.constructor.flammable);
    }

}