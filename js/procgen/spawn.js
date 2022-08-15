export { Spawn };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { Mathf } from '../base/math.js';
import { Prng } from '../base/prng.js';
import { Util } from '../base/util.js';
import { BooCharm } from '../charms/boo.js';
import { Charm } from '../charms/charm.js';
import { FieryCharm } from '../charms/fiery.js';
import { Chest } from '../entities/chest.js';
import { Clutter } from '../entities/clutter.js';
import { Cog } from '../entities/cog.js';
import { Door } from '../entities/door.js';
import { Enemy } from '../entities/enemy.js';
import { Fuelcell } from '../entities/fuelcell.js';
import { Funguy } from '../entities/funguy.js';
import { Gadget } from '../entities/gadget.js';
import { Gem } from '../entities/gem.js';
import { Growth } from '../entities/growth.js';
import { Key } from '../entities/key.js';
import { Magma } from '../entities/magma.js';
import { Projectile } from '../entities/projectile.js';
import { RangedWeapon } from '../entities/rangedWeapon.js';
import { Reactor } from '../entities/reactor.js';
import { Rous } from '../entities/rous.js';
import { Shielding } from '../entities/shielding.js';
import { Stairs } from '../entities/stairs.js';
import { Token } from '../entities/token.js';
import { Weapon } from '../entities/weapon.js';
import { ProcTemplate } from './ptemplate.js';

class Spawn {

    static *generator(template={}, pstate={}) {
        // -- doors
        this.spawnDoors(template, pstate);
        // -- stairs
        this.spawnStairs(template, pstate);
        // -- enemies
        this.spawnEnemies(template, pstate);
        // -- traps
        this.spawnTraps(template, pstate);
        // -- growth
        //this.spawnGrowth(template, pstate);
        // -- clutter
        this.spawnClutter(template, pstate);
        // -- test objects
        this.spawnTest(template, pstate);
        yield;
    }

    static spawnDoors(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        //let doorTag = x_spawn.door || 'door';
        let plvl = pstate.plvl;
        // iterate through halls
        let phalls = pstate.phalls || [];
        for (const phall of phalls) {
            for (const idx of phall.exits) {
                plvl.entities.push(Door.xspec({
                    idx: idx,
                    //x_sketch: Assets.get(doorTag),
                    z: 2,
                    blocks: 0,
                }));
            }
        }
    }

    static checkSpawnIdx(plvl, idx, otherFcn=(v) => v.idx === idx && v.cls !== 'Tile') {
        // -- ignore start index
        if (idx === plvl.startIdx) return false;
        // -- not at a door
        if (plvl.entities.some((v) => v.idx === idx && v.cls === 'Door')) return false;
        // -- not at a floor tile
        if (plvl.entities.some((v) => v.idx === idx && v.cls === 'Tile' && v.kind !== 'floor')) return false;
        // -- anything else at index?
        if (otherFcn && plvl.entities.some(otherFcn)) return false;
        return true;
    }

    static spawnTrapForRoom(template, pstate, proom, options) {
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        // pick spawn options for room
        let option = Prng.chooseWeightedOption(options);
        let chance = option.hasOwnProperty('chance') ? option.chance : 1;
        let min = option.hasOwnProperty('min') ? option.min : 1;
        let max = option.hasOwnProperty('max') ? option.max : 1;
        //console.log(`-- proom: ${proom} trap option: ${Fmt.ofmt(option)} chance: ${chance}`);
        // room trap check
        if (!Prng.flip(chance)) return;
        // how many traps
        let count = Prng.rangeInt(min, max);
        for (let i=0; i<count; i++) {
            // choose index
            let idx;
            for (let i=0; i<100; i++) {
                // -- randomly choose index from room
                idx = Prng.choose(proom.idxs);
                // -- test index to make sure nothing is there..
                if (!this.checkSpawnIdx(plvl, idx)) continue;
                // choose trap class
                let cls = Prng.choose(x_spawn.trapList);
                // is trap hidden?
                let hidden = Prng.flip(x_spawn.trapHiddenPct);
                let x_trap = cls.xspec({
                    idx: idx,
                    hidden: hidden,
                    z: template.bgoZed,
                });
                //console.log(`trap: ${Fmt.ofmt(x_trap)}`);
                plvl.entities.push(x_trap);
                break;
            }
        }
    }

    static spawnTraps(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        if (!x_spawn.trapList) return;
        // -- iterate through rooms
        // iterate through rooms
        for (const proom of prooms) {
            this.spawnTrapForRoom(template, pstate, proom, x_spawn.roomTrapOptions);
        }
        // iterate through halls
        for (const phall of phalls) {
            this.spawnTrapForRoom(template, pstate, phall, x_spawn.hallTrapOptions);
        }
    }

    static spawnGrowthForRoom(template, pstate, room) {
        let x_spawn = template.spawn || {};
        let plvlo = pstate.plvlo;
        let plvl = pstate.plvl;
        let noise = pstate.pnoise;
        let growth = x_spawn.growth || 'growth.test';
        let growthNoisePct = x_spawn.growthNoisePct || 0;
        let growthNoisePeriod = x_spawn.growthNoisePeriod || 1;
        let growthFreePct = x_spawn.growthFreePct || 0;
        if (!growthNoisePct && !growthFreePct) return;
        // iterate indicies
        for (const idx of room.idxs) {
            // -- test index to make sure nothing is there..
            if (!this.checkSpawnIdx(plvl, idx)) continue;
            // -- check free spawn
            let spawn = Prng.flip(growthFreePct);
            if (!spawn) {
                // -- test for
                let i = plvlo.data.ifromidx(idx) + plvlo.data.cols;
                let j = plvlo.data.jfromidx(idx) + plvlo.data.rows;
                // -- sample is in range of -1 to 1
                // -- pct is in range of 0 to 1
                let sample = noise.sample(i*growthNoisePeriod,j*growthNoisePeriod);
                if (sample < (growthNoisePct*2)-1) spawn = true;
            }
            if (spawn) {
                let x_growth = Growth.xspec({
                    idx: idx,
                    z: template.fgZed,
                    x_sketch: Assets.get(growth),
                });
                //console.log(`growth: ${Fmt.ofmt(x_growth)}`);
                plvl.entities.push(x_growth);
            }
        }
    }

    static spawnGrowth(template, pstate) {
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        for (const proom of prooms) {
            this.spawnGrowthForRoom(template, pstate, proom);
        }
        // iterate through halls
        for (const phall of phalls) {
            this.spawnGrowthForRoom(template, pstate, phall);
        }
    }

    static spawnClutterForRoom(template, pstate, room) {
        let x_spawn = template.spawn || {};
        let plvlo = pstate.plvlo;
        let plvl = pstate.plvl;
        let clutter = x_spawn.clutter || 'clutter.test';
        let clutterFreePct = x_spawn.clutterFreePct || 0;
        if (!clutterFreePct) return;
        // iterate indicies
        for (const idx of room.idxs) {
            // -- test index to make sure nothing is there..
            // -- clutter can spawn under other items (except growth)
            if (!this.checkSpawnIdx(plvl, idx, (v) => (v.idx === idx && v.cls === 'Growth'))) continue;
            // -- count adjacent walls
            let walls = Direction.cardinals.reduce((pv, cv) => {
                let aidx = plvlo.data.idxfromdir(idx, cv);
                let kind = plvlo.data.getidx(aidx);
                if (kind === 'wall') return pv + 1
                return (kind === 'wall') ? pv + 1 : pv;
            }, 0);
            // -- check free spawn
            // -- only will spawn against walls
            let chance = clutterFreePct * walls;
            let spawn = Prng.flip(chance);
            if (spawn) {
                let x_growth = Clutter.xspec({
                    idx: idx,
                    z: template.bgoZed,
                    x_sketch: Assets.get(clutter),
                });
                //console.log(`growth: ${Fmt.ofmt(x_growth)}`);
                plvl.entities.push(x_growth);
            }
        }
    }

    static spawnClutter(template, pstate) {
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        for (const proom of prooms) {
            this.spawnClutterForRoom(template, pstate, proom);
        }
        // iterate through halls
        for (const phall of phalls) {
            this.spawnClutterForRoom(template, pstate, phall);
        }
    }

    static spawnStairs(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        let upTag = x_spawn.stairsUp || 'stairs_up';
        let downTag = x_spawn.stairsDown || 'stairs_down';
        // stairs down
        if (plvl.index > 1) {

            plvl.entities.push(Stairs.xspec({
                up: false,
                idx: plvl.startIdx,
                x_sketch: Assets.get(downTag),
                z: template.fgZed,
                blocks: 0,
            }));

        }

        plvl.entities.push(Stairs.xspec({
            up: true,
            idx: plvl.exitIdx,
            x_sketch: Assets.get(upTag),
            z: template.fgZed,
            blocks: 0,
        }));

    }

    static genWeapon(template, pstate) {
        // weapon template
        let tmpl = {
            kinds: Weapon.kinds,
            lvlOptions: [
                { weight: .1, delta: -1 },
                { weight: .3, delta: 0 },
                { weight: .2, delta: 1 },
                { weight: .2, delta: 2 },
                { weight: .1, delta: 3 },
                { weight: .1, delta: 4 },
                { weight: .1, delta: 5 },
            ],
            tierByLTier: {
                1: [
                    { weight: .7, tier: 1 },
                    { weight: .25, tier: 2 },
                    { weight: .05, tier: 3 },
                ],
                2: [
                    { weight: .1, tier: 1 },
                    { weight: .7, tier: 2 },
                    { weight: .2, tier: 3 },
                ],
                3: [
                    { weight: .1, tier: 1 },
                    { weight: .2, tier: 2 },
                    { weight: .7, tier: 3 },
                ],
            },
            spryPerTier: {
                1: { min: 8, max: 12},
                2: { min: 10, max: 14},
                3: { min: 13, max: 16},
            },
            damagePerTier: {
                1: { minRange: { min: 1, max: 3}, maxRange: {min: 4, max: 6}, scale: 1.5 },
                2: { minRange: { min: 2, max: 5}, maxRange: {min: 6, max: 12}, scale: 2 },
                3: { minRange: { min: 3, max: 7}, maxRange: {min: 8, max: 18}, scale: 2.5 },
            },
            spryReductionPerLvl: .25,
            charmPct: .5,
            cursePct: .25,
            charms: [ FieryCharm ],
            curses: [ BooCharm ],
            identifiableByTier: {
                1: .25,
                2: .5,
                3: .75,
            },
        };
        let lvlTier = (template.index < 7) ? 1 : (template.index < 14) ? 2 : 3;
        // -- kind
        let kind = Prng.choose(tmpl.kinds);
        // -- lvl
        let lvl = Math.max(1, lvlTier + Prng.chooseWeightedOption(tmpl.lvlOptions).delta);
        // -- tier
        let tier = Prng.chooseWeightedOption(tmpl.tierByLTier[lvlTier]).tier;
        // -- spry
        let spry = Prng.rangeInt(tmpl.spryPerTier[tier].min, tmpl.spryPerTier[tier].max);
        let spryReductionPerLvl = tmpl.spryReductionPerLvl;
        // -- damage
        let baseDamageMin = Prng.rangeInt(tmpl.damagePerTier[tier].minRange.min, tmpl.damagePerTier[tier].minRange.max);
        let baseDamageMax = Prng.rangeInt(tmpl.damagePerTier[tier].maxRange.min, tmpl.damagePerTier[tier].maxRange.max);
        let damageScale = tmpl.damagePerTier[tier].scale;
        // -- charms
        let charms = [];
        if (Prng.flip(tmpl.charmPct)) {
            // pick charm
            let cls = Prng.choose(tmpl.charms);
            charms.push( new cls() );
            // -- roll for curse
            if (Prng.flip(tmpl.cursePct)) {
                let cls = Prng.choose(tmpl.curses);
                // pick curse
                charms.push( new cls() );
            }
        }
        // -- identifiable
        let identifiablePct = tmpl.identifiableByTier[tier];
        if (charms.length) {
            identifiablePct += .2;
        }
        let identifiable = Prng.flip(identifiablePct);

        // build spec
        let x_wpn = Weapon.xspec({
            kind: kind,
            lvl: lvl,
            tier: tier,
            spry: spry,
            spryReductionPerLvl: spryReductionPerLvl,
            baseDamageMin: baseDamageMin,
            baseDamageMax: baseDamageMax,
            damageScale: damageScale,
            charms: charms,
            identifiable: identifiable,
        });

        return x_wpn;
    }

    static genReactor(template, pstate) {
        // reactor template
        let tmpl = {
            lvlOptions: [
                { weight: .1, delta: -1 },
                { weight: .3, delta: 0 },
                { weight: .2, delta: 1 },
                { weight: .2, delta: 2 },
                { weight: .1, delta: 3 },
                { weight: .1, delta: 4 },
                { weight: .1, delta: 5 },
            ],
            tierByLTier: {
                1: [
                    { weight: .7, tier: 1 },
                    { weight: .25, tier: 2 },
                    { weight: .05, tier: 3 },
                ],
                2: [
                    { weight: .1, tier: 1 },
                    { weight: .7, tier: 2 },
                    { weight: .2, tier: 3 },
                ],
                3: [
                    { weight: .1, tier: 1 },
                    { weight: .2, tier: 2 },
                    { weight: .7, tier: 3 },
                ],
            },
            fuelPerTier: {
                1: { min: .09, max: .15, scale: 0.9 },
                2: { min: .08, max: .12, scale: 0.8 },
                3: { min: .07, max: .11, scale: 0.7 },
            },
            powerPerTier: {
                1: { min: .07, max: .11, scale: 1.1 },
                2: { min: .08, max: .12, scale: 1.2 },
                3: { min: .09, max: .15, scale: 1.3 },
            },
            healthPerTier: {
                1: { min: .07, max: .11, scale: 1.1 },
                2: { min: .08, max: .12, scale: 1.2 },
                3: { min: .09, max: .15, scale: 1.3 },
            },
            charmPct: .5,
            cursePct: .25,
            charms: [ Charm ],
            curses: [ BooCharm ],
            identifiableByTier: {
                1: .25,
                2: .5,
                3: .75,
            },
        };
        let lvlTier = (template.index < 7) ? 1 : (template.index < 14) ? 2 : 3;
        // -- lvl
        let lvl = Math.max(1, lvlTier + Prng.chooseWeightedOption(tmpl.lvlOptions).delta);
        // -- tier
        let tier = Prng.chooseWeightedOption(tmpl.tierByLTier[lvlTier]).tier;
        // -- fuel per ap
        let fuelPerAP = Prng.range(tmpl.fuelPerTier[tier].min, tmpl.fuelPerTier[tier].max);
        let fuelScale = tmpl.fuelPerTier[tier].scale;
        // -- power per ap
        let powerPerAP = Prng.range(tmpl.powerPerTier[tier].min, tmpl.powerPerTier[tier].max);
        let powerScale = tmpl.powerPerTier[tier].scale;
        // -- health per ap
        let healthPerAP = Prng.range(tmpl.healthPerTier[tier].min, tmpl.healthPerTier[tier].max);
        let healthScale = tmpl.healthPerTier[tier].scale;
        // -- charms
        let charms = [];
        if (Prng.flip(tmpl.charmPct)) {
            // pick charm
            let cls = Prng.choose(tmpl.charms);
            charms.push( new cls() );
            // -- roll for curse
            if (Prng.flip(tmpl.cursePct)) {
                let cls = Prng.choose(tmpl.curses);
                // pick curse
                charms.push( new cls() );
            }
        }
        // -- identifiable
        let identifiablePct = tmpl.identifiableByTier[tier];
        if (charms.length) {
            identifiablePct += .2;
        }
        let identifiable = Prng.flip(identifiablePct);
        return Reactor.xspec({
            tier: tier,
            lvl: lvl,
            fuelPerAP: fuelPerAP,
            fuelScale: fuelScale,
            powerPerAP: powerPerAP,
            powerScale: powerScale,
            healthPerAP: healthPerAP,
            healthScale: healthScale,
            identifiable: identifiable,
            charms: charms,
        });
    }

    static genShielding(template, pstate) {
        // reactor template
        let tmpl = {
            lvlOptions: [
                { weight: .1, delta: -1 },
                { weight: .3, delta: 0 },
                { weight: .2, delta: 1 },
                { weight: .2, delta: 2 },
                { weight: .1, delta: 3 },
                { weight: .1, delta: 4 },
                { weight: .1, delta: 5 },
            ],
            brawnPerTier: {
                1: { min: 8, max: 12},
                2: { min: 10, max: 14},
                3: { min: 13, max: 16},
            },
            brawnReductionPerLvl: .25,
            tierByLTier: {
                1: [
                    { weight: .7, tier: 1 },
                    { weight: .25, tier: 2 },
                    { weight: .05, tier: 3 },
                ],
                2: [
                    { weight: .1, tier: 1 },
                    { weight: .7, tier: 2 },
                    { weight: .2, tier: 3 },
                ],
                3: [
                    { weight: .1, tier: 1 },
                    { weight: .2, tier: 2 },
                    { weight: .7, tier: 3 },
                ],
            },
            reductionPerTier: {
                1: { minRange: { min: 1, max: 3}, maxRange: {min: 4, max: 6}, scale: 1.1 },
                2: { minRange: { min: 2, max: 5}, maxRange: {min: 6, max: 12}, scale: 1.3 },
                3: { minRange: { min: 3, max: 7}, maxRange: {min: 8, max: 18}, scale: 1.5 },
            },
            charmPct: .5,
            cursePct: .25,
            charms: [ Charm ],
            curses: [ BooCharm ],
            identifiableByTier: {
                1: .25,
                2: .5,
                3: .75,
            },
        };
        let lvlTier = (template.index < 7) ? 1 : (template.index < 14) ? 2 : 3;
        // -- lvl
        let lvl = Math.max(1, lvlTier + Prng.chooseWeightedOption(tmpl.lvlOptions).delta);
        // -- tier
        let tier = Prng.chooseWeightedOption(tmpl.tierByLTier[lvlTier]).tier;
        // -- brawn
        let brawn = Prng.rangeInt(tmpl.brawnPerTier[tier].min, tmpl.brawnPerTier[tier].max);
        let brawnReductionPerLvl = tmpl.brawnReductionPerLvl;
        // -- reduction
        let reductionMin = Prng.rangeInt(tmpl.reductionPerTier[tier].minRange.min, tmpl.reductionPerTier[tier].minRange.max);
        let reductionMax = Prng.rangeInt(tmpl.reductionPerTier[tier].maxRange.min, tmpl.reductionPerTier[tier].maxRange.max);
        let reductionScale = tmpl.reductionPerTier[tier].scale;
        // -- charms
        let charms = [];
        if (Prng.flip(tmpl.charmPct)) {
            // pick charm
            let cls = Prng.choose(tmpl.charms);
            charms.push( new cls() );
            // -- roll for curse
            if (Prng.flip(tmpl.cursePct)) {
                let cls = Prng.choose(tmpl.curses);
                // pick curse
                charms.push( new cls() );
            }
        }
        // -- identifiable
        let identifiablePct = tmpl.identifiableByTier[tier];
        if (charms.length) {
            identifiablePct += .2;
        }
        let identifiable = Prng.flip(identifiablePct);
        return Shielding.xspec({
            tier: tier,
            lvl: lvl,
            brawn: brawn,
            brawnReductionPerLvl: brawnReductionPerLvl,
            damageReductionMin: reductionMin,
            damageReductionMax: reductionMax,
            damageReductionScale: reductionScale,
            identifiable: identifiable,
            charms: charms,
        });
    }

    static genGadget(template, pstate) {
        // template
        let tmpl = {
            tierByLTier: {
                1: [
                    { weight: .7, tier: 1 },
                    { weight: .25, tier: 2 },
                    { weight: .05, tier: 3 },
                ],
                2: [
                    { weight: .1, tier: 1 },
                    { weight: .7, tier: 2 },
                    { weight: .2, tier: 3 },
                ],
                3: [
                    { weight: .1, tier: 1 },
                    { weight: .2, tier: 2 },
                    { weight: .7, tier: 3 },
                ],
            },
            cursePct: .25,
            charmsByTier: {
                1: [ Charm ],
                2: [ Charm ],
                3: [ Charm ],
            },
            curses: [ BooCharm ],
            identifiableByTier: {
                1: .25,
                2: .5,
                3: .75,
            },
        };
        let charms = [];
        let lvlTier = (template.index < 7) ? 1 : (template.index < 14) ? 2 : 3;
        // -- tier
        let tier = Prng.chooseWeightedOption(tmpl.tierByLTier[lvlTier]).tier;
        // pick charm
        let cls = Prng.choose(tmpl.charmsByTier[tier]);
        charms.push( new cls() );
        // -- roll for curse
        if (Prng.flip(tmpl.cursePct)) {
            let cls = Prng.choose(tmpl.curses);
            // pick curse
            charms.push( new cls() );
        }
        // -- identifiable
        let identifiablePct = tmpl.identifiableByTier[tier];
        if (charms.length) {
            identifiablePct += .2;
        }
        let identifiable = Prng.flip(identifiablePct);
        return Gadget.xspec({
            tier: tier,
            identifiable: identifiable,
            charms: charms,
        });
    }

    static genTokens(template, pstate) {
        // -- level
        let lvl = template.index;
        // min tokens
        let minTokens = Math.round(Mathf.lerp(1, Config.maxLvl, 1, 80, lvl));
        let maxTokens = Math.round(Mathf.lerp(1, Config.maxLvl, 5, 120, lvl));
        // roll for tokens
        let tokens = Prng.rangeInt(minTokens, maxTokens);
        return Token.xspec({
            name: 'token',
            x_sketch: Assets.get('token'),
            count: tokens,
        });
    }

    static genGem(template, pstate) {
        // pick kind
        let kind = Prng.choose(Gem.kinds);
        return Gem.xspec({
            kind: kind,
        });
    }

    static genCog(template, pstate) {
        // pick kind
        let kind = Prng.choose(Cog.kinds);
        return Cog.xspec({
            kind: kind,
        });
    }

    static genLoot(template, pstate, options) {
        // -- pick loot option
        let option = Prng.chooseWeightedOption(options);
        let loot = [];
        // pick item class
        switch (option.kind) {
            case 'tokens': {
                loot.push(this.genTokens(template, pstate));
                break;
            }
            case 'weapon': {
                loot.push(this.genWeapon(template, pstate));
                break;
            }
            case 'reactor': {
                loot.push(this.genReactor(template, pstate));
                break;
            }
            case 'shielding': {
                loot.push(this.genShielding(template, pstate));
                break;
            }
            case 'gadget': {
                loot.push(this.genGadget(template, pstate));
                break;
            }
            case 'gem': {
                loot.push(this.genGem(template, pstate));
                break;
            }
            case 'cog': {
                loot.push(this.genCog(template, pstate));
                break;
            }
        }
        return loot;
    }

    static genEnemy(template, pstate) {
        let x_spawn = template.spawn || {};
        // pick enemy class
        let enemyClass = Prng.choose(x_spawn.enemyList);
        // -- level
        let lvl = template.index;
        let option = Prng.chooseWeightedOption(x_spawn.enemyLvlOptions);
        //console.log(`option: ${Fmt.ofmt(option)}`);
        lvl += option.delta;
        lvl = Mathf.clampInt(lvl, 1, Config.maxLvl);
        let x_enemy = enemyClass.xspec({
            lvl: lvl,
            healthMax: enemyClass.gHealth.calculate(lvl),
            xp: enemyClass.gXp.calculate(lvl),
            attackRating: enemyClass.gAttackRating.calculate(lvl),
            defenseRating: enemyClass.gDefenseRating.calculate(lvl),
            damageMin: enemyClass.gDamageMin.calculate(lvl),
            damageMax: enemyClass.gDamageMax.calculate(lvl),
            loot: this.genLoot(template, pstate, x_spawn.enemyLootOptions),
        });
        return x_enemy;
    }

    static spawnEnemiesForRoom(template, pstate, proom, options) {
        let plvl = pstate.plvl;
        // pick spawn options for room
        let option = Prng.chooseWeightedOption(options);
        //console.log(`option: ${Fmt.ofmt(option)} from: ${Fmt.ofmt(options)}`);
        let chance = option.hasOwnProperty('chance') ? option.chance : 1;
        let min = option.hasOwnProperty('min') ? option.min : 1;
        let max = option.hasOwnProperty('max') ? option.max : 1;
        // spawn check
        if (!Prng.flip(chance)) return;
        // spawn count
        let count = Prng.rangeInt(min, max);
        for (let i=0; i<count; i++) {
            // choose index
            let idx;
            for (let i=0; i<100; i++) {
                // -- randomly choose index from room
                idx = Prng.choose(proom.idxs);
                // -- test index to make sure nothing is there..
                if (!this.checkSpawnIdx(plvl, idx)) continue;
                // choose class
                let x_enemy = Object.assign(this.genEnemy(template, pstate), {
                    idx: idx,
                    z: template.fgZed,
                });
                //console.log(`enemy: ${Fmt.ofmt(x_enemy)}`);
                plvl.entities.push(x_enemy);
                break;
            }
        }
    }

    static spawnEnemies(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        //let plvlo = pstate.plvlo;
        let prooms = pstate.prooms || [];
        let phalls = pstate.phalls || [];
        if (x_spawn.enemyList.length === 0) return;

        // iterate through rooms
        for (const proom of prooms) {
            this.spawnEnemiesForRoom(template, pstate, proom, x_spawn.enemyRoomOptions);
        }
        // iterate through rooms
        for (const proom of phalls) {
            this.spawnEnemiesForRoom(template, pstate, proom, x_spawn.enemyHallOptions);
        }

    }

    static spawnTest(template, pstate) {
        let plvl = pstate.plvl;
        let prooms = pstate.prooms || [];
        // what is the starting room?
        let sroom;
        for (const proom of prooms) {
            if (proom.cidx === plvl.startIdx) {
                sroom = proom;
                break;
            }
        }
        if (!sroom) return;
        // iterate items to spawn
        let x_spawns = [
            Weapon.xspec({
                kind: 'poke',
                name: 'poke.1',
                x_sketch: Assets.get('poke.1'),
                identifiable: true,
            }),
            Gem.xspec({
                name: 'health.gem',
                kind: 'health',
            }),
            Cog.xspec({
                name: 'test.cog',
                kind: 'test',
            }),
            Cog.xspec({
                name: 'identify.cog',
                kind: 'identify',
            }),
            Cog.xspec({
                name: 'identify.cog',
                kind: 'identify',
            }),
            Cog.xspec({
                kind: 'brawn',
            }),
            Cog.xspec({
                kind: 'spry',
            }),
            Cog.xspec({
                kind: 'savvy',
            }),

            Chest.xspec({
                name: 'chest.brown',
                x_sketch: Assets.get('chest.brown'),
                loot: [
                    Token.xspec({
                        name: 'token',
                        x_sketch: Assets.get('token'),
                        count: 5,
                    }),
                ],
            }),

            Chest.xspec({
                name: 'chest.blue',
                kind: 'blue',
                loot: [
                    Token.xspec({
                        name: 'token',
                        x_sketch: Assets.get('token'),
                        count: 5,
                    }),
                ],
            }),

            Key.xspec({
                kind: 'blue',
            }),

            Fuelcell.xspec({
                name: 'fuelcell',
                x_sketch: Assets.get('fuelcell'),
            }),

            Token.xspec({
                name: 'token',
                x_sketch: Assets.get('token'),
                count: 8,
            }),

            //Rous.xspec({}),

            this.genWeapon(template, pstate),
            this.genReactor(template, pstate),
            this.genShielding(template, pstate),
            this.genGadget(template, pstate),

            RangedWeapon.xspec({
                name: 'ice.gun.3',
                x_sketch: Assets.get('ice.gun.3'),
                baseDamageMin: 15,
                baseDamageMax: 20,
                projectileSpec: Projectile.xspec({x_sketch: Assets.get('projectile.ice')}),
            }),


        ];
        for (const x_spawn of x_spawns) {
            for (let i=0; i<100; i++) {
                // -- randomly choose index from room
                let idx = Prng.choose(sroom.idxs);
                // -- test index to make sure nothing is there..
                if (idx === plvl.startIdx) continue;
                // -- not at a floor tile
                if (plvl.entities.some((v) => v.idx === idx && v.cls === 'Tile' && v.kind !== 'floor')) continue;
                // -- anything else at index
                if (plvl.entities.some((v) => v.idx === idx && v.cls !== 'Tile')) continue;
                // success -- add spawn
                let x_final = Object.assign({}, x_spawn, {
                    idx: idx,
                    z: template.fgZed,
                });
                //console.log(`x_final: ${Fmt.ofmt(x_final)}`);
                plvl.entities.push(x_final);
                break;
            }
        }

    }

}