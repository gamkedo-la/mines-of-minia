export { ProcGen };

import { SimpleNoise } from '../base/noise.js';
import { Prng } from '../base/prng.js';
import { Random } from '../base/random.js';
import { UxDbg } from '../base/uxDbg.js';
import { Discovery } from './discovery.js';
import { Layout } from './layout.js';
import { Outline } from './outline.js';
import { Spawn } from './spawn.js';
import { MiniaTemplates } from './templates.js';
import { Translate } from './translate.js';

class ProcGen {

    static *initGenerator(template, pstate) {
        if (!template.seed) template.seed = Random.rangeInt(1,100000);
        let seed = template.seed + pstate.seedDelta;
        Prng.seed(seed);
        pstate.pnoise = new SimpleNoise({
            seed: seed,
            scalex: template.noiseXScale || .04,
            scaley: template.noiseYScale || .05,
        });
        //console.log(`procgen template seed: ${template.seed} final: ${seed}`);
        if (template.doyield) yield;
    }

    static *levelGenerator(template={}, pstate={}) {
        let ok = false;
        let tries = 100;
        while (!ok && tries > 0) {
            tries--;
            try {
                // -- general initialization
                yield *this.initGenerator(template, pstate);
                console.log(`-- seed: ${template.seed}`);
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
                // -- spawn non-tile entities
                if (template.dospawn) yield *Spawn.generator(template, pstate);
                ok = true;
            } catch (error) {
                pstate.seedDelta += 1;
                console.log(`-- generator error: ${error} -- new delta: ${pstate.seedDelta}`);
            }
        }
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

    static genLvl(template, seedDelta=0) {
        console.log(`genLevel: seed: ${template.seed} delta: ${seedDelta}`);
        let pstate = {
            seedDelta: seedDelta,
        };
        for (const step of this.levelGenerator(template, pstate));
        pstate.plvl.seedDelta = pstate.seedDelta;
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