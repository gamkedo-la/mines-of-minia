export { Minia };

import { Fmt } from "./base/fmt.js";
import { Game } from "./base/game.js";
import { RenderSystem } from "./base/systems/renderSystem.js";
import { Config } from "./base/config.js";
import { Util } from './base/util.js';
import { Registry } from './base/registry.js';
import { TitleState } from './titleState.js';
import { FiddleState } from './fiddleState.js';
import { Systems } from './base/system.js';
import { TestProcState } from "./testProcState.js";
import { TestLevelState } from "./testLevelState.js";
import { TestNoiseState } from "./testNoiseState.js";
import { Tile } from "./entities/tile.js";
import { Level } from "./level.js";
import { Enemy } from "./entities/enemy.js";
import { Character } from "./entities/character.js";
import { Weapon } from "./entities/weapon.js";
import { miniaAssets } from "./assets.js";
import { Player } from "./entities/player.js";
import { ProcTemplate } from "./procgen/ptemplate.js";

class Minia extends Game {
    static states = {
        'title': new TitleState(),
        'fiddle': new FiddleState(),
        'testproc': new TestProcState(),
        'testlvl': new TestLevelState(),
        'testnoise': new TestNoiseState(),
    }
    static startStateTag = 'testlvl';
    static assetRefs = miniaAssets;

    static config = {
        dbg: {
            system: {
                ctrl: false,
                update: false,
                mouse: false,
                render: true,
                move: false,
                aggro: true,
                turn: false,
                /*
                los: {
                    visible: true,
                    blocked: true,
                },
                */
            },
            keys: false,
        },
        losEnabled: true,
        fowEnabled: true,
        tileSize: 16,
        scale: 4,

        template: new ProcTemplate({
            doyield: true,
            //seed: 3,
            seed: 62183,
            unitSize: 4,
            maxCols: 180,
            maxRows: 120,
            tileSize: 16,
            outline: {
                hallWidth: 3,
                colOverflow: 2,
                rowOverflow: 2,
            },
            translate: {
                floor: 'rock.floor',
                wall: 'rock.wall',
                pit: 'rock.pit',
                pitb: 'rock.pit.border',
                obs: 'rock.outcrop',
                obsb: 'rock.outcrop.border',
                doNoise: true,
            },
        }),
    };

    static init() {
        console.log(`${this.name}.init`);
        Registry.extend([
            Character,
            Enemy,
            Level,
            Player,
            Tile,
            Weapon,
        ]);
    }

    static ready() {
        // -- global game systems (run for all game states)
        Systems.add('render', new RenderSystem({dbg: Util.getpath(Config, 'dbg.system.render')}));
    }

    static onTock(evt) {
        //Stats.count('game.tock')
        //Stats.update(evt);
    }
}