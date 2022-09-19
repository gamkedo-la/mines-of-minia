
export { PointyCharm };

import { Events } from '../base/event.js';
import { Charm } from './charm.js';

class PointyCharm extends Charm {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'pointy charm';
        this.lvl = spec.lvl || 1;
        this.critPct = this.lvl * .05;
        this.onEquipChanged = this.onEquipChanged.bind(this);
    }
    destroy() {
        this.unlink();
    }

    as_kv() {
        return Object.assign({}, super.as_kv(), {
            lvl: this.lvl,
        });
    }

    // METHODS -------------------------------------------------------------
    link(actor) {
        super.link(actor);
        if (!this.actor.critPct) {
            this.actor.critPct = this.critPct;
        } else {
            this.actor.critPct += this.critPct;
        }
        console.log(`updated actor ${actor} crit pct: ${actor.critPct}`);
        Events.listen('equip.changed', this.onEquipChanged);
    }

    unlink() {
        let actor = this.actor;
        super.unlink();
        actor.critPct -= this.critPct;
        console.log(`updated actor ${actor} crit pct: ${actor.critPct}`);
        Events.ignore('equip.changed', this.onEquipChanged);
    }

    onEquipChanged(evt) {
        if (evt.actor !== this.actor) return;
        if (evt.slot !== 'weapon') return;
        // auto remove charm if poke weapon is swapped out
        if (!evt.target || evt.target.kind !== 'poke') {
            console.log(`${this} poke weapon swapped out`);
            this.unlink();
        }
    }


}