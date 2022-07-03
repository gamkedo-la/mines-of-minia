export { Spawn };

import { Array2D } from '../base/array2d.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { Prng } from '../base/prng.js';
import { Door } from '../entities/door.js';
import { Enemy } from '../entities/enemy.js';
import { Stairs } from '../entities/stairs.js';

class Spawn {

    static *generator(template={}, pstate={}) {
        // -- doors
        this.spawnDoors(template, pstate);
        // -- stairs
        this.spawnStairs(template, pstate);
        // -- enemies
        this.spawnEnemies(template, pstate);
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

}