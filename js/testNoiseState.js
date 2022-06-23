export { TestNoiseState };

import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { GameState } from './base/gameState.js';
import { Generator } from './base/generator.js';
import { Keys } from './base/keys.js';
import { PerlinNoise, SimpleNoise } from './base/noise.js';
import { UxCanvas } from './base/uxCanvas.js';
import { UxDbg } from './base/uxDbg.js';
import { Outline } from './procgen/outline.js';
import { ProcLevelOutline } from './procgen/plevel.js';
import { Translate } from './procgen/translate.js';


class TestNoiseState extends GameState {
    async ready() {
        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);

        let x_view = UxCanvas.xspec({
            cvsid: 'game.canvas',
            tag: 'cvs.0',
            autosize: true,
            x_children: [
                UxDbg.xspec({
                    tag: UxDbg.dfltTag,
                }),
            ],
        });



        this.view = Generator.generate(x_view);
        console.log(`view: ${this.view}`);

        this.noise = new SimpleNoise({scalex:.04, scaley:.045, seed: Math.random()});
        //this.noise = new PerlinNoise({scalex:.03, scaley:.025, seed: Math.random()});

        // draw the noise field
        let plvlo = new ProcLevelOutline({
            x: 100,
            y: 100,
            cols: 128,
            rows: 128,
            unitSize: 4,
        })
        for (let i=0; i<plvlo.cols; i++) {
            for (let j=0; j<plvlo.rows; j++) {
                let idx = plvlo.data.idxfromij(i,j);
                let sample = Outline.sampleFloor(plvlo, this.noise, idx);
                console.l
                plvlo.data.setidx(idx, sample);
            }
        }
        plvlo.draw();

    }

    onKeyDown(evt) {
        console.log(`${this.constructor.name} onKeyDown: ${Fmt.ofmt(evt)}`);
    }

    stop() {
        Events.ignore(Keys.evtDown, this.onKeyDown);
        this.view.destroy();
    }
}