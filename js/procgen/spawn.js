export { Spawn };

import { Array2D } from '../base/array2d.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { Prng } from '../base/prng.js';
import { Enemy } from '../entities/enemy.js';
import { Stairs } from '../entities/stairs.js';

class Spawn {

    static *generator(template={}, pstate={}) {
        // -- stairs
        this.spawnStairs(template, pstate);
        // -- enemies
        this.spawnEnemies(template, pstate);
        yield;
    }

    static spawnStairs(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        let upTag = x_spawn.stairsUp || 'stairs.up';
        let downTag = x_spawn.stairsDown || 'stairs.down';
        // stairs down
        if (plvl.index > 1) {

            plvl.entities.push(Stairs.xspec({
                tag: 'stairs.down',
                up: false,
                idx: plvl.startIdx,
                x_sketch: Assets.get(downTag),
                z: 2,
                blocks: 0,
            }));

        }

        plvl.entities.push(Stairs.xspec({
            tag: 'stairs.up',
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
            console.log(`flip ok`);

            // choose appropriate index within room
            let possible = Array.from(proom.idxs);
            let spawnIdx = -1;
            let tries = 20;
            while(possible.length) {
                if (tries-- <= 0) break;
                console.log(`possible.length: ${possible.length}`);
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
            console.log(`enemy: ${Fmt.ofmt(x_enemy)}`);

            plvl.entities.push(x_enemy);
        }

        /*
        plvl.entities.push(Enemy.xspec({
            tag: 'enemy',
            idx: Array2D.idxfromdir(plvl.startIdx+3, Direction.south, plvl.cols, plvl.rows),
            x_sketch: Assets.get('enemy'),
            maxSpeed: .15,
            z: 2,
            losRange: Config.tileSize*8,
            aggroRange: Config.tileSize*5,
        }));
        */
    }

}