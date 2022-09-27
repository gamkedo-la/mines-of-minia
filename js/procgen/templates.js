export { MiniaTemplates };

import { Funguy } from '../entities/funguy.js';
import { Magma } from '../entities/magma.js';
import { Rous } from '../entities/rous.js';
import { SpikeTrap } from '../entities/spikeTrap.js';
import { ProcTemplate } from './ptemplate.js';

class MiniaTemplates {

    static rockLvl = new ProcTemplate({
        doyield: true,
        //seed: 3,
        // FIXME: known bad seeds...
        //seed: 62183,
        seed: 37241,
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
            enemyList: [ Rous, Funguy, Magma ],
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
        //seed: 3,
        // FIXME: known bad seeds...
        seed: 62183,
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
            enemyList: [ Rous, Funguy, Magma ],
            trapList: [ SpikeTrap ],
            growth: 'rock.growth',
            growthFreePct: .1,
            growthNoisePct: .25,
            clutter: 'rock.clutter',
            machineTags: ['machine.gear'],
        }
    });

}