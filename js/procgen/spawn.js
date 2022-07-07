export { Spawn };

import { Array2D } from '../base/array2d.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { Prng } from '../base/prng.js';
import { Door } from '../entities/door.js';
import { Enemy } from '../entities/enemy.js';
import { Gem } from '../entities/gem.js';
import { Stairs } from '../entities/stairs.js';
import { Weapon } from '../entities/weapon.js';

class Spawn {

    static *generator(template={}, pstate={}) {
        // -- doors
        this.spawnDoors(template, pstate);
        // -- stairs
        this.spawnStairs(template, pstate);
        // -- enemies
        this.spawnEnemies(template, pstate);
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
            let x_enemy = Object.assign(
                enemyClass.xspec({
                    idx: spawnIdx,
                    z: 2,
                    maxSpeed: .25,
                    losRange: Config.tileSize*8,
                    aggroRange: Config.tileSize*5,
                }),
                enemyClass.attsByLevel(template.index),
            );
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
                name: 'gray.sword',
                x_sketch: Assets.get('sword.gray'),
            }),
            Weapon.xspec({
                name: 'white.sword',
                x_sketch: Assets.get('sword.white'),
            }),
            Gem.xspec({
                name: 'blue.gem',
                x_sketch: Assets.get('gem.blue'),
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
                console.log(`x_final: ${Fmt.ofmt(x_final)}`);
                plvl.entities.push(x_final);
                break;
            }
        }

    }

}