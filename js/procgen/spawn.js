export { Spawn };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { Prng } from '../base/prng.js';
import { Chest } from '../entities/chest.js';
import { Clutter } from '../entities/clutter.js';
import { Cog } from '../entities/cog.js';
import { Door } from '../entities/door.js';
import { Fuelcell } from '../entities/fuelcell.js';
import { Funguy } from '../entities/funguy.js';
import { Gem } from '../entities/gem.js';
import { Growth } from '../entities/growth.js';
import { Key } from '../entities/key.js';
import { Projectile } from '../entities/projectile.js';
import { RangedWeapon } from '../entities/rangedWeapon.js';
import { Reactor } from '../entities/reactor.js';
import { Stairs } from '../entities/stairs.js';
import { Token } from '../entities/token.js';
import { Weapon } from '../entities/weapon.js';
import { ProcTemplate } from './ptemplate.js';

class Spawn {

    static *generator(template={}, pstate={}) {
        // -- doors
        this.spawnDoors(template, pstate);
        // -- stairs
        this.spawnStairs(template, pstate);
        // -- enemies
        this.spawnEnemies(template, pstate);
        // -- traps
        this.spawnTraps(template, pstate);
        // -- growth
        this.spawnGrowth(template, pstate);
        // -- clutter
        this.spawnClutter(template, pstate);
        // -- test objects
        this.spawnTest(template, pstate);
        yield;
    }

    static spawnDoors(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let doorTag = x_spawn.door || 'door';
        let plvl = pstate.plvl;
        // iterate through halls
        let phalls = pstate.phalls || [];
        for (const phall of phalls) {

            for (const idx of phall.exits) {
                plvl.entities.push(Door.xspec({
                    idx: idx,
                    x_sketch: Assets.get(doorTag),
                    z: 2,
                    blocks: 0,
                }));
            }
        }
    }

    static checkSpawnIdx(plvl, idx, otherFcn=(v) => v.idx === idx && v.cls !== 'Tile') {
        // -- ignore start index
        if (idx === plvl.startIdx) return false;
        // -- not at a door
        if (plvl.entities.some((v) => v.idx === idx && v.cls === 'Door')) return false;
        // -- not at a floor tile
        if (plvl.entities.some((v) => v.idx === idx && v.cls === 'Tile' && v.kind !== 'floor')) return false;
        // -- anything else at index?
        if (otherFcn && plvl.entities.some(otherFcn)) return false;
        return true;
    }

    static spawnTrapForRoom(template, pstate, proom, options) {
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        // pick spawn options for room
        let option = Prng.chooseWeightedOption(options);
        let chance = option.hasOwnProperty('chance') ? option.chance : 1;
        let min = option.hasOwnProperty('min') ? option.min : 1;
        let max = option.hasOwnProperty('max') ? option.max : 1;
        //console.log(`-- proom: ${proom} trap option: ${Fmt.ofmt(option)} chance: ${chance}`);
        // room trap check
        if (!Prng.flip(chance)) return;
        // how many traps
        let count = Prng.rangeInt(min, max);
        for (let i=0; i<count; i++) {
            // choose index
            let idx;
            for (let i=0; i<100; i++) {
                // -- randomly choose index from room
                idx = Prng.choose(proom.idxs);
                //console.log(`-- try index: ${idx}`);
                // -- test index to make sure nothing is there..
                if (!this.checkSpawnIdx(plvl, idx)) continue;
                // choose trap class
                let cls = Prng.choose(x_spawn.trapList);
                let x_trap = cls.xspec({
                    idx: idx,
                    z: template.bgoZed,
                });
                //console.log(`trap: ${Fmt.ofmt(x_trap)}`);
                plvl.entities.push(x_trap);
                break;
            }
        }
    }

    static spawnTraps(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        if (!x_spawn.trapList) return;
        // -- iterate through rooms
        // iterate through rooms
        for (const proom of prooms) {
            this.spawnTrapForRoom(template, pstate, proom, x_spawn.roomTrapOptions);
        }
        // iterate through halls
        for (const phall of phalls) {
            this.spawnTrapForRoom(template, pstate, phall, x_spawn.hallTrapOptions);
        }
    }

    static spawnGrowthForRoom(template, pstate, room) {
        let x_spawn = template.spawn || {};
        let plvlo = pstate.plvlo;
        let plvl = pstate.plvl;
        let noise = pstate.pnoise;
        let growth = x_spawn.growth || 'growth.test';
        let growthNoisePct = x_spawn.growthNoisePct || 0;
        let growthNoisePeriod = x_spawn.growthNoisePeriod || 1;
        let growthFreePct = x_spawn.growthFreePct || 0;
        if (!growthNoisePct && !growthFreePct) return;
        // iterate indicies
        for (const idx of room.idxs) {
            // -- test index to make sure nothing is there..
            if (!this.checkSpawnIdx(plvl, idx)) continue;
            // -- check free spawn
            let spawn = Prng.flip(growthFreePct);
            if (!spawn) {
                // -- test for
                let i = plvlo.data.ifromidx(idx) + plvlo.data.cols;
                let j = plvlo.data.jfromidx(idx) + plvlo.data.rows;
                // -- sample is in range of -1 to 1
                // -- pct is in range of 0 to 1
                let sample = noise.sample(i*growthNoisePeriod,j*growthNoisePeriod);
                if (sample < (growthNoisePct*2)-1) spawn = true;
            }
            if (spawn) {
                let x_growth = Growth.xspec({
                    idx: idx,
                    z: template.fgZed,
                    x_sketch: Assets.get(growth),
                });
                //console.log(`growth: ${Fmt.ofmt(x_growth)}`);
                plvl.entities.push(x_growth);
            }
        }
    }

    static spawnGrowth(template, pstate) {
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        for (const proom of prooms) {
            this.spawnGrowthForRoom(template, pstate, proom);
        }
        // iterate through halls
        for (const phall of phalls) {
            this.spawnGrowthForRoom(template, pstate, phall);
        }
    }

    static spawnClutterForRoom(template, pstate, room) {
        let x_spawn = template.spawn || {};
        let plvlo = pstate.plvlo;
        let plvl = pstate.plvl;
        let clutter = x_spawn.clutter || 'clutter.test';
        let clutterFreePct = x_spawn.clutterFreePct || 0;
        if (!clutterFreePct) return;
        // iterate indicies
        for (const idx of room.idxs) {
            // -- test index to make sure nothing is there..
            // -- clutter can spawn under other items (except growth)
            if (!this.checkSpawnIdx(plvl, idx, (v) => (v.idx === idx && v.cls === 'Growth'))) continue;
            // -- count adjacent walls
            let walls = Direction.cardinals.reduce((pv, cv) => {
                let aidx = plvlo.data.idxfromdir(idx, cv);
                let kind = plvlo.data.getidx(aidx);
                if (kind === 'wall') return pv + 1
                return (kind === 'wall') ? pv + 1 : pv;
            }, 0);
            // -- check free spawn
            // -- only will spawn against walls
            let chance = clutterFreePct * walls;
            let spawn = Prng.flip(chance);
            if (spawn) {
                let x_growth = Clutter.xspec({
                    idx: idx,
                    z: template.bgoZed,
                    x_sketch: Assets.get(clutter),
                });
                //console.log(`growth: ${Fmt.ofmt(x_growth)}`);
                plvl.entities.push(x_growth);
            }
        }
    }

    static spawnClutter(template, pstate) {
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        for (const proom of prooms) {
            this.spawnClutterForRoom(template, pstate, proom);
        }
        // iterate through halls
        for (const phall of phalls) {
            this.spawnClutterForRoom(template, pstate, phall);
        }
    }

    static spawnStairs(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        let upTag = x_spawn.stairsUp || 'stairs_up';
        let downTag = x_spawn.stairsDown || 'stairs_down';
        // stairs down
        if (plvl.index > 1) {

            plvl.entities.push(Stairs.xspec({
                up: false,
                idx: plvl.startIdx,
                x_sketch: Assets.get(downTag),
                z: template.fgZed,
                blocks: 0,
            }));

        }

        plvl.entities.push(Stairs.xspec({
            up: true,
            idx: plvl.exitIdx,
            x_sketch: Assets.get(upTag),
            z: 2,
            blocks: 0,
        }));

    }

    static genItem(template, pstate) {
        let x_spawn = template.spawn || {};
        // pick item class
        let itemClass = Prng.choose(x_spawn.itemList);
    }

    static genEnemy(template, pstate) {
        let x_spawn = template.spawn || {};
        // pick enemy class
        let enemyClass = Prng.choose(x_spawn.enemyList);
        // -- level
        let lvl = template.index;
        let option = Prng.chooseWeightedOption(x_spawn.enemyLvlOptions);
        console.log(`option: ${Fmt.ofmt(option)}`);
        lvl += option.delta;
        lvl = Mathf.clampInt(lvl, 1, Config.maxLvl);
        let x_enemy = enemyClass.xspec({
            lvl: lvl,
            healthMax: enemyClass.gHealth.calculate(lvl),
            xp: enemyClass.gXp.calculate(lvl),
            attackRating: enemyClass.gAttackRating.calculate(lvl),
            defenseRating: enemyClass.gDefenseRating.calculate(lvl),
            damageMin: enemyClass.gDamageMin.calculate(lvl),
            damageMax: enemyClass.gDamageMax.calculate(lvl),
        });
        return x_enemy;
    }

    static spawnEnemiesForRoom(template, pstate, proom, options) {
        let plvl = pstate.plvl;
        // pick spawn options for room
        let option = Prng.chooseWeightedOption(options);
        //console.log(`option: ${Fmt.ofmt(option)} from: ${Fmt.ofmt(options)}`);
        let chance = option.hasOwnProperty('chance') ? option.chance : 1;
        let min = option.hasOwnProperty('min') ? option.min : 1;
        let max = option.hasOwnProperty('max') ? option.max : 1;
        // spawn check
        if (!Prng.flip(chance)) return;
        // spawn count
        let count = Prng.rangeInt(min, max);
        for (let i=0; i<count; i++) {
            // choose index
            let idx;
            for (let i=0; i<100; i++) {
                // -- randomly choose index from room
                idx = Prng.choose(proom.idxs);
                // -- test index to make sure nothing is there..
                if (!this.checkSpawnIdx(plvl, idx)) continue;
                // choose trap class
                let x_enemy = Object.assign(this.genEnemy(template, pstate), {
                    idx: idx,
                    z: template.fgZed,
                });
                console.log(`enemy: ${Fmt.ofmt(x_enemy)}`);
                plvl.entities.push(x_enemy);
                break;
            }
        }
    }

    static spawnEnemies(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        //let plvlo = pstate.plvlo;
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        if (x_spawn.enemyList.length === 0) return;

        // iterate through rooms
        for (const proom of prooms) {
            this.spawnEnemiesForRoom(template, pstate, proom, x_spawn.enemyRoomOptions);
        }
        // iterate through rooms
        for (const proom of phalls) {
            this.spawnEnemiesForRoom(template, pstate, proom, x_spawn.enemyHallOptions);
        }

    }

    static spawnTest(template, pstate) {
        let plvl = pstate.plvl;
        let prooms = pstate.prooms || [];
        // what is the starting room?
        let sroom;
        for (const proom of prooms) {
            if (proom.cidx === plvl.startIdx) {
                sroom = proom;
                break;
            }
        }
        if (!sroom) return;
        // iterate items to spawn
        let x_spawns = [
            Weapon.xspec({
                kind: 'poke',
                name: 'poke.1',
                x_sketch: Assets.get('poke.1'),
                identifiable: true,
            }),
            Gem.xspec({
                name: 'health.gem',
                kind: 'health',
            }),
            Cog.xspec({
                name: 'test.cog',
                kind: 'test',
            }),
            Cog.xspec({
                name: 'identify.cog',
                kind: 'identify',
            }),
            Cog.xspec({
                name: 'identify.cog',
                kind: 'identify',
            }),
            /*
            Funguy.xspec({
                name: 'funguy',
                loot: [
                    Token.xspec({
                        name: 'token',
                        x_sketch: Assets.get('token'),
                        count: 5,
                    }),
                ],
            }),
            */

            /*
            Cog.xspec({
                name: 'brass.cog',
                x_sketch: Assets.get('cog_brass'),
            }),
            */
            Chest.xspec({
                name: 'chest.brown',
                x_sketch: Assets.get('chest.brown'),
                loot: [
                    Token.xspec({
                        name: 'token',
                        x_sketch: Assets.get('token'),
                        count: 5,
                    }),
                ],
            }),
            Fuelcell.xspec({
                name: 'fuelcell',
                x_sketch: Assets.get('fuelcell'),
            }),

            RangedWeapon.xspec({
                name: 'ice.gun.3',
                x_sketch: Assets.get('ice.gun.3'),
                baseDamageMin: 15,
                baseDamageMax: 20,
                projectileSpec: Projectile.xspec({x_sketch: Assets.get('projectile.ice')}),
            }),

        ];
        for (const x_spawn of x_spawns) {
            for (let i=0; i<100; i++) {
                // -- randomly choose index from room
                let idx = Prng.choose(sroom.idxs);
                // -- test index to make sure nothing is there..
                if (idx === plvl.startIdx) continue;
                // -- not at a floor tile
                if (plvl.entities.some((v) => v.idx === idx && v.cls === 'Tile' && v.kind !== 'floor')) continue;
                // -- anything else at index
                if (plvl.entities.some((v) => v.idx === idx && v.cls !== 'Tile')) continue;
                // success -- add spawn
                let x_final = Object.assign({}, x_spawn, {
                    idx: idx,
                    z: template.fgZed,
                });
                //console.log(`x_final: ${Fmt.ofmt(x_final)}`);
                plvl.entities.push(x_final);
                break;
            }
        }

    }

}