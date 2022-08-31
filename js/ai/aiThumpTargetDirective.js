export { AiThumpTargetDirective };

import { MeleeAttackAction } from '../actions/attack.js';
import { SerialAction } from '../base/actions/serialAction.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Reticle } from '../entities/reticle.js';
import { LevelSystem } from '../systems/levelSystem.js';
import { AiDirective } from './aiDirective.js';

class AiThumpTargetDirective extends AiDirective {
    cpost(spec) {
        super.cpost(spec);
        this.range = this.actor.meleeRange;
        this.knockback = spec.knockback || 0;
        this.missesBeforeSpamAttack = spec.missesBeforeSpamAttack || 3;
    }

    *run() {
        this.reset();
        let misses = 0;
        while (!this.done) {
            let range = this.getTargetRange();
            // check for target in range
            if (range > this.range) {
                this.ok = false;
                this.done = true;
                return null;
            }

            // aim
            let targetIdx;
            if (misses < this.missesBeforeSpamAttack) {
                targetIdx = this.lvl.idxfromdir(this.actor.idx, this.getTargetDirection());
                console.log(`-- aim: ${targetIdx}`);
                // spawn target reticle
                let x_reticle = Object.assign({}, Reticle.xspec(), {idx: targetIdx, z: Config.template.bgoZed});
                let reticle = LevelSystem.addEntity(x_reticle);
                yield null;
                // -- destroy reticle
                if (reticle) reticle.destroy();
            }

            // thump
            // -- normal attack
            if (misses < this.missesBeforeSpamAttack) {
                // -- check for target
                let target;
                if (this.target.idx === targetIdx) {
                    target = this.target;
                    console.log(`-- thump hit target: ${this.target}`);
                } else {
                    target = this.lvl.firstidx(targetIdx);
                    misses++;
                    console.log(`-- thump missed target: ${this.target} misses: ${misses}`);
                }
                yield new MeleeAttackAction({
                    target: target,
                    knockback: (target === this.target) ? this.knockback : 0,
                    lvl: this.lvl,
                });

            // -- spam attack
            } else {
                console.log(`-- thump spam`);
                let serialActions = [];
                for (const dir of Direction.all) {
                    let targetIdx = this.lvl.idxfromdir(this.actor.idx, dir);
                    // -- check for target
                    let target;
                    if (this.target.idx === targetIdx) {
                        target = this.target;
                    } else {
                        target = this.lvl.firstidx(targetIdx);
                    }
                    serialActions.push(new MeleeAttackAction({
                        target: target,
                        knockback: (target === this.target) ? this.knockback : 0,
                        lvl: this.lvl,
                    }));
                }
                yield new SerialAction({subs: serialActions});
                misses = 0;
            }

        }
    }
}