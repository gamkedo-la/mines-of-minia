export { PoisonedCharm };

import { Attack } from '../actions/attack.js';
import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { OverlaySystem } from '../systems/overlaySystem.js';
import { TurnSystem } from '../systems/turnSystem.js';
import { Charm } from './charm.js';

class PoisonedCharm extends Charm {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltApTL = 30;
    static dfltDamage = .5;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'poisoned charm';
        // number of action points to persist charm
        this.apTL = spec.apTL || this.constructor.dfltApTL;
        // number of action points elapsed
        this.elapsed = 0;
        // amount of damage per ap
        this.damage = spec.damage || this.constructor.dfltDamage;
        this.vfx = spec.vfx || Assets.get('vfx.poison', true);
        this.attackKind = 'dark';
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
            console.log(`-- poisoned expired from ${this.actor}`);
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
        if (this.vfx) Events.trigger(OverlaySystem.evtNotify, { actor: actor, which: 'vfx', vfx: this.vfx, destroyEvt: 'poisoned.done'});
    }

    unlink() {
        Events.ignore(TurnSystem.evtDone, this.onTurnDone);
        let actor = this.actor;
        super.unlink();
        if (actor) actor.evt.trigger('poisoned.done', {actor: actor});
    }

}