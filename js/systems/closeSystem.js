export { CloseSystem };

import { Direction } from '../base/dir.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { Util } from '../base/util.js';
import { Character } from '../entities/character.js';
import { Door } from '../entities/door.js';

class CloseSystem extends System {
    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.lvl = spec.lvl;
        // map between entities (gid) that impact door state and the doors they influence
        this.doorMap = {};
        // -- event handlers
        this.onDoorUpdate = this.onDoorUpdate.bind(this);
        this.onCharUpdate = this.onCharUpdate.bind(this);
        this.onLootDestroyed = this.onLootDestroyed.bind(this);
        this.onLootPickup = this.onLootPickup.bind(this);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEntityAdded(evt) {
        let e = evt.actor;
        if (this.matchPredicate(e)) {
            if (this.dbg) console.log(`${this} onEntityAdded: ${Fmt.ofmt(evt)} gid: ${e.gid}`);
            this.store.set(e.gid, e);
            // listen for door events...
            e.evt.listen(e.constructor.evtUpdated, this.onDoorUpdate);
            // if door is open...
            if (e.state === 'open') {
                this.handleOpenDoor(e);
            }
        }
    }

    onDoorUpdate(evt) {
        if (this.dbg) console.log(`-- ${this} onDoorUpdate ${Fmt.ofmt(evt)}`);
        if (evt.update && evt.update.state === 'open') {
            this.handleOpenDoor(evt.actor);
        }
    }

    onCharUpdate(evt) {
        let e = evt.actor;
        if (evt.update && (evt.update.hasOwnProperty('idx') || evt.update.state === 'dying')) {
            if (this.dbg) console.log(`-- ${this} onCharUpdate ${Fmt.ofmt(evt)} door map from ${e.idx}: ${this.doorMap[e.gid]}`);
            for (const door of Array.from(this.doorMap[e.gid] || [])) {
                // check if adjacent to door
                let adjacent = e.idx === door.idx || this.lvl.someAdjacent(e.idx, (v) => v === door);
                if (this.dbg) console.log(`check if actor ${e} is adjacent: ${adjacent} to door: ${door}`);
                if (!adjacent || e.state === 'dying') {
                    let idx = this.doorMap[e.gid].indexOf(door);
                    if (idx !== -1) this.doorMap[e.gid].splice(idx, 1);
                    this.handleOpenDoor(door);
                }
            }
            if (!this.doorMap[e.gid] || this.doorMap[e.gid].length === 0) {
                e.evt.ignore(e.constructor.evtUpdated, this.onCharUpdate);
            }
        }
    }

    onLootDestroyed(evt) {
        let e = evt.actor;
        if (this.dbg) console.log(`-- ${this} onLootDestroyed ${Fmt.ofmt(evt)} door map from ${e.idx}: ${this.doorMap[e.gid]}`);
        for (const door of Array.from(this.doorMap[e.gid] || [])) {
            this.handleOpenDoor(door);
            e.evt.ignore(e.constructor.evtDestroyed, this.onLootDestroyed);
        };
        delete this.doorMap[e.gid];
    }

    onLootPickup(evt) {
        let e = evt.actor;
        if (evt.update && evt.update.animState === 'carry') {
            if (this.dbg) console.log(`-- ${this} onLootPickup ${Fmt.ofmt(evt)} door map from ${e.idx}: ${this.doorMap[e.gid]}`);
            for (const door of Array.from(this.doorMap[e.gid] || [])) {
                this.handleOpenDoor(door);
            };
            e.evt.ignore(e.constructor.evtUpdated, this.onLootPickup);
            delete this.doorMap[e.gid];
        }
    }

    // METHODS -------------------------------------------------------------
    handleOpenDoor(door) {
        // see if any loot has spawned in open door...
        let lootBlocking = false;
        for (const e of this.lvl.findidx(door.idx, (v) => v.constructor.lootable)) {
            lootBlocking = true;
            e.evt.listen(e.constructor.evtDestroyed, this.onLootDestroyed);
            e.evt.listen(e.constructor.evtUpdated, this.onLootPickup);
            Util.getOrAssign(this.doorMap, e.gid).push(door);
        }
        // see what characters are adjacent
        let adjacent = false;
        for (const idx of [door.idx, ...Direction.all.map((v) => this.lvl.idxfromdir(door.idx, v))]) {
            for (const e of this.lvl.findidx(idx, (v) => v instanceof Character)) {
                // skip character if dying
                if (e.state === 'dying') continue;
                // listen for event updates on adjacent characters
                e.evt.listen(e.constructor.evtUpdated, this.onCharUpdate);
                adjacent = true;
                Util.getOrAssign(this.doorMap, e.gid).push(door);
                //console.log(`${e} is adjacent to door: ${door} map: ${Fmt.ofmt(this.doorMap)}`);
            }
        }
        if (!adjacent && !lootBlocking) {
            this.closeDoor(door);
        }
    }

    closeDoor(door) {
        door.close();
    }

    matchPredicate(e) {
        return (e instanceof Door);
    }

}