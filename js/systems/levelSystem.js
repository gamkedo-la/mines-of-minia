export { LevelSystem };

import { Config } from '../base/config.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { Generator } from '../base/generator.js';
import { System } from '../base/system.js';
import { XForm } from '../base/xform.js';
import { Cog } from '../entities/cog.js';
import { Gem } from '../entities/gem.js';
import { Item } from '../entities/item.js';
import { Level } from '../level.js';
import { ProcGen } from '../procgen/procgen.js';
import { Serialization } from '../serialization.js';

class LevelSystem extends System {

    // STATIC VARIABLES ----------------------------------------------------
    static evtWanted = 'lvl.wanted';
    static evtLoaded = 'lvl.loaded';

    static currentLevelIndex = 0;
    static dfltIterateTTL = 0;

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this.lvl = spec.lvl || new Level();
        this.slider = spec.slider;
        this.wantLevel = 0;
        this.maxLevel = spec.maxLevel || Config.maxLvl;
        // event handlers
        this.onLevelWanted = this.onLevelWanted.bind(this);
        this.onItemEmerged = this.onItemEmerged.bind(this);
        this.evt.listen(this.constructor.evtWanted, this.onLevelWanted);
        this.evt.listen(Item.evtEmerged, this.onItemEmerged);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onLevelWanted(evt) {
        //console.log(`${this} onLevelWanted: ${Fmt.ofmt(evt)}`);
        if (evt.level !== this.constructor.currentLevelIndex) {
            this.wantLevel = evt.level;
            this.loadLevel = evt.load || false;
            this.active = true;
        }
    }

    onItemEmerged(evt) {
        //console.log(`item emerged: ${Fmt.ofmt(evt)}`);
        this.lvl.adopt(evt.actor);
    }

    finalize(evt) {
        this.active = false;
        if (this.wantLevel) {
            this.handleLevelRequest(this.wantLevel);
        }
    }

    handleLevelRequest(index) {
        // save and clear current level
        if (this.constructor.currentLevelIndex) {
            console.log(`saving level: ${this.constructor.currentLevelIndex}`);
            // save current level data
            Serialization.saveLevel(this.lvl);
            // clear level data
            for (const e of this.lvl.grid) {
                if (e.cls === 'Player') continue;
                e.destroy();
            }
        }

        // look up level by index
        let cachedLvl = Serialization.loadLevel(index);
        let doload = (cachedLvl) ? true : false;

        // is level to load cached?
        let template = Object.assign( {}, Config.template, {
            index: index,
            dospawn: !doload,
        });

        // generate level
        let plvl = ProcGen.genLvl(template);
        // update level info w/ cached info (if available)
        if (cachedLvl) {
            plvl.entities = plvl.entities.concat(cachedLvl.entities);
        }

        // instantiate level
        this.instantiateLevel(plvl);

        // update level index
        let goingUp = (plvl.index > this.constructor.currentLevelIndex);
        this.constructor.currentLevelIndex = plvl.index;
        this.lvl.index = plvl.index;

        // update fow
        this.lvl.fowIdxs = (cachedLvl) ? cachedLvl.fowIdxs : [];
        this.lvl.fowMasks = (cachedLvl) ? cachedLvl.fowMasks : {};
        if (cachedLvl) {
            console.log(`assign fowMasks: ${this.lvl.fowMasks}`);
        }

        // trigger load complete
        Events.trigger(this.constructor.evtLoaded, {plvl: plvl, lvl: this.lvl, goingUp: goingUp});
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
                let h = e.xform.height;
                e.xform.offx = -e.xform.width*.5;
                if (h > Config.tileSize) {
                    //e.xform.offy = -Config.tileSize*.5;
                    e.xform.offy = Config.tileSize*.5 - e.xform.height;
                    // console.log(`${e} xform offy: ${e.xform.offy}`)
                } else {
                    e.xform.offy = -e.xform.height*.5;
                    // console.log(`${e} xform offy: ${e.xform.offy}`)
                }
            }
            //console.log(`x_e: ${Fmt.ofmt(x_e)} e: ${e}`);
            this.lvl.adopt(e);
        }

    }
    
}