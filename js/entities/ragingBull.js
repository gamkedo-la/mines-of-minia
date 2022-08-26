export { RagingBull };

    import { AiChargeDirective } from '../ai/aiChargeDirective.js';
    import { AiEnergizeDirective } from '../ai/aiEnergizeDirective.js';
import { AiMoveToAlign } from '../ai/aiMoveToAlign.js';
import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Prng } from '../base/prng.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { Enemy } from './enemy.js';

class RagingBull extends Enemy{
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // parse lvl
        let lvl = spec.lvl || 1;
        // health
        let health = Prng.rangeInt(3,8);
        for (let i=1; i<lvl; i++) health += Prng.rangeInt(1,3);
        // final spec
        return Object.assign( {}, this.spec, {
            xp: 5,
            healthMax: health,
            x_sketch: Assets.get('bull'),
            maxSpeed: Config.tileSize/.3/1000,
            losRange: Config.tileSize*14,
            aggroRange: Config.tileSize*14,
            deathTTL: 1000,
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelLoaded(evt) {
        let lvl = evt.lvl;
        // setup directives
        let x_dir = {
            lvl: lvl,
            actor: this,
        }
        this.move = new AiMoveToAlign(x_dir);
        this.energize = new AiEnergizeDirective(x_dir);
        this.charge = new AiChargeDirective(x_dir);
        this.actionStream = this.run();
        // activate
        this.active = true;
    }

    onAggro(evt) {
        if (!this.active) return;
        //console.log(`${this} aggrod ${Fmt.ofmt(evt)}}`);
        this.move.target = evt.target;
        this.energize.target = evt.target;
        this.charge.target = evt.target;
        UpdateSystem.eUpdate(this, {state: 'align'});
        this.actionStream = this.run();
    }

    onAggroLost(evt) {
        if (!this.active) return;
        //console.log(`${this} aggro lost ${Fmt.ofmt(evt)}}`);
        //this.search.targetIdx = evt.lastIdx;
        UpdateSystem.eUpdate(this, {state: 'idle'});
        this.actionStream = this.run();
    }

    // METHODS -------------------------------------------------------------
    // run state action generator
    *run() {
        while (!this.done) {
            switch (this.state) {
            case 'idle':
                yield null;
                break;
            case 'align':
                // attempt to move within range
                yield *this.move.run();
                // -- move ok
                if (this.move.done) {
                    UpdateSystem.eUpdate(this, {state: 'energize'});
                    this.actionStream = this.run();
                    yield null;
                // -- move failed
                } else {
                    UpdateSystem.eUpdate(this, {state: 'idle'});
                    this.actionStream = this.run();
                    yield null;
                }
                break;
            case 'energize':
                // energize charge
                yield *this.energize.run();
                if (this.energize.ok) {
                    UpdateSystem.eUpdate(this, {state: 'charge'});
                    this.actionStream = this.run();
                    yield null;
                } else {
                    UpdateSystem.eUpdate(this, {state: 'align'});
                    this.actionStream = this.run();
                    yield null;
                }

                break;
            case 'charge':
                // perform charge
                yield *this.charge.run();
                UpdateSystem.eUpdate(this, {state: 'align'});
                this.actionStream = this.run();
                break;
            default:
                yield null;
            }
        }
    }

}