export { Energy };

import { DropLootAction } from '../actions/loot.js';
import { AiMoveToIdxDirective } from '../ai/aiMoveToIdxDirective.js';
import { AiMoveToRangeDirective } from '../ai/aiMoveToRangeDirective.js';
import { AiRangeTargetDirective } from '../ai/aiRangeTargetDirective.js';
import { DestroyAction } from '../base/actions/destroy.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Fmt } from '../base/fmt.js';
import { Prng } from '../base/prng.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Util } from '../base/util.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';

class Energy extends Enemy{
    static gHealth = new LvlVar({ baseMin: 4, baseMax: 8, perLvlMin: 1, perLvlMax: 3 } );
    static gXp = new LvlVar({ base: 3, perLvl: 1 } );

    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // parse lvl
        let lvl = spec.lvl || 1;
        // health
        let health = Prng.rangeInt(3,8);
        for (let i=1; i<lvl; i++) health += Prng.rangeInt(1,3);
        // final spec
        return Object.assign( {}, this.spec, {
            x_sketch: Assets.get('energy-shock'),
            deathTTL: 600,
            attackKind: 'shock',
            animState: 'idle',
            pointsPerTurn: 8,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.rangeMin = spec.rangeMin || Config.tileSize*2;
        this.rangeMax = spec.rangeMax || Config.tileSize*4;
    }
    
    // SERIALIZATION -------------------------------------------------------
    as_kv() {
        return Object.assign({}, super.as_kv(), {
            rangeMin: this.rangeMin,
            rangeMax: this.rangeMax,
        });
    }

    // EVENT HANDLERS ------------------------------------------------------
    onDeath(evt) {
        if (this.state !== 'dying') {
            let wantAnimState = 'dying';
            UpdateSystem.eUpdate(this, { state: 'dying', health: 0, animState: wantAnimState });
            // spawn any loot
            for (let loot of (this.loot || [])) {
                ActionSystem.assign(this, new DropLootAction({
                    lootSpec: loot,
                }));
            }
            // destroy
            ActionSystem.assign(this, new DestroyAction({
                ttl: this.deathTTL,
            }));
        }
    }

    onIntentForAnimState(evt) {
        // transition to idle state
        let update = {};
        if (evt.update && evt.update.hasOwnProperty('idx')) {
            if (this.lastIdx !== evt.update.idx) {
                let wantAnimState = 'idle';
                if (wantAnimState !== this.animState) update.animState = wantAnimState;
                this.lastIdx = this.idx;
            }
        // transition to idle state
        } else if (evt.update && evt.update.hasOwnProperty('speed') && evt.update.speed === 0) {
            let wantAnimState = 'idle';
            if (wantAnimState !== this.animState) update.animState = wantAnimState;
        // transition to move state
        } else if (evt.update && evt.update.xform && (evt.update.xform.hasOwnProperty('x') || evt.update.xform.hasOwnProperty('y'))) {
            let wantAnimState = 'move';
            if (wantAnimState !== this.animState) update.animState = wantAnimState;
        }
        if (!Util.empty(update)) {
            Object.assign(evt.update, update);
        }
    }

    onLevelLoaded(evt) {
        let lvl = evt.lvl;
        // setup directives
        let x_dir = {
            lvl: lvl,
            actor: this,
            rangeMin: this.rangeMin,
            rangeMax: this.rangeMax,
        }
        this.move = new AiMoveToRangeDirective(x_dir);
        this.search = new AiMoveToIdxDirective(x_dir);
        this.attack = new AiRangeTargetDirective(x_dir);
        this.actionStream = this.run();
        // activate
        this.active = true;
    }


}