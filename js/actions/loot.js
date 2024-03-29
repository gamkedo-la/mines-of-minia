export { DropLootAction };

import { ApplyAction } from '../base/actions/apply.js';
import { MoveAction } from '../base/actions/move.js';
import { PlaySfxAction } from '../base/actions/playSfx.js';
import { SerialAction } from '../base/actions/serialAction.js';
import { UpdateAction } from '../base/actions/update.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Generator } from '../base/generator.js';
import { Util } from '../base/util.js';
import { SpawnAction } from './spawn.js';

class DropLootAction extends SerialAction {
    static dfltNudge = 12;
    static get dfltNudgeSpeed() {
        let tileSize = Config.tileSize || 16;
        // how far to travel / time to travel gives speed
        // -- how long should it take to travel across given tileSize?
        // -- .3 seconds/1000 gives value in microseconds
        return tileSize/.2/1000;
    }
    static get dfltNudgeAccel() {
        let tileSize = Config.tileSize || 16;
        return tileSize/.1/1000;
    }
    static get dfltLootSfx() {
        if (!this._dfltLootSfx) this._dfltLootSfx = Assets.get('item.loot', true);
        return this._dfltLootSfx;
    }
    static get dfltLootThudSfx() {
        if (!this._dfltLootThudSfx) this._dfltLootThudSfx = Assets.get('item.lootThud', true);
        return this._dfltLootThudSfx;
    }

    constructor(spec) {
        super(spec);
        this.lootSpec = spec.lootSpec;
        this.sfx = spec.sfx;
        this.nudge = spec.hasOwnProperty('nudge') ? spec.nudge : this.constructor.dfltNudge;
        this.nudgeAccel = spec.hasOwnProperty('nudgeAccel') ? spec.nudgeAccel : this.constructor.dfltNudgeAccel;
        this.nudgeSpeed = spec.hasOwnProperty('nudgeSpeed') ? spec.nudgeSpeed : this.constructor.dfltNudgeSpeed;
        this.lootSfx = spec.hasOwnProperty('lootSfx') ? spec.lootSfx : this.constructor.dfltLootSfx;
        this.lootThudSfx = spec.hasOwnProperty('lootThudSfx') ? spec.lootThudSfx : this.constructor.dfltLootThudSfx;
        this.lvl = spec.lvl;
    }

    setup() {
        // -- spawn loot
        let loot = Generator.generate(this.lootSpec);
        // -- check viability of loot location
        let lvl = this.lvl;
        let spawnTarget = this.actor;
        // -- loot location is viable if actor is over floor tile
        if (lvl.firstidx(spawnTarget.idx, (v) => v.cls === 'Tile').kind !== 'floor') {
            // otherwise... find nearest viable location
            let bestIdx = Util.findBest(
                lvl.idxsInRange(spawnTarget.idx, Config.tileSize*5),
                (idx) => lvl.idxdist(spawnTarget.idx, idx),
                (d1,d2) => d1<d2,
                (d) => true,
                (idx) => {
                    // check for floor
                    let floor = lvl.firstidx(idx, (e) => e.cls === 'Tile' && e.kind === 'floor');
                    if (!floor) return false;
                    // check for other obstacles that could block loot
                    if (this.lvl.anyidx(idx, (e) => loot.blockedBy & e.blocks)) return false;
                    return true;
                }
            );
            if (bestIdx) spawnTarget = lvl.firstidx(bestIdx, (e) => e.cls === 'Tile' && e.kind === 'floor');
        }

        // -- hackety hack hack... hard-ware offx/offy to properly offset loot
        loot.xform.offx = -loot.xform.width*.5;
        if (loot.xform.height > Config.tileSize) {
            loot.xform.offy = Config.tileSize*.5 - loot.xform.height;
        } else {
            loot.xform.offy = -loot.xform.height*.5;
        }
        this.subs.push(new SpawnAction({
            target: spawnTarget,
            spawn: loot,
            sfx: this.lootSfx,
            z: 3,       // -- note: zed is 3, to draw in front of everything else
        }));

        // nudge up
        if (this.nudge) {
            let x = spawnTarget.xform.x;
            let y = spawnTarget.xform.y - this.nudge;
            this.subs.push( new ApplyAction({
                target: loot,
                action: new MoveAction({
                    x: x,
                    y: y,
                    speed: this.nudgeSpeed,
                    accel: this.nudgeAccel,
                    range: 2,
                    stopAtTarget: true,
                    snap: true,
                }),
            }));
        }
        // nudge down
        if (this.nudge) {
            let x = spawnTarget.xform.x;
            let y = spawnTarget.xform.y;
            this.subs.push( new ApplyAction({
                target: loot,
                action: new MoveAction({
                    x: x,
                    y: y,
                    speed: this.nudgeSpeed,
                    accel: this.nudgeAccel,
                    range: 2,
                    stopAtTarget: true,
                    snap: true,
                }),
            }));
        }
        // thud
        if (this.lootThudSfx) {
            this.subs.push( new PlaySfxAction({
                sfx: this.lootThudSfx,
            }));
        }
        // restore zed
        this.subs.push(new UpdateAction({
            update: { z: 2 },
        }));

    }


}