export { DrainCharm };

import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Character } from '../entities/character.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { TurnSystem } from '../systems/turnSystem.js';
import { Charm } from './charm.js';

class DrainCharm extends Charm {
    static dfltApTL = 30;
    static dfltDamage = 1;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'drain charm';
        // number of action points to persist charm
        this.apTL = spec.apTL || this.constructor.dfltApTL;
        // number of action points elapsed
        this.elapsed = 0;
        // action points delta (how much does drain slow characters)
        this.damage = spec.hasOwnProperty('damage') ? spec.damage : this.constructor.dfltDamage;
        this.vfx = spec.vfx || Assets.get('vfx.drain', true);
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
        if (!this.actor) return;
        // only update if at end of actor's turn
        if (this.actor.cls === 'Player') {
            if (evt.which !== 'leader') return;
        } else {
            if (evt.which !== 'follower') return;
        }
        let ap = evt.points || 0;
        this.elapsed += ap;
        if (this.elapsed >= this.apTL) {
            this.unlink();
        } else if (this.actor.power) {
            let total = Math.round(this.damage*ap);
            if (total) {
                let power = Math.max(0, this.actor.power-total);
                UpdateSystem.eUpdate(this.actor, { power: power});
                Events.trigger(OverlaySystem.evtNotify, {which: 'popup.white', actor: this.actor, msg: `-${total} pow`});
            }
        }
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        super.link(actor);
        Events.listen(TurnSystem.evtDone, this.onTurnDone);
        if (this.vfx) {
            let which = (actor instanceof Character) ? 'vfx' : 'overlay';
            Events.trigger(OverlaySystem.evtNotify, { actor: actor, which: which, vfx: this.vfx, destroyEvt: 'drain.done'});
        }
    }

    unlink() {
        Events.ignore(TurnSystem.evtDone, this.onTurnDone);
        let actor = this.actor;
        super.unlink();
        if (actor) {
            actor.evt.trigger('drain.done', {actor: actor});
        }
    }

}