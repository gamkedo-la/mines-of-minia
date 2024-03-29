export { TakeStairsAction };

import { Action } from '../base/actions/action.js';
import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { LevelSystem } from '../systems/levelSystem.js';

class TakeStairsAction extends Action {
    static dfltPoints = 0;

    constructor(spec={}) {
        super(spec);
        this.evtLevelWanted = spec.evtLevelWanted || LevelSystem.evtWanted;
        this.stairs = spec.stairs;
        this.currentLevel = spec.currentLevel || LevelSystem.currentLevelIndex;
    }

    // METHODS -------------------------------------------------------------
    setup() {
        // this is an instant action
        this.done = true;
        // determine which level
        let whichLevel = this.currentLevel + ((this.stairs.up) ? 1 : -1);
        let load = (whichLevel > LevelSystem.maxLevelIndex) ? false : true;
        console.log(`current: ${this.currentLevel} up: ${this.stairs.up} which: ${whichLevel}`)
        // trigger want level event
        if (whichLevel < 13) {
            let sfx = Assets.get((this.stairs.up) ? 'stairs.up' : 'stairs.down', true);
            sfx.play();
            Events.trigger(this.evtLevelWanted, { level: whichLevel, load: load });
        } else {
            Events.trigger('game.success');
        }
    }

}