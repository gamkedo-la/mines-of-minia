export { AiBombTargetDirective };

import { ThrowAction } from '../actions/throw.js';
import { Config } from '../base/config.js';
import { Bomb } from '../entities/bomb.js';
import { LevelSystem } from '../systems/levelSystem.js';
import { AiDirective } from './aiDirective.js';

class AiBombTargetDirective extends AiDirective {

    cpost(spec) {
        super.cpost(spec);
        // -- delay between bombs
        this.delay = spec.delay || 2;
        this.elapsed = 0;
        this.range = spec.range || Config.tileSize*2;
        // -- da bomb
        this.bombSpec = spec.bombSpec || Bomb.xspec();
    }

    reset() {
        super.reset();
        this.elapsed = 0;
    }

    *run() {
        this.reset();
        // iterate until directive is done
        while (!this.done) {
            // check range
            if (this.getTargetRange() < this.range) {
                console.log(`-- bombing failed, target too close`);
                this.ok = false;
                return null;
            }

            // check for delay
            if (this.elapsed < this.delay) {
                console.log(`-- bombing delay`);
                this.elapsed++;
                yield null;
            }

            
            // bomb
            // -- instantiate bomb
            let x_bomb = Object.assign({}, this.bombSpec, {idx: this.actor.idx, z: Config.template.fgZed});
            let bomb = LevelSystem.addEntity(x_bomb);
            // -- lookup path between actor and target
            let pathidxs = Array.from(this.lvl.idxsBetween(this.actor.idx, this.target.idx));
            let targetIdx = bomb.idx;
            for (let i=1; i<pathidxs.length; i++) {
                if (this.lvl.anyidx(pathidxs[i], (v) => (bomb.blockedBy & v.blocks))) {
                    targetIdx = pathidxs[i-1];
                    break;
                }
            }

            console.log(`-- throw ${bomb}`);
            let action = new ThrowAction({
                needsDrop: false,
                item: bomb,
                idx: targetIdx,
                x: this.lvl.xfromidx(targetIdx, true),
                y: this.lvl.yfromidx(targetIdx, true),
            });
            yield action;

            // reset elapsed
            this.elapsed = 0;

        }
    }

}