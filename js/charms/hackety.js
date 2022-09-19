export { HacketyCharm };

import { Events } from '../base/event.js';
import { Charm } from './charm.js';

class HacketyCharm extends Charm {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'hackety charm';
        this.lvl = spec.lvl || 1;
        this.attackRatingBonus = this.lvl * 5;
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
        if (!this.actor.attackRatingBonus) {
            this.actor.attackRatingBonus = this.attackRatingBonus;
        } else {
            this.actor.attackRatingBonus += this.attackRatingBonus;
        }
        console.log(`updated actor ${actor} bonus attack rating: ${actor.attackRatingBonus}`);
        Events.listen('equip.changed', this.onEquipChanged);
    }

    unlink() {
        let actor = this.actor;
        super.unlink();
        actor.attackRatingBonus -= this.attackRatingBonus;
        console.log(`updated actor ${actor} bonus attack rating: ${actor.attackRatingBonus}`);
        Events.ignore('equip.changed', this.onEquipChanged);
    }

    onEquipChanged(evt) {
        if (evt.actor !== this.actor) return;
        if (evt.slot !== 'weapon') return;
        // auto remove charm if hack weapon is swapped out
        if (!evt.target || evt.target.kind !== 'hack') {
            console.log(`${this} hack weapon swapped out`);
            this.unlink();
        }
    }


}