export { EnflamedCharm };

import { Attack } from '../actions/attack.js';
import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { TurnSystem } from '../systems/turnSystem.js';
import { Charm } from './charm.js';

class EnflamedCharm extends Charm {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltApTL = 60;
    static dfltDamage = .5;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'enflamed charm';
        // number of action points to persist charm
        this.apTL = spec.apTL || this.constructor.dfltApTL;
        // number of action points elapsed
        this.elapsed = 0;
        // amount of damage per ap
        this.damage = spec.damage || this.constructor.dfltDamage;
        this.vfx = spec.vfx || Assets.get('vfx.enflamed', true);
        this.attackKind = 'fire';
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
            if (!this.actor.health) {
                if (!this.actor.charred && this.actor.burn) (this.actor.burn(this))
                this.actor.charred = true;
            }
            this.unlink();
        } else if (this.actor.health) {
            let total = Math.round(this.damage*ap);
            this.damageMin = total;
            this.damageMax = total;
            let damage = Attack.damage(this, this.actor);
            if (damage) {
                this.actor.evt.trigger(this.actor.constructor.evtDamaged, { actor: this, target: this.actor, critical: false, damage: damage }, true);
            }
        }
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        super.link(actor);
        Events.listen(TurnSystem.evtDone, this.onTurnDone);
        if (this.vfx) Events.trigger(OverlaySystem.evtNotify, { actor: actor, which: 'vfx', vfx: this.vfx, destroyEvt: 'enflamed.done'});
    }

    unlink() {
        Events.ignore(TurnSystem.evtDone, this.onTurnDone);
        let actor = this.actor;
        super.unlink();
        if (actor) actor.evt.trigger('enflamed.done', {actor: actor});
    }

}