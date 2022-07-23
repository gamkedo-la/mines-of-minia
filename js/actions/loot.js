export { DropLootAction };

import { Action } from '../base/actions/action.js';
import { ApplyAction } from '../base/actions/apply.js';
import { MoveAction } from '../base/actions/move.js';
import { SerialAction } from '../base/actions/serialAction';
import { Config } from '../base/config.js';

class DropLootAction extends SerialAction {
    static dfltNudge = 8;
    static get dfltNudgeSpeed() {
        let tileSize = Config.tileSize || 16;
        // how far to travel / time to travel gives speed
        // -- how long should it take to travel across given tileSize?
        // -- .3 seconds/1000 gives value in microseconds
        return tileSize/.3/1000;
    }
    static get dfltNudgeAccel() {
        let tileSize = Config.tileSize || 16;
        return tileSize/.1/1000;
    }

    constructor(spec) {
        super(spec);
        this.lootSpec = spec.lootSpec;
        this.sfx = spec.sfx;
        this.nudge = spec.hasOwnProperty('nudge') ? spec.nudge : this.constructor.dfltNudge;
        this.nudgeAccel = spec.hasOwnProperty('nudgeAccel') ? spec.nudgeAccel : this.constructor.dfltNudgeAccel;
        this.nudgeSpeed = spec.hasOwnProperty('nudgeSpeed') ? spec.nudgeSpeed : this.constructor.dfltNudgeSpeed;
    }

    setup() {
        // -- spawn loot
        let loot = Generator.generate(this.lootSpec);
        this.subs.push(new SpawnAction({
            target: this.actor,
            spawn: loot,
            sfx: this.sfx,
            z: 2,
        }));

        // nudge up
        if (this.nudge) {
            let x = this.actor.xform.x;
            let y = this.actor.xform.y - this.nudge;
            this.subs.push( new ApplyAction({
                target: loot,
                action: MoveAction({
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
            let x = this.actor.xform.x;
            let y = this.actor.xform.y;
            this.subs.push( new ApplyAction({
                target: loot,
                action: MoveAction({
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

    }


}