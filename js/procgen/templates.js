export { MiniaTemplates };

import { Energy } from '../entities/energy.js';
import { Funguy } from '../entities/funguy.js';
import { Magma } from '../entities/magma.js';
import { Rous } from '../entities/rous.js';
import { Scarab } from '../entities/scarab.js';
import { SpikeTrap } from '../entities/spikeTrap.js';
import { ProcTemplate } from './ptemplate.js';

class MiniaTemplates {

    static bioLvl = new ProcTemplate({
        //seed: 1,
        //seed: 74830 -- no stairs?
        seed: 59894,
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
                { weight: 1, cls: Scarab },
                { weight: .5, cls: Funguy },
                { weight: .25, cls: Magma },
                { weight: .25, cls: Energy },
            ],
            trapList: [ SpikeTrap ],
            growth: 'vine.growth',
            growthFreePct: .1,
            growthNoisePct: .25,
            clutter: 'bio.clutter',
            machineTags: ['machine.gear', 'machine.crystal'],
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
                { weight: 1, cls: Scarab },
                { weight: .5, cls: Funguy },
                { weight: .25, cls: Magma },
                { weight: .25, cls: Energy },
            ],
            trapList: [ SpikeTrap ],
            growth: 'rock.growth',
            growthFreePct: .1,
            growthNoisePct: .25,
            clutter: 'rock.clutter',
            machineTags: ['machine.gear', 'machine.crystal'],
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
            enemyList: [ 
                { weight: 1, cls: Rous },
                { weight: .5, cls: Funguy },
                { weight: .5, cls: Magma },
            ],
            trapList: [ SpikeTrap ],
            growth: 'rock.growth',
            growthFreePct: .1,
            growthNoisePct: .25,
            clutter: 'rock.clutter',
            machineTags: ['machine.gear'],
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
            enemyList: [ 
                { weight: 1, cls: Rous },
                { weight: .5, cls: Funguy },
                { weight: .5, cls: Magma },
            ],
            trapList: [ SpikeTrap ],
            growth: 'rock.growth',
            growthFreePct: .1,
            growthNoisePct: .25,
            clutter: 'rock.clutter',
            machineTags: ['machine.gear'],
        }
    });

}