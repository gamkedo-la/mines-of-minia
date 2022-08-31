export { Overbearer };

import { GeneratorAction } from '../base/actions/generatorAction.js';
import { Assets } from '../base/assets.js';
import { Fmt } from '../base/fmt.js';
import { Enemy } from './enemy.js';

class Overbearer extends Enemy{
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // final spec
        return Object.assign( this.spec, {
            x_sketch: Assets.get('overbearer'),
            blocks: 0,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        //console.log(`Rous spec: ${Fmt.ofmt(spec)}`);
        if (spec.elvl) this.linkLevel(spec.elvl);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        this.linkLevel(evt.lvl);
    }

    onAggro(evt) {
        if (!this.active) return;
        console.log(`${this} aggrod ${Fmt.ofmt(evt)}}`);
    }

    onAggroLost(evt) {
        if (!this.active) return;
        console.log(`${this} aggro lost ${Fmt.ofmt(evt)}}`);
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
            }
        }
    }

}

class FinalGreetScriptAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
    }
    *run() {
        yield null;
    }
}
