export { LevelSystem };

import { Config } from '../base/config.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Generator } from '../base/generator.js';
import { System } from '../base/system.js';
import { XForm } from '../base/xform.js';
import { Level } from '../level.js';
import { ProcGen } from '../procgen/procgen.js';

class LevelSystem extends System {

    // STATIC VARIABLES ----------------------------------------------------
    static evtWanted = 'lvl.wanted';
    static evtLoaded = 'lvl.loaded';

    static currentLevelIndex = 0;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this.lvl = spec.lvl || new Level();
        this.slider = spec.slider;
        this.wantLevel = 0;
        // event handlers
        this.onLevelWanted = this.onLevelWanted.bind(this);
        this.evt.listen(this.constructor.evtWanted, this.onLevelWanted);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelWanted(evt) {
        console.log(`${this} onLevelWanted: ${Fmt.ofmt(evt)}`);
        if (evt.level !== this.constructor.currentLevelIndex) {
            this.wantLevel = evt.level;
            this.active = true;
        }
    }

    finalize(evt) {
        this.active = false;
        if (this.wantLevel) {
            //let template = Config.template;
            //console.log(`== wantLevel: ${this.wantLevel}`);
            //template.index = this.wantLevel;
            //let plvl = ProcGen.genLvl(template);
            this.handleLevelRequest(this.wantLevel);
        }
    }

    handleLevelRequest(index) {
        // save and clear current level
        if (this.constructor.currentLevelIndex) {
            // FIXME
            let lvlentries = [];
            for (const arr of this.lvl.grid.grid) {
                if (!arr) continue;
                for (const e of arr) {
                    if (e.idx === 3048) console.log(`on level eval: ${e}`);
                    if (e.cls === 'Enemy' || e.cls === 'Stairs') console.log(`on level eval: ${e}`);
                    if (e.cls !== 'Player') {
                        //console.log(`destroy: ${e} cls: ${e.cls}`);
                        if (e.cls !== 'Tile') {
                            let spec = e.as_kv();
                            console.log(`e is not tile: ${e} spec: ${Fmt.ofmt(spec)}`);
                            lvlentries.push(spec);
                        }
                        e.destroy();
                    }
                }
            }
            console.log(`entries: ${Fmt.ofmt(lvlentries)}`);
        }

        // is level to load cached?

        // otherwise... generate level
        let template = Config.template;
        console.log(`== wantLevel: ${this.wantLevel}`);
        template.index = index;
        let plvl = ProcGen.genLvl(template);

        // instantiate level
        this.instantiateLevel(plvl);
    }

    instantiateLevel(plvl) {

        // resize UI elements for new level
        // -- hackety hack hack: the parent window to the level (slider) needs to be resized prior to adding all of the entities to it 
        // -- (all of the grid.x/yfromidx below won't be accurate otherwise)
        if (this.slider) {
            // -- resize slider/level to match level
            let width = plvl.cols * Config.tileSize;
            let height = plvl.rows * Config.tileSize;
            // -- resize scrollable area
            this.slider.resize(width, height, true);
        }

        // instantiate level entities
        for (const x_e of plvl.entities) {
            // lookup index
            let idx = x_e.idx || 0;
            // override xform to position constructed entity at given index
            let x = this.lvl.grid.xfromidx(idx, true);
            let y = this.lvl.grid.yfromidx(idx, true);
            x_e.x_xform = XForm.xspec({ x: x, y: y, stretch: false, });
            // update lvl accessors
            x_e.idxfromdir = this.lvl.idxfromdir.bind(this.lvl);
            x_e.anyidx = this.lvl.anyidx.bind(this.lvl);
            x_e.fowidx = this.lvl.fowidx.bind(this.lvl);
            x_e.fowmask = this.lvl.fowmask.bind(this.lvl);
            // generate
            let e = Generator.generate(x_e);
            // center at x,y
            // FIXME
            if (e.cls !== 'Tile') {
                e.xform.offx = -e.xform.width*.5;
                e.xform.offy = -e.xform.height*.5;
            }
            //console.log(`x_e: ${Fmt.ofmt(x_e)} e: ${e}`);
            this.lvl.adopt(e);
        }

        // update level index
        this.constructor.currentLevelIndex = plvl.index;
        this.lvl.index = plvl.index;

        // trigger load complete
        Events.trigger(this.constructor.evtLoaded, {plvl: plvl, lvl: this.lvl});
    }
    
}