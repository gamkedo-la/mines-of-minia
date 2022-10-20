export { FrozenCharm };

import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { TurnSystem } from '../systems/turnSystem.js';
import { Charm } from './charm.js';

class FrozenCharm extends Charm {
    static dfltApTL = 100;
    static dfltApDelta = 3;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'frozen charm';
        // number of action points to persist charm
        this.apTL = spec.apTL || this.constructor.dfltApTL;
        // number of action points elapsed
        this.elapsed = 0;
        // action points delta (how much does frozen slow characters)
        this.apDelta = spec.hasOwnProperty('apDelta') ? spec.apDelta : this.constructor.dfltApDelta;
        this.vfx = spec.vfx || Assets.get('vfx.frozen', true);
        // -- events
        this.onTurnDone = this.onTurnDone.bind(this);
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            apTl: this.apTl,
            elapsed: this.elapsed,
            damage: this.damage,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTurnDone(evt) {
        let ap = evt.points || 0;
        this.elapsed += ap;
        if (this.elapsed >= this.apTL) {
            console.log(`-- frozen expired from ${this.actor}`);
            this.unlink();
        }
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        super.link(actor);
        Events.listen(TurnSystem.evtDone, this.onTurnDone);
        if (this.apDelta && 'pointsPerTurn' in actor) {
            this.actor.pointsPerTurn += this.apDelta;
        }
        if (this.vfx) Events.trigger(OverlaySystem.evtNotify, { actor: actor, which: 'vfx', vfx: this.vfx, destroyEvt: 'frozen.done'});
    }

    unlink() {
        Events.ignore(TurnSystem.evtDone, this.onTurnDone);
        let actor = this.actor;
        super.unlink();
        if (actor) {
            if (this.apDelta && 'pointsPerTurn' in actor) {
                actor.pointsPerTurn -= this.apDelta;
            }
            actor.evt.trigger('frozen.done', {actor: actor});
        }
    }

}