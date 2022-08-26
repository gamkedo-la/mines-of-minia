export { ProcGen };

    import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Fmt } from '../base/fmt.js';
import { SimpleNoise } from '../base/noise.js';
import { Prng } from '../base/prng.js';
import { Random } from '../base/random.js';
import { UxDbg } from '../base/uxDbg.js';
import { XForm } from '../base/xform.js';
import { Player } from '../entities/player.js';
import { Reactor } from '../entities/reactor.js';
import { Weapon } from '../entities/weapon.js';
import { InventoryData } from '../inventory.js';
import { Discovery } from './discovery.js';
import { Layout } from './layout.js';
import { Outline } from './outline.js';
import { ProcRoom } from './proom.js';
import { Spawn } from './spawn.js';
import { Translate } from './translate.js';

class ProcGen {

    static genPlayer(template) {
        let player = new Player({
            tag: 'pc',
            idx: 0,
            xform: new XForm({ stretch: false }),
            sketch: Assets.get('player', true),
            maxSpeed: Config.tileSize/.3/1000,
            z: template.fgZed,
            healthMax: 100,
            losRange: Config.tileSize*5,
            team: 'player',
            inventory: new InventoryData({
                numSlots: 15,
                beltSlots: 3,
                gadgetSlots: 1,
            }),
        });

        // assign initial inventory
        let reactor = new Reactor({
            identified: true,
            healthRegenPerAP: .2,
            fuelPerAP: .5,
            sketch: Assets.get('reactor.1', true),
        });
        let weapon = new Weapon({
            kind: 'poke',
            sketch: Assets.get('poke.1', true),
        });

        player.inventory.equip('reactor', reactor);
        player.inventory.equip('weapon', weapon);

        return player;
    }

    static *initGenerator(template, pstate) {
        if (!template.seed) template.seed = Random.rangeInt(1,100000);
        let seed = template.seed + template.index;
        Prng.seed(seed);
        pstate.pnoise = new SimpleNoise({
            seed: seed,
            scalex: template.noiseXScale || .04,
            scaley: template.noiseYScale || .05,
        });
        console.log(`procgen template seed: ${template.seed} final: ${seed}`);
        if (template.doyield) yield;
    }

    static *levelGenerator(template={}, pstate={}) {
        // -- general initialization
        yield *this.initGenerator(template, pstate);
        let validLevel = true;
        do {
            // -- generate room layout
            yield *Layout.generator(template, pstate);
            // -- generate level outline
            yield *Outline.generator(template, pstate);
            validLevel = Outline.validate(template, pstate);
            if (!validLevel) {
                for (const key in pstate) {
                    if (key !== 'pnoise') delete pstate[key];
                }
            }
        } while (!validLevel);
        // -- translate level outline to level data
        yield *Translate.generator(template, pstate);
        console.log(`-- dospawn: ${template.dospawn}`);
        // -- spawn non-tile entities
        if (template.dospawn) yield *Spawn.generator(template, pstate);
    }

    static dbgGenerateLevel(generator, pstate) {
        // execute next step
        let stepv = generator.next();
        UxDbg.clear();
        for (const p of Object.values(pstate)) {
            if (Array.isArray(p)) {
                for (const sp of p) {
                    if (sp.draw) sp.draw();
                }
            } else {
                if (p.draw) p.draw();
            }
        }
        return stepv.done;
    }

    static genLvl(template) {
        let pstate = {};
        for (const step of this.levelGenerator(template, pstate));
        return pstate.plvl;
    }

    static *discoveryGenerator(template={}, pstate={}) {
        // -- resolve discoverable items
        yield *Discovery.generator(template, pstate);
    }

    static genDiscovery(template) {
        let pstate = {};
        for (const step of this.discoveryGenerator(template, pstate));
    }

    static ijasxy(lvl, i, j) {
        return [lvl.x+i*lvl.tileSize, lvl.y+j*lvl.tileSize];
    }

}