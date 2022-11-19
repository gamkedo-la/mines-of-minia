export { Spawn };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { Generator } from '../base/generator.js';
import { Mathf } from '../base/math.js';
import { Prng } from '../base/prng.js';
import { Util } from '../base/util.js';
import { XForm } from '../base/xform.js';
import { BooCharm } from '../charms/boo.js';
import { Charm } from '../charms/charm.js';
import { FieryCharm } from '../charms/fiery.js';
import { Bomb } from '../entities/bomb.js';
import { Chest } from '../entities/chest.js';
import { Clutter } from '../entities/clutter.js';
import { Cog } from '../entities/cog.js';
import { Digger } from '../entities/digger.js';
import { Door } from '../entities/door.js';
import { Enemy } from '../entities/enemy.js';
import { Energy } from '../entities/energy.js';
import { Facade } from '../entities/facade.js';
import { Fuelcell } from '../entities/fuelcell.js';
import { Funguy } from '../entities/funguy.js';
import { Gadget } from '../entities/gadget.js';
import { Gem } from '../entities/gem.js';
import { Growth } from '../entities/growth.js';
import { Key } from '../entities/key.js';
import { Machinery } from '../entities/machinery.js';
import { Magma } from '../entities/magma.js';
import { Node } from '../entities/node.js';
import { Overbearer } from '../entities/overbearer.js';
import { Pillar } from '../entities/pillar.js';
import { Player } from '../entities/player.js';
import { Projectile } from '../entities/projectile.js';
import { RagingBull } from '../entities/ragingBull.js';
import { RangedWeapon } from '../entities/rangedWeapon.js';
import { Reactor } from '../entities/reactor.js';
import { Rous } from '../entities/rous.js';
import { Scarab } from '../entities/scarab.js';
import { Shielding } from '../entities/shielding.js';
import { Slimer } from '../entities/slimer.js';
import { Stairs } from '../entities/stairs.js';
import { StealthBot } from '../entities/stealthBot.js';
import { ThumpBot } from '../entities/thumpBot.js';
import { Tile } from '../entities/tile.js';
import { Token } from '../entities/token.js';
import { Vendor } from '../entities/vendor.js';
import { Weapon } from '../entities/weapon.js';
import { InventoryData } from '../inventory.js';
import { Names } from './names.js';
import { ProcTemplate } from './ptemplate.js';

class Spawn {

    static *generator(template={}, pstate={}) {
        // -- doors
        this.spawnDoors(template, pstate);
        // -- stairs
        this.spawnStairs(template, pstate);
        // -- chests
        this.spawnChests(template, pstate);
        // -- hide rooms/caches
        this.hideRooms(template, pstate);
        this.hideCaches(template, pstate);
        // -- lock and key
        this.spawnLockAndKeys(template, pstate);
        // -- enemies
        this.spawnEnemies(template, pstate);
        // -- traps
        this.spawnTraps(template, pstate);
        // -- growth
        this.spawnGrowth(template, pstate);
        // -- machinery
        this.spawnMachinery(template, pstate);
        // -- clutter
        this.spawnClutter(template, pstate);
        // -- fuel
        this.spawnFuel(template, pstate);
        // -- rocks
        if (template.boss === 'bio') {
            this.spawnRocks(template, pstate);
        }
        // -- spawn vendor
        this.spawnVendor(template, pstate);
        // -- test objects
        this.spawnTest(template, pstate);
        yield;
    }

    static spawnDoors(template, pstate) {
        // -- pull data
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        let plvlo = pstate.plvlo;
        // iterate through halls
        let phalls = pstate.phalls || [];
        for (const phall of phalls) {
            for (const idx of phall.exits) {
                // determine which way the door is facing
                let facing = 'ew';
                if ( [Direction.north, Direction.south].some((dir) => {
                    let oidx = plvlo.data.idxfromdir(idx, dir);
                    if (plvl.entities.some((v) => v.idx === oidx && v.kind === 'floor')) return true;
                    return false;
                })) {
                    facing = 'ns';
                }
                // is this a boss door?
                let otherRoom = phall.exitMap[idx];
                let bossDoor = otherRoom && otherRoom.boss;
                let x_door = Door.xspec({
                    idx: idx,
                    boss: bossDoor,
                    facing: facing,
                    z: template.fgZed,
                    //blocks: 0,
                });
                plvl.entities.push(x_door);
            }
        }
        // final door
        if (plvl.finalDoorIdx) {
            let x_door = Door.xspec({
                idx: plvl.finalDoorIdx,
                facing: plvl.finalDoorFacing,
                kind: 'blue',
                z: template.fgZed,
            });
            plvl.entities.push(x_door);
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
            // do not spawn traps in boss room
            if (proom.boss) continue;
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
                // roll for loot
                let loot = [];
                if (Prng.flip(x_spawn.growthLootPct)) {
                    loot = this.genLoot(template, pstate, x_spawn.growthLootOptions);
                }
                let x_growth = Growth.xspec({
                    idx: idx,
                    loot: loot,
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
            // do not spawn growth in boss room
            if (proom.boss) continue;
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
        let clutter = (room.critical) ? 'punk.clutter' : x_spawn.clutter || 'clutter.test';
        let clutterFreePct = x_spawn.clutterFreePct || 0;
        if (!clutterFreePct) return;
        // iterate indicies
        for (const idx of room.idxs) {
            // -- test index to make sure nothing is there..
            // -- clutter can spawn under other items (except growth)
            if (!this.checkSpawnIdx(plvl, idx, (v) => (v.idx === idx && (v.cls in ['Growth', 'SpikeTrap'])))) continue;
            // -- count adjacent walls
            let walls = Direction.cardinals.reduce((pv, cv) => {
                let aidx = plvlo.data.idxfromdir(idx, cv);
                let kind = plvlo.data.getidx(aidx);
                if (kind === 'wall') return pv + 1
                return (kind === 'wall') ? pv + 1 : pv;
            }, 0);
            // -- check for spawn
            let chance = (walls) ? walls*4*clutterFreePct : clutterFreePct;
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

    static spawnFuel(template, pstate) {
        let prooms = pstate.prooms || [];
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        let quota = Prng.rangeInt(x_spawn.fuelMin, x_spawn.fuelMax);
        let iterations = 100;
        let choices = Array.from(prooms);
        while (iterations-- > 0 && quota > 0) {
            // pick candidate room
            let proom = Prng.choose(choices);
            let idx = this.chooseSpawnIdx(plvl, proom.idxs);
            if (idx !== -1) {
                let x_spawn = Fuelcell.xspec({
                    name: 'fuelcell',
                    idx: idx,
                    z: template.fgZed,
                    x_sketch: Assets.get('fuelcell'),
                });
                plvl.entities.push(x_spawn);
                quota--;
            }
        }
    }

    static spawnRocks(template, pstate) {
        let prooms = pstate.prooms || [];
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        for (const proom of prooms) {
            // pick candidate room
            let idx = this.chooseSpawnIdx(plvl, proom.idxs);
            if (idx !== -1) {
                let x_spawn = Projectile.xspec({
                    name: 'smooth rock',
                    description: 'a nicely weighted rock that fits snuggly in your activator',
                    idx: idx,
                    z: template.fgZed,
                    x_sketch: Assets.get('rock'),
                });
                plvl.entities.push(x_spawn);
            }
        }
    }

    static spawnMachinery(template, pstate) {
        let x_spawn = template.spawn || {};
        let prooms = pstate.prooms || [];
        let plvl = pstate.plvl;
        let plvlo = pstate.plvlo;
        if (!x_spawn.machineTags.length) return;
        for (const proom of prooms) {
            // don't spawn machines in boss room
            if (proom.boss) continue;
            // roll for machinery within room
            if (!Prng.flip(x_spawn.machineRoomPct)) continue;

            // try to place machinery next to wall
            let cidxs = [];
            for (const eidx of proom.edges) {
                for (const dir of Direction.cardinals) {
                    let oidx = plvlo.data.idxfromdir(eidx, dir);
                    //console.log(`oidx: ${oidx}`);
                    if (!proom.idxs.includes(oidx)) continue;
                    if (!plvl.entities.some((v) => v.idx === oidx && v.kind === 'floor')) continue;
                    if (proom.viablePath.includes(oidx)) continue;
                    if (!this.checkSpawnIdx(plvl, oidx)) continue;
                    cidxs.push(oidx);
                }
            }
            // pick from candidate indices
            if (!cidxs.length) return;
            // pick machine asset
            let machineTag = Prng.choose(x_spawn.machineTags);
            let cidx = Prng.choose(cidxs);
            let x_machine = Machinery.xspec({
                idx: cidx,
                z: template.fgZed,
                x_sketch: Assets.get(machineTag),
            });
            //console.log(`machine: ${Fmt.ofmt(x_machine)}`);
            plvl.entities.push(x_machine);
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

    static spawnChests(template, pstate) {
        let prooms = pstate.prooms || [];
        let plvl = pstate.plvl;
        let x_spawn = template.spawn || {};
        let quota = Prng.rangeInt(x_spawn.chestMin, x_spawn.chestMax);

        // chests will not appear along critical path (stair to stair)
        let choices = prooms.filter((v) => !v.critical);
        let iterations = 500;

        while (iterations-- > 0 && quota > 0) {
            // pick candidate room
            let proom = Prng.choose(choices);

            // chests have higher chance if room is terminal
            let spawn = false;
            if (proom.connections.length === 1) {
                // roll for chest
                if (Prng.flip(x_spawn.chestTermRoomPct)) {
                    spawn = true;
                }
            } else {
                // roll for chest
                if (Prng.flip(x_spawn.chestRoomPct)) {
                    spawn = true;
                }
            }

            if (spawn) {
                // choose index
                let idx;
                for (let i=0; i<100; i++) {
                    // -- randomly choose index from room
                    idx = Prng.choose(proom.idxs);
                    // -- test index to make sure nothing is there..
                    if (!this.checkSpawnIdx(plvl, idx)) continue;
                    break;
                }
                // spawn
                if (idx !== undefined) {
                    quota--;
                    //console.log(`spawn chest in proom: ${proom} idx: ${idx}`);
                    plvl.entities.push(Chest.xspec({
                        idx: idx,
                        z: template.fgZed,
                        loot: this.genLoot(template, pstate, x_spawn.chestLootOptions),
                    }));
                }

            }

        }
    }

    static hideRoom(template, pstate, proom) {
        let plvl = pstate.plvl;
        proom.hidden = true;
        for (const [idx,hall] of Object.entries(proom.exitMap)) {
            // find outer doorway of hall leading to room
            for (let didx of Object.keys(hall.exitMap)) {
                didx = parseInt(didx);
                if (hall.exitMap[didx] !== proom) {
                    let door = plvl.entities.find((v) => v.idx === didx && v.cls === 'Door');
                    //console.log(`  door: ${Fmt.ofmt(door)}`);
                    if (door) {
                        door.hidden = true;

                        // create facade at same index
                        let x_facade = Facade.xspec({
                            kind: 'wall',
                            tileSize: template.tileSize,
                            baseAssetTag: template.translate.wall,
                            z: template.fgZed,
                            idx: didx,
                        });
                        plvl.entities.push(x_facade);

                    }
                }
            }
        }
    }

    static hideRooms(template, pstate) {
        let x_spawn = template.spawn || {};
        let prooms = pstate.prooms || [];
        let quota = Prng.rangeInt(x_spawn.secretRoomMin, x_spawn.secretRoomMax);
        // find any terminal rooms
        for (const proom of prooms) {
            if (quota <= 0) break;
            // skip room if critical
            if (proom.critical) continue;
            if (Object.keys(proom.exitMap).length === 1) {
                // roll for secret
                if (Prng.flip(x_spawn.secretTermRoomPct)) {
                    // make room hidden
                    this.hideRoom(template, pstate, proom);
                    quota--;
                }
            }
        }

        // find any other non-critical room
        for (const proom of prooms) {
            if (quota <= 0) break;
            // skip room if critical
            if (proom.critical) continue;
            if (proom.secret) continue;
                // roll for secret
            if (Prng.flip(x_spawn.secretRoomPct)) {
                // make room hidden
                this.hideRoom(template, pstate, proom);
                quota--;
            }
        }

    }

    static hideCaches(template, pstate) {
        let x_spawn = template.spawn || {};
        let plvl = pstate.plvl;
        let plvlo = pstate.plvlo;
        let prooms = pstate.prooms || [];
        let quota = Prng.rangeInt(x_spawn.secretCacheMin, x_spawn.secretCacheMax);
        for (let i=0; i<quota; i++) {
            // pick target room
            let proom = Prng.choose(prooms);
            // find target wall space
            for (let i=0; i<100; i++) {
                let widx = Prng.choose(proom.edges);
                // -- step 1: validate wall is at wall index
                if (!plvl.entities.some((v) => v.idx === widx && v.kind === 'wall')) {
                    //console.log(`no wall @ ${widx} ... skipping`);
                    continue;
                }
                // -- step 2: floor must be in a cardinal direction from wall
                let floorDir;
                for (const dir of Direction.cardinals) {
                    let oidx = plvlo.data.idxfromdir(widx, dir);
                    if (plvl.entities.some((v) => v.idx === oidx && v.kind === 'floor')) {
                        floorDir = dir;
                    }
                }
                if (!floorDir) {
                    //console.log(`no adjacent floor @ ${widx} ... skipping`);
                    continue;
                }
                // -- step 3: opposite from floor must be empty or wall
                let oppOk = true;
                for (const dir of [Direction.opposite(floorDir), ...Direction.adjacent(Direction.opposite(floorDir))]) {
                    let oidx = plvlo.data.idxfromdir(widx, dir);
                    if (plvl.entities.some((v) => v.idx === oidx && v.kind !== 'wall')) {
                        oppOk = false;
                        //console.log(`opposite @ ${oidx} is present and not a wall ... skipping`);
                    }
                }
                // -- step 4: replace the wall with floor tile
                let tile = plvl.entities.find((v) => v.idx === widx && v.kind === 'wall');
                tile.kind = 'floor';
                tile.baseAssetTag = template.translate.floor;
                tile.z = template.bgZed;
                // -- step 5: fill opposite wall
                for (const dir of [Direction.opposite(floorDir), ...Direction.adjacent(Direction.opposite(floorDir))]) {
                    let oidx = plvlo.data.idxfromdir(widx, dir);
                    if (!plvl.entities.some((v) => v.idx === oidx && v.kind === 'wall')) {
                        plvl.entities.push(Tile.xspec({
                            kind: 'wall',
                            tileSize: template.tileSize,
                            baseAssetTag: template.translate.wall,
                            idx: oidx,
                            z: template.fgZed,
                        }));
                    }
                }
                // -- step 6: add cache chest
                plvl.entities.push(Chest.xspec({
                    idx: widx,
                    z: template.fgZed,
                    hidden: true,
                    loot: this.genLoot(template, pstate, x_spawn.chestLootOptions),
                }));
                // step 7: create facade at same index
                let x_facade = Facade.xspec({
                    kind: 'wall',
                    tileSize: template.tileSize,
                    baseAssetTag: template.translate.wall,
                    z: template.fgZed,
                    idx: widx,
                });
                plvl.entities.push(x_facade);
                break;
            }
        }
    }

    static chooseSpawnIdx(plvl, idxs, tries=100) {
        let choices = Array.from(idxs);
        for (let i=0; i<tries; i++) {
            // -- randomly choose index from room
            let idx = Prng.choose(choices);
            // -- test index to make sure nothing is there..
            if (!this.checkSpawnIdx(plvl, idx)) {
                let i = choices.indexOf(idx);
                choices.splice(i, 1);
                continue;
            }
            return idx;
        }
        return -1;
    }

    static lockRoom(template, pstate, proom, key) {
        let plvl = pstate.plvl;
        // lock the doors leading to room
        let locks = [];
        let keys = [];
        let ok = true;
        for (const idx of proom.exits) {
            let door = plvl.entities.find((v) => v.idx === idx && v.cls === 'Door');
            if (door) {
                door.kind = key;
                door.x_sketch = Assets.get(`door.${door.facing}.${key}`);
                door.locked = true;
                //console.log(`found door to lock: ${Fmt.ofmt(door)}`)
                locks.push(door);
            }
        }
        // distribute keys within the room (<number of exits>-1)
        // -- a key will be required to enter the room... distribute keys so the rest of the doors to the room can also be unlocked
        for (let i=0; i<proom.exits.length-1; i++) {
            // -- randomly choose index from room
            let idx = this.chooseSpawnIdx(plvl, proom.idxs);
            if (idx !== -1) {
                let x_key = Key.xspec({
                    kind: key,
                    idx: idx,
                    z: template.fgZed,
                });
                keys.push(x_key);
                //console.log(`key to spawn: ${Fmt.ofmt(x_key)}`);
            } else {
                ok = false;
            }
        }
        // finish up
        if (!ok) {
            for (const lock of locks) {
                lock.kind = 'brown';
                lock.x_sketch = Assets.get(`door.${lock.facing}.brown`);
                lock.locked = false;
            }
        } else {
            plvl.entities.push(...keys);
            proom.locked = true;
        }
        return ok;
    }

    static spawnLockAndKeys(template, pstate) {
        let prooms = pstate.prooms || [];
        let plvl = pstate.plvl;
        let x_spawn = template.spawn || {};
        let keys = [];
        // -- determine locked room quota
        let quota = Prng.rangeInt(x_spawn.lockRoomMin, x_spawn.lockRoomMax);
        //console.log(`lock room quota: ${quota}`);
        // -- filter candidate rooms
        let lrooms = prooms.filter((v) => !v.critical && !v.hidden);
        // lock rooms
        for (let i=0; i<quota; i++) {
            let proom = Prng.choose(lrooms);
            let j = lrooms.indexOf(proom);
            lrooms.splice(j, 1);
            let key = Prng.choose(Key.kinds);
            // try to lock room... ensure success
            if (this.lockRoom(template, pstate, proom, key)) {
                keys.push(key);
            }
        }
        // lock chests
        // -- iterate through chests... 
        for (const chest of plvl.entities.filter((v) => v.cls === 'Chest')) {
            // -- roll for lock
            if (Prng.flip(x_spawn.lockChestPct)) {
                let key = Prng.choose(Key.kinds);
                chest.kind = key;
                chest.x_sketch = Assets.get(`chest.${key}`);
                chest.locked = true;
                keys.push(key);
            }
        }
        // distribute keys along the critical path ... this ensures keys to enter rooms are accessible
        // -- find critical rooms
        let crooms = prooms.filter((v) => v.critical);
        for (const key of keys) {
            // pick room
            for (let i=0; i<5; i++) {
                let proom = Prng.choose(crooms);
                let idx = this.chooseSpawnIdx(plvl, proom.idxs);
                if (idx !== -1) {
                    let x_key = Key.xspec({
                        kind: key,
                        idx: idx,
                        z: template.fgZed,
                    });
                    //console.log(`spawn crit key: ${Fmt.ofmt(x_key)}`);
                    plvl.entities.push(x_key);
                    break;
                }
            }
        }
    }

    static genWeapon(template, overrides={}) {
        // weapon template
        let tmpl = Object.assign({
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
        }, overrides);
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
        }
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
        // -- cost
        let cost = (tier === 3) ? 400 : (tier === 2) ? 200 : 100;
        cost += lvl*25;
        cost += charms.reduce((pv, cv) => (!cv.curse) ? pv + 1 : pv, 0) * 100;
        // -- name
        let name = Prng.choose(Names[kind]);
        // build spec
        let x_wpn = Weapon.xspec({
            name: name,
            cost: cost,
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

    static genRanged(template, overrides={}) {
        // weapon template
        let tmpl = Object.assign({
            kinds: RangedWeapon.kinds,
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
            savvyPerTier: {
                1: { min: 8, max: 12},
                2: { min: 10, max: 14},
                3: { min: 13, max: 16},
            },
            damagePerTier: {
                1: { minRange: { min: 1, max: 3}, maxRange: {min: 4, max: 6}, scale: 1.5 },
                2: { minRange: { min: 2, max: 5}, maxRange: {min: 6, max: 12}, scale: 2 },
                3: { minRange: { min: 3, max: 7}, maxRange: {min: 8, max: 18}, scale: 2.5 },
            },
            savvyReductionPerLvl: .25,
            charmPct: .5,
            cursePct: .25,
            charms: [ FieryCharm ],
            curses: [ BooCharm ],
            identifiableByTier: {
                1: .25,
                2: .5,
                3: .75,
            },
        }, overrides);
        let lvlTier = (template.index < 7) ? 1 : (template.index < 14) ? 2 : 3;
        // -- kind
        let kind = Prng.choose(tmpl.kinds);
        // -- lvl
        let lvl = Math.max(1, lvlTier + Prng.chooseWeightedOption(tmpl.lvlOptions).delta);
        // -- tier
        let tier = Prng.chooseWeightedOption(tmpl.tierByLTier[lvlTier]).tier;
        // -- savvy
        let savvy = Prng.rangeInt(tmpl.savvyPerTier[tier].min, tmpl.savvyPerTier[tier].max);
        let savvyReductionPerLvl = tmpl.savvyReductionPerLvl;
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
        }
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
        // -- cost
        let cost = (tier === 3) ? 600 : (tier === 2) ? 300 : 150;
        cost += lvl*25;
        cost += charms.reduce((pv, cv) => (!cv.curse) ? pv + 1 : pv, 0) * 100;
        // -- name
        let name = Prng.choose(Names[kind]);
        // build spec
        let x_wpn = RangedWeapon.xspec({
            name: name,
            cost: cost,
            kind: kind,
            lvl: lvl,
            tier: tier,
            savvy: savvy,
            savvyReductionPerLvl: savvyReductionPerLvl,
            baseDamageMin: baseDamageMin,
            baseDamageMax: baseDamageMax,
            damageScale: damageScale,
            charms: charms,
            identifiable: identifiable,
        });
        return x_wpn;
    }

    static genReactor(template, overrides={}) {
        // reactor template
        let tmpl = Object.assign({
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
                1: { min: .01, max: .015, scale: 0.9 },
                2: { min: .006, max: .0095, scale: 0.8 },
                3: { min: .002, max: .0055, scale: 0.7 },
            },
            powerPerTier: {
                1: { min: .007, max: .011, scale: 1.1 },
                2: { min: .008, max: .012, scale: 1.2 },
                3: { min: .009, max: .015, scale: 1.3 },
            },
            healthPerTier: {
                1: { min: .007, max: .011, scale: 1.1 },
                2: { min: .008, max: .012, scale: 1.2 },
                3: { min: .009, max: .015, scale: 1.3 },
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
        }, overrides);
        let lvlTier = (template.index < 7) ? 1 : (template.index < 14) ? 2 : 3;
        // -- name
        let name = Prng.choose(Names.reactor);
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
        }
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
        // -- cost
        let cost = (tier === 3) ? 300 : (tier === 2) ? 150 : 75;
        cost += lvl*25;
        cost += charms.reduce((pv, cv) => (!cv.curse) ? pv + 1 : pv, 0) * 100;
        return Reactor.xspec({
            name: name,
            cost: cost,
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
        // -- name
        let name = Prng.choose(Names.shield);
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
        // -- cost
        let cost = (tier === 3) ? 300 : (tier === 2) ? 150 : 75;
        cost += lvl*25;
        cost += charms.reduce((pv, cv) => (!cv.curse) ? pv + 1 : pv, 0) * 100;
        return Shielding.xspec({
            name: name,
            cost: cost,
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
        // -- name
        let name = Prng.choose(Names.gadget);
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
        // -- cost
        let cost = (tier === 3) ? 300 : (tier === 2) ? 150 : 75;
        cost += charms.reduce((pv, cv) => (!cv.curse) ? pv + 1 : pv, 0) * 100;
        return Gadget.xspec({
            name: name,
            cost: cost,
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

    static genNode(template, pstate) {
        // pick kind
        let kind = Prng.choose(Node.kinds);
        return Node.xspec({
            kind: kind,
        });
    }

    static genFuel(template, pstate) {
        let x_spawn = Fuelcell.xspec({
            name: 'fuelcell',
            z: template.fgZed,
            x_sketch: Assets.get('fuelcell'),
        });
        return x_spawn;
    }

    static genLoot(template, pstate, options) {
        // -- pick loot option
        let option = Prng.chooseWeightedOption(options);
        let loot = [];
        // pick item class
        switch (option.kind) {
            case 'node': {
                loot.push(this.genNode(template, pstate));
                break;
            }
            case 'tokens': {
                loot.push(this.genTokens(template, pstate));
                break;
            }
            case 'weapon': {
                loot.push(this.genWeapon(template));
                break;
            }
            case 'ranged': {
                loot.push(this.genRanged(template));
                break;
            }
            case 'reactor': {
                loot.push(this.genReactor(template));
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
            case 'fuel': {
                loot.push(this.genFuel(template, pstate));
                break;
            }
        }
        return loot;
    }

    static genEnemy(template, pstate) {
        let x_spawn = template.spawn || {};
        // pick enemy class
        let enemyOption = Prng.chooseWeightedOption(x_spawn.enemyList, true);
        let enemyClass = enemyOption.cls;
        // -- level
        let lvl = template.index;
        let option = Prng.chooseWeightedOption(x_spawn.enemyLvlOptions);
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

    static spawnEnemiesForRockBossRoom(template, pstate, proom, options) {
        let plvl = pstate.plvl;
        let plvlo = pstate.plvlo;
        let ci = plvlo.data.ifromidx(proom.cidx);
        let cj = plvlo.data.jfromidx(proom.cidx);
        // overbearer gets spawned in the middle of the room
        let x_enemy = Overbearer.xspec({
            name: 'bob',
            tag: 'boss.overbearer',
            healthMax: 50,
            activateOnLoad: true,
            idx: proom.cidx,
            z: template.fgZed,
        });

        plvl.entities.push( x_enemy );

        // thumper gets spawned at bottom of the room
        let thumpidx = plvlo.data.idxfromij(ci, cj+5);
        x_enemy = ThumpBot.xspec({
            name: 'thumper',
            tag: 'boss.thump',
            healthMax: 1,
            activateOnLoad: false,
            idx: thumpidx,
            z: template.fgZed,
        });
        plvl.entities.push( x_enemy );

        // stealth gets spawned in northwest
        let stealthidx = plvlo.data.idxfromij(ci-5, cj-5);
        x_enemy = StealthBot.xspec({
            name: 'sneaky',
            tag: 'boss.stealth',
            healthMax: 1,
            activateOnLoad: false,
            idx: stealthidx,
            z: template.fgZed,
        });
        plvl.entities.push( x_enemy );

        // bull gets spawned in northwest
        let bullidx = plvlo.data.idxfromij(ci+5, cj-5);
        x_enemy = RagingBull.xspec({
            name: 'rager',
            tag: 'boss.bull',
            healthMax: 1,
            activateOnLoad: false,
            idx: bullidx,
            z: template.fgZed,
        });
        plvl.entities.push( x_enemy );

    }

    static spawnEnemiesForBioBossRoom(template, pstate, proom, options) {
        let plvl = pstate.plvl;
        let plvlo = pstate.plvlo;
        let ci = plvlo.data.ifromidx(proom.cidx);
        let cj = plvlo.data.jfromidx(proom.cidx);

        // pillar 1
        plvl.entities.push( Pillar.xspec({
            tag: 'pillar.1',
            kind: 'fire',
            x_sketch: Assets.get('pillar.fire'),
            idx: plvlo.data.idxfromij(ci-3, cj-3),
            z: template.fgZed,
        }));

        // pillar 2
        plvl.entities.push( Pillar.xspec({
            tag: 'pillar.2',
            kind: 'ice',
            x_sketch: Assets.get('pillar.ice'),
            idx: plvlo.data.idxfromij(ci+3, cj-3),
            z: template.fgZed,
        }));

        // pillar 3
        plvl.entities.push( Pillar.xspec({
            tag: 'pillar.3',
            kind: 'poison',
            x_sketch: Assets.get('pillar.poison'),
            idx: plvlo.data.idxfromij(ci-3, cj+3),
            z: template.fgZed,
        }));

        // pillar 4
        plvl.entities.push( Pillar.xspec({
            tag: 'pillar.4',
            kind: 'dark',
            x_sketch: Assets.get('pillar.dark'),
            idx: plvlo.data.idxfromij(ci+3, cj+3),
            z: template.fgZed,
        }));

        plvl.entities.push( Slimer.xspec({
            healthMax: 20,
            tag: 'slimer.boss',
            idx: proom.cidx,
            z: template.fgZed,
            loot: [
                Key.xspec({
                    kind: 'blue',
                    z: template.fgZed,
                }),
            ],
        }));

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
            if (proom.boss === 'rock') {
                this.spawnEnemiesForRockBossRoom(template, pstate, proom, x_spawn.enemyRoomOptions);
            } else if (proom.boss === 'bio') {
                this.spawnEnemiesForBioBossRoom(template, pstate, proom, x_spawn.enemyRoomOptions);
            } else if (!template.boss) {
                if (proom.cidx !== plvl.startIdx) {
                    this.spawnEnemiesForRoom(template, pstate, proom, x_spawn.enemyRoomOptions);
                }
            }
        }
        // iterate through rooms
        if (!template.boss) {
            for (const proom of phalls) {
                this.spawnEnemiesForRoom(template, pstate, proom, x_spawn.enemyHallOptions);
            }
        }

    }

    static spawnVendor(template, pstate) {
        let plvl = pstate.plvl;
        let prooms = pstate.prooms || [];
        let x_spawn = template.spawn || {};
        let flip = Prng.flip(x_spawn.vendorSpawnPct);
        if (!flip) return;
        // pick starting room (off of critical path)
        let choices = prooms.filter((v) => !v.critical);
        let sroom = Prng.choose(choices);
        let idx = this.chooseSpawnIdx(plvl, sroom.idxs)
        // iterate items to spawn
        let x_vendor = Vendor.xspec({ 
            idx: idx,
            z: template.fgZed,
            name: 'bigsby', 
            tag: 'bigsby',
        });
        plvl.entities.push(x_vendor);
        // fill vendor loots
        let loots = [];
        let quota = Prng.rangeInt(x_spawn.vendorLootMin, x_spawn.vendorLootMax);
        for (let i=0; i<quota; i++) {
            let loot = this.genLoot(template, pstate, x_spawn.vendorLootOptions);
            loots.push( ...loot );
        }
        x_vendor.x_inventory = { 
            cls: 'InventoryData',
            x_slots: loots,
        };
    }

    static spawnTest(template, pstate) {
        let plvl = pstate.plvl;
        let prooms = pstate.prooms || [];
        let testIdx = (plvl.testIdx) ? plvl.testIdx : plvl.startIdx;
        // what is the starting room?
        let sroom;
        for (const proom of prooms) {
            if (proom.cidx === testIdx) {
                sroom = proom;
                break;
            }
        }
        if (!sroom) return;
        // iterate items to spawn
        let x_spawns = [

            /*
            Rous.xspec({ healthMax: 10, xp: 1, }),
            Scarab.xspec({ healthMax: 5, xp: 1, }),
            Weapon.xspec({ kind: 'bonk', identifiable: true, charms: [ new BooCharm() ], }),
            Cog.xspec({ kind: 'identify', }),
            Cog.xspec({ kind: 'lvlup', }),
            Cog.xspec({ kind: 'invulnerability', }),
            Cog.xspec({ kind: 'purge', }),
            */

            //Weapon.xspec({ name: 'bonk', tier: 1, kind: 'bonk', }),
            //Weapon.xspec({ name: 'bonk', tier: 2, kind: 'bonk', }),
            //Cog.xspec({ kind: 'purge', }),
            //Gem.xspec({ kind: 'fire', }),
            //Weapon.xspec({ name: 'bonk', tier: 3, kind: 'bonk', }),
            //Token.xspec({ name: 'token', x_sketch: Assets.get('token'), count: 50 }),
            Gem.xspec({ kind: 'fire', }),
            Gem.xspec({ kind: 'fire', }),
            //Gem.xspec({ kind: 'daze', }),
            //Gem.xspec({ kind: 'power', }),
            //Gem.xspec({ kind: 'stealth', }),
            //this.genGadget(template),
            //this.genShielding(template),

            //this.genRanged(template),
            //Funguy.xspec({lvl: 2}),


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

    static genPlayer(template) {
        let player = new Player({
            tag: 'pc',
            idx: 0,
            xform: new XForm({ stretch: false }),
            sketch: Assets.get('player', true),
            maxSpeed: Config.tileSize/.3/1000,
            z: template.fgZed,
            healthMax: 25,
            losRange: Config.tileSize*5,
            team: 'player',
            inventory: new InventoryData({
                numSlots: 25,
                beltSlots: 3,
                gadgetSlots: 3,
            }),
        });

        let x_weapon = this.genWeapon(template, {
            charmPct: 0, 
            cursePct: 0, 
            tierByLTier: { 
                1: [{ weight: 1, tier: 1 }],
                2: [{ weight: 1, tier: 1 }],
                2: [{ weight: 1, tier: 1 }],
            },
            spryPerTier: {
                1: { min: 10, max: 10},
            },
            identifiableByTier: {
                1: 0,
            },
        });
        let weapon = Generator.generate(x_weapon);

        let x_reactor = this.genReactor(template, {
            charmPct: 0, 
            cursePct: 0, 
            tierByLTier: { 
                1: [{ weight: 1, tier: 1 }],
                2: [{ weight: 1, tier: 1 }],
                2: [{ weight: 1, tier: 1 }],
            },
            identifiableByTier: {
                1: 0,
            },
        });
        let reactor = Generator.generate(x_reactor);

        player.inventory.equip('reactor', reactor);
        player.inventory.equip('weapon', weapon);

        return player;
    }
    
}