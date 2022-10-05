export { MiniaTemplates };

import { Energy } from '../entities/energy.js';
import { Funguy } from '../entities/funguy.js';
import { Magma } from '../entities/magma.js';
import { Rous } from '../entities/rous.js';
import { Scarab } from '../entities/scarab.js';
import { SpikeTrap } from '../entities/spikeTrap.js';
import { ProcTemplate } from './ptemplate.js';

class MiniaTemplates {

    static rockLvl = new ProcTemplate({
        seed: 1,
        //seed: 74830 -- no stairs?
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
            machineTags: ['machine.gear'],
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