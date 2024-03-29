export { Slimer };

import { AiMeleeTargetDirective } from '../ai/aiMeleeTargetDirective.js';
import { AiMoveToIdxDirective } from '../ai/aiMoveToIdxDirective.js';
import { AiMoveTowardsTargetDirective } from '../ai/aiMoveTowardsTargetDirective.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { Random } from '../base/random.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Util } from '../base/util.js';
import { DazedCharm } from '../charms/dazed.js';
import { FrozenCharm } from '../charms/frozen.js';
import { PoisonCharm } from '../charms/poison.js';
import { LvlVar } from '../lvlVar.js';
import { Enemy } from './enemy.js';

class Slimer extends Enemy{
    static gHealth = new LvlVar({ baseMin: 12, baseMax: 18, perLvlMin: 4, perLvlMax: 6 } );
    static gXp = new LvlVar({ base: 25, perLvl: 10 } );
    static dfltDeathTTL = 1000;
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( this.spec, {
            //meleeHitSfx: Assets.get('scarab.attack', true),
            //meleeMissSfx: Assets.get('scarab.attack', true),
            //moveSfx: Assets.get('scarab.move', true),
            x_sketch: Assets.get('slimer'),
            pointsPerTurn: 10,
            blockedBy: this.block.wall,
            aggroRange: Config.tileSize*3,
            attackKind: 'bonk',
            baseDamageMin: 4,
            baseDamageMin: 8,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // slimer attacks are poison
        let charm = new PoisonCharm();
        this.addCharm(charm);
        if (spec.elvl) this.linkLevel(spec.elvl);
        //console.log(`slimer -- lvl: ${this.lvl} health: ${this.healthMax} xp: ${this.xp}`);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        this.linkLevel(evt.lvl);
        if (this.activateOnLoad) this.active = true;
    }

    onAggro(evt) {
        if (!this.active) return;
        //console.log(`${this} aggrod ${Fmt.ofmt(evt)}}`);
        this.move.target = evt.target;
        this.attack.target = evt.target;
        UpdateSystem.eUpdate(this, {state: 'attack'});
        this.actionStream = this.run();
        this.aggroRange = Config.tileSize*12;
        // lock the room
        for (const door of this.elvl.find((v) => v.cls === 'Door' && v.boss)) {
            console.log(`-- locking ${door}`);
            door.locked = true;
        }
    }

    onAggroLost(evt) {
        if (!this.active) return;
        //console.log(`${this} aggro lost ${Fmt.ofmt(evt)}}`);
        this.search.targetIdx = evt.lastIdx;
        UpdateSystem.eUpdate(this, {state: 'search'});
        this.actionStream = this.run();
    }

    onDamaged(evt) {
        super.onDamaged(evt);
        // check for transitions
        if (this.state !== 'attack' && this.state !== 'search') return;
        let recharge = false;
        if (!this.halfCheck) {
            if (this.health < this.healthMax*.5) {
                console.log(`-- half check started`)
                this.halfCheck = true;
                recharge = true;
            }
        } else if (!this.qtrCheck) {
            if (this.health < this.healthMax*.25) {
                console.log(`-- qtr check started`)
                this.qtrCheck = true;
                recharge = true;
            }
        }
        if (recharge) {
            this.move.stop();
            this.attack.stop();
            console.log(`-- transition to retreat`)
            UpdateSystem.eUpdate(this, {state: 'retreat'});
        }
    }

    onDeath(evt) {
        super.onDeath(evt);
        // unlock the room
        for (const door of this.elvl.find((v) => v.cls === 'Door' && v.boss)) {
            console.log(`-- unlocking ${door}`);
            door.locked = false;
        }
    }

    // METHODS -------------------------------------------------------------
    linkLevel(lvl) {
        if (!lvl) return;
        this.elvl = lvl;
        // setup directives
        let x_dir = {
            lvl: lvl,
            actor: this,
        }
        this.move = new AiMoveTowardsTargetDirective(x_dir);
        this.retreat = new AiMoveToIdxDirective(x_dir);
        this.search = new AiMoveToIdxDirective(x_dir);
        this.attack = new AiMeleeTargetDirective(x_dir);
        this.actionStream = this.run();
        // activate
        this.active = true;
    }

    // run state action generator
    *run() {
        while (!this.done) {
            switch (this.state) {
            case 'idle':
                yield null;
                break;

            case 'attack':
                // attempt to move within range
                yield *this.move.run();
                yield *this.attack.run();
                // prevent tight loops in run loop if move/attack both fail
                if (!this.move.ok && !this.attack.ok) yield null;
                break;

            case 'search':
                // attempt to move within range
                yield *this.search.run();
                // go back to idle state if search ends
                if (this.search.done) {
                    UpdateSystem.eUpdate(this, {state: 'idle'});
                    this.actionStream = this.run();
                    yield null;
                }
                break;

            case 'retreat':
                // find nearest water hole
                let bestIdx = Util.findBest(
                    this.losIdxs,
                    // best index based on distance to actor
                    (i) => this.elvl.idxdist(this.idx, i),
                    // best distance is closest (compare fcn)
                    (v1,v2) => v1<v2,
                    // no filter on distance values
                    (v) => true,
                    // filter target indices based on range to target and los to target
                    (i) => {
                        if (i === this.idx) return false;
                        // -- can't move there...
                        //if (this.lvl.anyidx(i, (v2) => v2.blocks & this.blockedBy)) return false;
                        // -- find water (pit) tiles
                        if (this.elvl.firstidx(i, (v) => v.kind === 'pit')) return true;
                        return false;
                    }
                );

                // move to water
                this.retreat.targetIdx = bestIdx;
                yield *this.retreat.run();

                // if water is frozen, slime is stunned, and cannot submerge
                if ( this.elvl.anyidx(bestIdx, (v) => FrozenCharm.applied(v))) {
                    let dazed = new DazedCharm();
                    this.addCharm(dazed);
                    yield null;
                    // transition back to attack
                    UpdateSystem.eUpdate(this, {state: 'attack'});
                // otherwise... submerge/hide
                } else {
                    // recharge
                    UpdateSystem.eUpdate(this, {hidden: true, state: 'recharge'});
                }
                break;

            case 'recharge':
                // remove any charms...
                for (let i=this.charms.length-1; i>=0; i--) {
                    let charm = this.charms[i];
                    charm.destroy();
                }
                // wait a turn
                yield null;
                // pick new location
                let idxs = this.losIdxs.filter((idx) => {
                    // check for min distance
                    if (this.elvl.idxdist(this.idx, idx) < Config.tileSize*2) return false;
                    // check for water
                    if (!this.elvl.firstidx(idx, (v) => v.kind === 'pit')) return false;
                    return true;
                });
                let idx = Random.choose(idxs);
                if (!idx) return;
                // re-emerge at new location
                let x = this.elvl.xfromidx(idx, true);
                let y = this.elvl.yfromidx(idx, true);
                // heal 33%
                let heal = Math.round(this.healthMax*.33);
                let health = Math.min(this.health+heal, this.healthMax);
                UpdateSystem.eUpdate(this, {state: 'attack', health: health, hidden: false, idx: idx, xform: {x:x, y:y}});
                if (this.qtrCheck && this.health > this.healthMax*.25) this.qtrCheck = false;
                if (this.halfCheck && this.health > this.healthMax*.5) this.halfCheck = false;
                break;

            default:
                yield null;
            }
        }
    }

}