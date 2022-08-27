export { ChargeAction };

import { GeneratorAction } from '../base/actions/generatorAction.js';
import { MoveAction } from '../base/actions/move.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { DazedCharm } from '../charms/dazed.js';
import { Attack } from './attack.js';

class ChargeAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
        this.chargeDir = spec.chargeDir || Direction.east;
        this.lvl = spec.lvl;
        this.chargeFactor = spec.chargeFactor || 3;
        this.sfx = spec.sfx;
        this.pushing = [];
        this.attackKind = 'bonk';
        this.damageMin = spec.damageMin || 5;
        this.damageMax = spec.damageMax || 15;
        this.applyDazed = spec.hasOwnProperty('applyDazed') ? spec.applyDazed : true;
        // -- setup event handlers
        this.onActorUpdate = this.onActorUpdate.bind(this);
    }
    destroy() {
        super.destroy();
        if (this.actor) this.actor.evt.ignore(this.actor.constructor.evtUpdated, this.onActorUpdate);
        if (this.sfx) this.sfx.destroy();
    }

    onActorUpdate(evt) {
        if (this.nudging) return;
        if (evt.update && evt.update.xform && (evt.update.xform.hasOwnProperty('x') || evt.update.xform.hasOwnProperty('y') || evt.update.hasOwnProperty('idx'))) {
            let update = {
                idx: this.actor.idx,
                xform: {
                    x: this.actor.xform.x,
                    y: this.actor.xform.y,
                }
            }
            for (const e of this.pushing) {
                UpdateSystem.eUpdate(e, update);
            }
        }
    }

    *run() {
        // -- while charging...
        while (true) {
            // find next index based on actor position and charge direction
            let nidx = this.lvl.idxfromdir(this.actor.idx, this.chargeDir);

            // entities that block path
            let blocks = Array.from(this.lvl.findidx(nidx, (e) => (this.actor.blockedBy & e.blocks)));
            // something blocks path and is immobile...
            if (blocks.length) {
                if (blocks.some((v) => !v.constructor.mobile)) {
                    // stop charge
                    for (const e of this.pushing) UpdateSystem.eUpdate(e, {idx: this.actor.idx, xform: {x: this.actor.xform.x, y: this.actor.xform.y}});
                    // apply damage and dazed
                    if (this.pushing.length) {
                        for (const e of this.pushing) {
                            if (e.health) {
                                // apply dazed charm
                                let dazed = new DazedCharm();
                                e.addCharm(dazed);
                                console.log(`applied ${dazed} to ${e}`);
                                // roll for damage
                                let dmg = Attack.damage(this, e);
                                if (dmg) {
                                    console.log(`-- charge damaged: ${e} amt: ${dmg}`);
                                    e.evt.trigger(e.constructor.evtDamaged, { actor: this.actor, target: e, damage: dmg });
                                }
                            }
                        }
                    // if charge "missed", apply dazed to actor
                    } else {
                        let dazed = new DazedCharm();
                        console.log(`applied ${dazed} to ${this.actor}`);
                        this.actor.addCharm(dazed);
                    }
                    // nudge back if we were pushing something
                    if (this.pushing.length) {
                        this.nudging = true;
                        let bidx = this.lvl.idxfromdir(this.actor.idx, Direction.opposite(this.chargeDir));
                        let x = this.lvl.xfromidx(bidx, true);
                        let y = this.lvl.yfromidx(bidx, true);
                        let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
                        //console.log(`nudge back to ${x},${y}:${nidx} facing: ${facing}`);
                        yield new MoveAction({ x:x, y:y, accel: .001, snap: true, stopAtTarget: true, facing: facing, update: { idx: bidx }, sfx: this.actor.moveSfx });
                    }
                    // break from loop
                    break;
                } else {
                    // whatever is in path can be pushed...
                    if (!this.pushing.length) this.actor.evt.listen(this.actor.constructor.evtUpdated, this.onActorUpdate);
                    for (const e of blocks) if (!this.pushing.includes(e)) this.pushing.push(e);
                    //console.log(`actor now pushing: ${this.pushing}`);
                }
            }

            // yield movement
            let x = this.lvl.xfromidx(nidx, true);
            let y = this.lvl.yfromidx(nidx, true);
            let facing = (x > this.actor.xform.x) ? Direction.east : (x < this.actor.xform.x) ? Direction.west : 0;
            // peek at next next index to determine if it will block movement
            let stop = this.lvl.anyidx(this.lvl.idxfromdir(nidx, this.chargeDir), (e) => this.actor.blockedBy & e.blocks && !e.constructor.mobile);
            //console.log(`move to ${x},${y}:${nidx} facing: ${facing} stop: ${stop}`)
            yield new MoveAction({ speed: this.actor.maxSpeed*this.chargeFactor, x:x, y:y, accel: .01, snap: stop, stopAtTarget: stop, facing: facing, update: { idx: nidx }, sfx: this.actor.moveSfx });
        }

        // otherwise... no longer charging... finish up
        //console.log(`-- charge complete`);
        return null;

    }

}