export { Funguy };

import { Assets } from '../base/assets.js';
import { Config } from '../base/config.js';
import { Prng } from '../base/prng.js';
import { Enemy } from './enemy.js';

class Funguy extends Enemy{
    // STATIC METHODS ------------------------------------------------------
    static xspec(spec={}) {
        // parse lvl
        let lvl = spec.lvl || 1;
        // health
        let health = Prng.rangeInt(3,8);
        for (let i=1; i<lvl; i++) health += Prng.rangeInt(1,3);
        // final spec
        return Object.assign( this.spec, {
            xp: 5,
            healthMax: health,
            x_sketch: Assets.get('funguy'),
            maxSpeed: Config.tileSize/.3/1000,
            losRange: Config.tileSize*5,
            aggroRange: Config.tileSize*5,
            deathTTL: 1000,
            attackKind: 'dark',
        }, spec);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.rangeMin = spec.rangeMin || Config.tileSize*3;
        this.rangeMax = spec.rangeMax || Config.tileSize*5;
    }

    // EVENT HANDLERS ------------------------------------------------------
    /*
    onLevelLoaded(evt) {
        let lvl = evt.lvl;
        // setup directives
        let x_dir = {
            lvl: lvl,
            actor: this,
        }
        this.moveTo = new AiMoveTowardsTargetDirective(Object.assign({range: this.rangeMin}, x_dir));
        this.moveFrom = new AiMoveFromTargetDirective(Object.assign({range: this.rangeMax}, x_dir));
        this.search = new AiMoveToIdxDirective(x_dir);
        this.attack = new AiRangeTargetDirective(x_dir);
        this.actionStream = this.run();
        // activate
        this.active = true;
    }
    */

    // METHODS -------------------------------------------------------------
    // run state action generator
    /*
    *run() {
        while (!this.done) {
            switch (this.state) {
            case 'idle':
                yield null;
                break;
            case 'search':
                // attempt to move within range
                yield *this.search.run();
                // go back to idle state if search ends
                if (this.search.done) {
                    UpdateSystem.eUpdate(this, {state: 'idle'});
                    this.actionStream = this.run();
                    yield null;
                }
                break;
            case 'attack':
                // attempt to move within range
                yield *this.move.run();
                // attack while in range
                yield *this.attack.run();
                // prevent tight loops in run loop if move/attack both fail
                if (!this.move.ok && !this.attack.ok) yield null;
                break;
            default:
                yield null;
            }
        }
    }
    */

}