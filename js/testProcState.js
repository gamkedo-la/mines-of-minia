export { TestProcState };

    import { Config } from './base/config.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { GameState } from './base/gameState.js';
import { Generator } from './base/generator.js';
import { Keys } from './base/keys.js';
import { UxCanvas } from './base/uxCanvas.js';
import { UxDbg } from './base/uxDbg.js';
import { ProcGen } from './procgen/procgen.js';
import { ProcTemplate } from './procgen/ptemplate.js';


class TestProcState extends GameState {
    async ready() {
        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        this.procstep = 0;
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

        UxDbg.drawLine('dbg', 100,100,200,200);
        UxDbg.drawTile('dbg', 5,5, {x:100, y:100, tileSize: 8});
        UxDbg.drawTile('dbg', 6,5, {x:100, y:100, tileSize: 8, fill: true});
        UxDbg.drawArc('dbg', 50,50, 20, {color: 'orange', fill: true});

        this.pstate = {};
        this.template = Config.template;

        this.lvlgen = ProcGen.levelGenerator(this.template, this.pstate);
        ProcGen.dbgGenerateLevel(this.lvlgen, this.pstate);

    }

    onKeyDown(evt) {
        //console.log(`${this.constructor.name} onKeyDown: ${Fmt.ofmt(evt)}`);
        if (evt.key === 'n') {
            if (this.lvlgen) ProcGen.dbgGenerateLevel(this.lvlgen, this.pstate);
            //UxDbg.clear();
            //this.procstep++;
            //ProcGen.genLevel({step: this.procstep});
        }
        /*
        if (evt.key === 'p') {
            UxDbg.clear();
            this.procstep--;
            if (this.procstep < 0) this.procstep = 0;
            ProcGen.genLevel({step: this.procstep});
        }
        */
    }

    stop() {
        Events.ignore(Keys.evtDown, this.onKeyDown);
        this.view.destroy();
    }
}