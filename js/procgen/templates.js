export { MiniaTemplates };

import { Digger } from '../entities/digger.js';
import { Energy } from '../entities/energy.js';
import { Funguy } from '../entities/funguy.js';
import { Golem } from '../entities/golem.js';
import { Magma } from '../entities/magma.js';
import { Rous } from '../entities/rous.js';
import { Scarab } from '../entities/scarab.js';
import { SpikeTrap } from '../entities/spikeTrap.js';
import { ProcTemplate } from './ptemplate.js';

class MiniaTemplates {

    static bioLvl = new ProcTemplate({
        //seed: 59894, // hanging door
        //seed: 78683, // procgen crash (rock)
        //seed: 73560, // procgen crash (rock/8)
        //seed: 37699, // procgen crash (rock/8)
        //seed: 79469, // procgen crash (rock/8)
        //seed: 34836, // procgen crash (rock/8)
        doyield: true,
        translate: {
            floor: 'bio.floor',
            wall: 'bio.wall',
            pit: 'bio.pit',
            pitb: 'bio.pit.border',
            obs: 'rock.outcrop',
            obsb: 'bio.pit.border',
            doNoise: true,
        },
        spawn: {
            enemyList: [ 
                { weight: 1, cls: Rous },
                { weight: .5, cls: Scarab },
                { weight: .5, cls: Digger },
                { weight: .25, cls: Funguy },
                { weight: .15, cls: Energy },
            ],
            trapList: [ SpikeTrap ],
            growth: 'vine.growth',
            growthFreePct: .1,
            growthNoisePct: .25,
            clutter: 'bio.clutter',
            machineTags: ['machine.cart', 'machine.tnt', 'machine.gear', 'machine.crystal'],
            machineRoomPct: .6,
        }
    });

    static rockLvl = new ProcTemplate({
        doyield: true,
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
            enemyList: [ 
                { weight: 1, cls: Rous },
                { weight: .5, cls: Golem },
                { weight: .5, cls: Digger },
                { weight: .25, cls: Magma },
                { weight: .15, cls: Energy },
            ],
            trapList: [ SpikeTrap ],
            growth: 'rock.growth',
            growthFreePct: .1,
            growthNoisePct: .25,
            clutter: 'rock.clutter',
            machineTags: ['machine.cart', 'machine.tnt', 'machine.gear', 'machine.crystal'],
            machineRoomPct: .6,
        }
    });

    static rockBoss = new ProcTemplate({
        doyield: true,
        boss: 'rock',
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
            chestMin: 0,
            chestMax: 0,
            secretRoomMin: 1,
            secretRoomMax: 2,
            secretCacheMin: 0,
            secretCacheMax: 0,
            lockRoomMin: 0,
            lockRoomMax: 0,
            lockChestPct: 0,
            enemyList: [],
            trapList: [ SpikeTrap ],
            growth: 'rock.growth',
            growthFreePct: .1,
            growthNoisePct: .25,
            clutter: 'rock.clutter',
            machineTags: ['machine.cart', 'machine.tnt', 'machine.gear', 'machine.crystal'],
        }
    });

    static bioBoss = new ProcTemplate({
        doyield: true,
        boss: 'bio',
        translate: {
            floor: 'rock.floor',
            wall: 'rock.wall',
            pit: 'bio.pit',
            pitb: 'rock.pit.border',
            obs: 'rock.outcrop',
            obsb: 'rock.outcrop.border',
            doNoise: true,
        },
        spawn: {
            chestMin: 0,
            chestMax: 0,
            secretRoomMin: 1,
            secretRoomMax: 2,
            secretCacheMin: 0,
            secretCacheMax: 0,
            lockRoomMin: 0,
            lockRoomMax: 0,
            lockChestPct: 0,
            enemyList: [],
            trapList: [ SpikeTrap ],
            growth: 'rock.growth',
            growthFreePct: .1,
            growthNoisePct: .25,
            clutter: 'rock.clutter',
            machineTags: ['machine.cart', 'machine.tnt', 'machine.gear', 'machine.crystal'],
        }
    });

}