export { Overbearer };

import { GeneratorAction } from '../base/actions/generatorAction.js';
import { Assets } from '../base/assets.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Enemy } from './enemy.js';

class Overbearer extends Enemy{
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( this.spec, {
            x_sketch: Assets.get('overbearer'),
            blocks: 0,
            blockedBy: 0,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        if (spec.elvl) this.linkLevel(spec.elvl);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        this.linkLevel(evt.lvl);
        this.active = true;
    }

    onAggro(evt) {
        if (!this.active) return;
        console.log(`${this} aggrod ${Fmt.ofmt(evt)}}`);
        UpdateSystem.eUpdate(this, {state: 'greet'});
        this.actionStream = this.run();
    }

    onAggroLost(evt) {
        if (!this.active) return;
        console.log(`${this} aggro lost ${Fmt.ofmt(evt)}}`);
    }

    onBullDeath(evt) {
    }

    // METHODS -------------------------------------------------------------
    linkLevel(lvl) {
        this.elvl = lvl;
    }

    *run() {
        while (!this.done) {
            switch (this.state) {
            case 'idle':
                yield null;
                break;
            case 'greet':
                yield new FinalGreetScriptAction({
                    lvl: this.elvl,
                });
                UpdateSystem.eUpdate(this, {state: 'idle'});
                break;
            }
        }
    }

}

class FinalGreetScriptAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
        this.lvl = spec.lvl;
    }
    *run() {
        console.log(`running final greet script`);
        // -- lookup raging bull
        let bull = this.lvl.first((v) => v.tag === 'boss.bull');
        console.log(`bull: ${bull}`);
        if (!bull) return;
        // -- move to bull
        let path = this.lvl.pathfinder.find(this.actor, this.actor.idx, bull.idx);
        yield *path.actions;
        // -- deactivate overbearer
        this.actor.active = false;
        this.actor.visible = false;
        // -- activate bull
        bull.active = true;
        // -- listen for bull death
        bull.evt.listen(bull.constructor.evtDeath, this.onBullDeath, Events.once);

    }
}
