export { TakeStairsAction };

import { Action } from '../base/actions/action.js';
import { Events } from '../base/event.js';
import { LevelSystem } from '../systems/levelSystem.js';

class TakeStairsAction extends Action {
    static evtEndTurn = 'action.endturn';
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
        console.log(`current: ${this.currentLevel} up: ${this.stairs.up} which: ${whichLevel}`)
        // trigger want level event
        Events.trigger(this.evtLevelWanted, { level: whichLevel });
    }

}