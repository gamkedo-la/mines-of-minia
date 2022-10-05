export { DazedCharm }
import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { TurnSystem } from '../systems/turnSystem.js';
import { Charm } from './charm.js';

class DazedCharm extends Charm {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltApTL = 50;

    static isDazed(e) {
        return e.charms && e.charms.some((v) => v.constructor.name === 'DazedCharm');
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        // number of action points to persist charm
        this.apTL = spec.apTL || this.constructor.dfltApTL;
        // number of action points elapsed
        this.elapsed = 0;
        // -- events
        this.onTurnDone = this.onTurnDone.bind(this);
        this.vfx = spec.vfx || Assets.get('vfx.dazed', true);
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            apTl: this.apTl,
            elapsed: this.elapsed,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTurnDone(evt) {
        let ap = evt.points || 0;
        this.elapsed += ap;
        console.log(`onTurnDone ap: ${ap} elapsed: ${this.elapsed}`);
        if (this.elapsed >= this.apTL) {
            console.log(`-- dazed expired from ${this.actor}`);
            this.unlink();
        }
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        super.link(actor);
        Events.listen(TurnSystem.evtDone, this.onTurnDone);
        if (this.vfx) Events.trigger(OverlaySystem.evtNotify, { actor: actor, which: 'vfx', vfx: this.vfx, destroyEvt: 'dazed.done'});
    }

    unlink() {
        if (this.actor) this.actor.evt.trigger('dazed.done', {actor: this.actor});
        super.unlink();
        Events.ignore(TurnSystem.evtDone, this.onTurnDone);
    }

}