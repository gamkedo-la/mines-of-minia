export { BonkersCharm };

    import { Events } from '../base/event.js';
import { Charm } from './charm.js';

class BonkersCharm extends Charm {

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.description = 'bonkers charm';
        this.lvl = spec.lvl || 1;
        this.damageBonus = this.lvl * 5;
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
        if (!this.actor.damageBonus) {
            this.actor.damageBonus = this.damageBonus;
        } else {
            this.actor.damageBonus += this.damageBonus;
        }
        Events.listen('equip.changed', this.onEquipChanged);
    }

    unlink() {
        let actor = this.actor;
        super.unlink();
        actor.damageBonus -= this.damageBonus;
        Events.ignore('equip.changed', this.onEquipChanged);
    }

    onEquipChanged(evt) {
        if (evt.actor !== this.actor) return;
        if (evt.slot !== 'weapon') return;
        // auto remove charm if bonk weapon is swapped out
        if (!evt.target || evt.target.kind !== 'bonk') {
            console.log(`${this} bonk weapon swapped out`);
            this.unlink();
        }
    }


}