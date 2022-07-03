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
import { PlayState } from "./playState.js";
import { TestNoiseState } from "./testNoiseState.js";
import { Tile } from "./entities/tile.js";
import { Level } from "./level.js";
import { Enemy } from "./entities/enemy.js";
import { Character } from "./entities/character.js";
import { Weapon } from "./entities/weapon.js";
import { miniaAssets } from "./assets.js";
import { Player } from "./entities/player.js";
import { ProcTemplate } from "./procgen/ptemplate.js";
import { Stairs } from "./entities/stairs.js";
import { Rous } from "./entities/rous.js";
import { Door } from "./entities/door.js";

class Minia extends Game {
    static states = {
        'title': new TitleState(),
        'fiddle': new FiddleState(),
        'testproc': new TestProcState(),
        'play': new PlayState(),
        'testnoise': new TestNoiseState(),
    }
    static startStateTag = 'play';
    static assetRefs = miniaAssets;

    static config = {
        dbg: {
            system: {
                ctrl: false,
                update: false,
                mouse: false,
                render: false,
                move: false,
                aggro: false,
                turn: false,
                close: false,
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
            seed: 3,
            // FIXME: known bad seeds...
            //seed: 62183,
            //seed: 3,
            unitSize: 6,
            maxCols: 140,
            maxRows: 100,
            tileSize: 16,
            outline: {
                hallWidth: 3,
                colOverflow: 1,
                rowOverflow: 1,
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
            spawn: {
                enemyList: [ Rous ],
            }
        }),
    };

    static init() {
        console.log(`${this.name}.init`);
        Registry.extend([
            Character,
            Door,
            Enemy,
            Level,
            Player,
            Rous,
            Stairs,
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