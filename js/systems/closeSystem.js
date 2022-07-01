export { CloseSystem };

import { System } from '../base/system.js';
import { Character } from '../entities/character.js';
import { Door } from '../entities/door.js';

class CloseSystem extends System {
    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.lvl = spec.lvl;
        this.openidxs = new Set();
        // -- event handlers
        this.onDoorUpdate = this.onDoorUpdate.bind(this);
        this.onCharUpdate = this.onCharUpdate.bind(this);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEntityAdded(evt) {
        if (this.matchPredicate(evt.actor)) {
            if (this.dbg) console.log(`${this} onEntityAdded: ${Fmt.ofmt(evt)} gid: ${evt.actor.gid}`);
            this.store.set(evt.actor.gid, evt.actor);
            // listen for door events...
            evt.actor.evt.listen(evt.actor.contructor.evtUpdated, this.onDoorUpdate);
            // if door is open...
            if (evt.actor.state === 'open') {
                this.handleOpenDoor(evt.actor);
            }
        }
    }

    onDoorUpdate(evt) {
    }

    onCharUpdate(evt) {
    }

    // METHODS -------------------------------------------------------------
    handleOpenDoor(door) {
        // see what characters are adjacent
        let adjacent = false;
        for (const dir of Direction.all) {
            let idx = this.lvl.idxfromdir(door.idx, dir);
            for (const e of this.lvl.findidx(idx, (v) => v instanceof Character)) {
                // listen for event updates on adjacent characters
                e.evt.listen(evt.actor.constructor.evtUpdated, this.onCharUpdate);
                adjacent = true;
            }
            if (idx === this.target.idx) return true;
        }
        if (!adjacent) {
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