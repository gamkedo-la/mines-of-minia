export { Spawn };

import { Array2D } from '../base/array2d.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Enemy } from '../entities/enemy.js';
import { Stairs } from '../entities/stairs.js';

class Spawn {

    static *generator(template={}, pstate={}) {
        // -- stairs
        this.spawnStairs(template, pstate);
        // -- enemies
        //this.spawnEnemies(template, pstate);
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

        // FIXME: replace w/ real code
        plvl.entities.push(Enemy.xspec({
            tag: 'enemy',
            idx: plvl.startIdx + 3,
            x_sketch: Assets.get('enemy'),
            maxSpeed: .25,
            z: 2,
            losRange: Config.tileSize*8,
            aggroRange: Config.tileSize*5,
            resistances: { bonk: .25 },
        }));

        plvl.entities.push(Enemy.xspec({
            tag: 'enemy',
            idx: Array2D.idxfromdir(plvl.startIdx+3, Direction.south, plvl.cols, plvl.rows),
            x_sketch: Assets.get('enemy'),
            maxSpeed: .15,
            z: 2,
            losRange: Config.tileSize*8,
            aggroRange: Config.tileSize*5,
        }));
    }

}