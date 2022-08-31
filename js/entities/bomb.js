export { Bomb };

    import { Attack } from '../actions/attack.js';
import { Config } from '../base/config.js';
import { Events } from '../base/event.js';
import { Rect } from '../base/rect.js';
import { TurnSystem } from '../systems/turnSystem.js';
import { Item } from './item.js';

class Bomb extends Item {
    static lootable = false;
    static dfltApTL = 4;

    static get dfltSketch() {
        return new Rect({ width: 12, height: 12, color: 'rgba(200,0,0,.75)' });
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.apTL = spec.apTL || this.constructor.dfltApTL;
        this.blastRange = spec.blastRange || Config.tileSize * 2;
        this.damageMin = spec.damageMin || 5;
        this.damageMax = spec.damageMax || 10;
        this.attackKind = spec.attackKind || 'fire';
        this.elapsed = 0;
        this.elvl = spec.elvl;
        // -- events
        this.onLevelLoaded = this.onLevelLoaded.bind(this);
        this.onTurnDone = this.onTurnDone.bind(this);
        Events.listen('lvl.loaded', this.onLevelLoaded, Events.once);
        Events.listen(TurnSystem.evtDone, this.onTurnDone);
    }
    destroy() {
        super.destroy();
        Events.ignore(TurnSystem.evtDone, this.onTurnDone);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        this.elvl = evt.lvl;
    }

    onTurnDone(evt) {
        let ap = evt.points || 0;
        this.elapsed += ap;
        if (this.elapsed >= this.apTL) {
            console.log(`-- ${this} boom!`);
            this.boom();
            this.destroy();
        }
    }

    boom() {
        // find targets in range
        for (const idx of this.elvl.idxsInRange(this.idx, this.blastRange)) {
            // iterate through anything that has health
            for (const e of this.elvl.findidx(idx, (v) => v.health)) {
                // roll for damage
                let damage = Attack.damage(this, e);
                if (damage) {
                    e.evt.trigger(e.constructor.evtDamaged, { actor: this, target: e, damage: damage });
                }
            }
        }
    }

}