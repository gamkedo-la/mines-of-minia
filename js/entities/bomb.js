export { Bomb };

import { Attack } from '../actions/attack.js';
import { PlayAnimatorStateAction } from '../base/actions/playAnimation.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Rect } from '../base/rect.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { TurnSystem } from '../systems/turnSystem.js';
import { Item } from './item.js';

class Bomb extends Item {
    static lootable = false;
    static dfltApTL = 4;
    static dfltState = 'idle';

    static get dfltSketch() {
        return Assets.get('bomb', true);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.apTL = spec.apTL || this.constructor.dfltApTL;
        this.blastRange = spec.blastRange || Config.tileSize * 1.5;
        this.damageMin = spec.damageMin || 5;
        this.damageMax = spec.damageMax || 10;
        this.attackKind = spec.attackKind || 'fire';
        this.elapsed = 0;
        this.elvl = spec.elvl;
        this.explodeSfx = spec.explodeSfx || Assets.get('bomb.blast', true);
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
        if (this.state !== 'idle') return;
        let ap = evt.points || 0;
        this.elapsed += ap;
        if (this.elapsed >= this.apTL) {
            this.boom();
        }
    }

    boom() {
        // animate
        this.state = 'explode';
        // hackety hack hack
        this.xform.offx = -32;
        this.xform.offy = -32;
        let action = new PlayAnimatorStateAction({
            animator: this.sketch,
            state: 'explode',
        });
        action.evt.listen(action.constructor.evtDone, (evt) => this.destroy(), Events.once);
        ActionSystem.assign(this, action);
        // explode
        if (this.explodeSfx) this.explodeSfx.play();
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