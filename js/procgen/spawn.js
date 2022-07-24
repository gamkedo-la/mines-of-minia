export { Spawn };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Fmt } from '../base/fmt.js';
import { Prng } from '../base/prng.js';
import { Chest } from '../entities/chest.js';
import { Door } from '../entities/door.js';
import { Fuelcell } from '../entities/fuelcell.js';
import { Funguy } from '../entities/funguy.js';
import { Gem } from '../entities/gem.js';
import { Growth } from '../entities/growth.js';
import { Key } from '../entities/key.js';
import { Projectile } from '../entities/projectile.js';
import { RangedWeapon } from '../entities/rangedWeapon.js';
import { Reactor } from '../entities/reactor.js';
import { SpikeTrap } from '../entities/spikeTrap.js';
import { Stairs } from '../entities/stairs.js';
import { Token } from '../entities/token.js';
import { Weapon } from '../entities/weapon.js';

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
                if (idx === plvl.startIdx) continue;
                // -- not at a floor tile
                if (plvl.entities.some((v) => v.idx === idx && v.cls === 'Tile' && v.kind !== 'floor')) continue;
                // -- anything else at index
                if (plvl.entities.some((v) => v.idx === idx && v.cls !== 'Tile')) continue;
                // choose trap class
                let cls = Prng.choose(x_spawn.trapList);
                let x_trap = cls.xspec({
                    idx: idx,
                    z: 2,
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
        if (!x_spawn.trapList) return;
        let phalls = pstate.phalls || [];
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
                z: 2,
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

    static spawnEnemies(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        let plvlo = pstate.plvlo;
        let prooms = pstate.prooms || [];
        if (x_spawn.enemyList.length === 0) return;

        // iterate through rooms
        for (const proom of prooms) {
            // roll for spawn
            if (!Prng.flip(x_spawn.roomSpawnChance)) continue;
            //console.log(`flip ok`);

            // choose appropriate index within room
            let possible = Array.from(proom.idxs);
            let spawnIdx = -1;
            let tries = 20;
            while(possible.length) {
                if (tries-- <= 0) break;
                //console.log(`possible.length: ${possible.length}`);
                let i = Prng.rangeInt(0, possible.length);
                let testIdx = possible[i];
                let kind = plvlo.data.getidx(testIdx);
                let ok = true;
                if (kind !== 'floor') ok = false;
                if (testIdx === plvl.startIdx) ok = false;
                if (testIdx === plvl.exitIdx) ok = false;
                if (ok) {
                    spawnIdx = testIdx;
                    break;
                } else {
                    possible.splice(i, 1);
                }
            }

            if (spawnIdx === -1) continue;

            // choose enemy class
            let enemyClass = Prng.choose(x_spawn.enemyList);
            let x_enemy = enemyClass.xspec({
                idx: spawnIdx,
                z: 2,
                maxSpeed: .25,
                losRange: Config.tileSize*8,
                aggroRange: Config.tileSize*5,
            });
            //console.log(`enemy: ${Fmt.ofmt(x_enemy)}`);

            plvl.entities.push(x_enemy);
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
            }),
            Weapon.xspec({
                kind: 'hack',
                name: 'hack.1',
                x_sketch: Assets.get('hack.1'),
            }),
            Gem.xspec({
                name: 'health.gem',
                kind: 'health',
            }),
            Gem.xspec({
                name: 'health.gem',
                kind: 'health',
            }),
            Gem.xspec({
                name: 'test.gem',
                kind: 'test',
            }),
            Key.xspec({
                name: 'gold.key',
                x_sketch: Assets.get('key.gold'),
            }),
            Reactor.xspec({
                name: 'reactor.1',
                x_sketch: Assets.get('reactor.1'),
            }),
            Token.xspec({
                name: 'token',
                x_sketch: Assets.get('token'),
                count: 5,
            }),
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

            Growth.xspec({
                name: 'growth.test',
                x_sketch: Assets.get('growth.test'),
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
                    z: 2,
                });
                //console.log(`x_final: ${Fmt.ofmt(x_final)}`);
                plvl.entities.push(x_final);
                break;
            }
        }

    }

}