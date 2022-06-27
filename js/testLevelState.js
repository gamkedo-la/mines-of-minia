export { TestLevelState };

import { MoveAction } from './base/actions/move.js';
import { UpdateAction } from './base/actions/update.js';
import { Array2D } from './base/array2d.js';
import { Assets } from './base/assets.js';
import { Bindings } from './base/bindings.js';
import { Bounds } from './base/bounds.js';
import { Camera } from './base/camera.js';
import { Config } from './base/config.js';
import { Direction } from './base/dir.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Game } from './base/game.js';
import { GameState } from './base/gameState.js';
import { Generator } from './base/generator.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Model } from './base/model.js';
import { Pathfinder } from './base/pathfinder.js';
import { Sketch } from './base/sketch.js';
import { Stats } from './base/stats.js';
import { Systems } from './base/system.js';
import { ActionSystem } from './base/systems/actionSystem.js';
import { CtrlSystem } from './base/systems/ctrlSystem.js';
import { MoveSystem } from './base/systems/moveSystem.js';
import { RenderSystem } from './base/systems/renderSystem.js';
import { UpdateSystem } from './base/systems/updateSystem.js';
import { Util } from './base/util.js';
import { UxCanvas } from './base/uxCanvas.js';
import { UxDbg } from './base/uxDbg.js';
import { UxMask } from './base/uxMask.js';
import { UxPanel } from './base/uxPanel.js';
import { Vect } from './base/vect.js';
import { XForm } from './base/xform.js';
import { Level } from './level.js';
import { LevelGraph } from './lvlGraph.js';
import { ProcLevel } from './procgen/plevel.js';
import { ProcGen } from './procgen/procgen.js';
import { Mathf } from './base/math.js';
import { LoSSystem } from './systems/losSystem.js';
import { ProcTemplate } from './procgen/ptemplate.js';
import { TurnSystem } from './systems/turnSystem.js';
import { AggroSystem } from './systems/aggroSystem.js';
import { Enemy } from './entities/enemy.js';
import { WaitAction } from './base/actions/wait.js';
import { EndTurnAction } from './actions/endTurn.js';
import { Character } from './entities/character.js';
import { MeleeAttackAction } from './actions/attack.js';
import { Player } from './entities/player.js';
import { FieryCharm } from './charms/fiery.js';




class TestLevelState extends GameState {
    async ready() {
        //this.tileSize = 32;

        let bindings = new Bindings({
            bindings: [
                { key: 'w',             tag: 'up' },
                { key: 'ArrowUp',       tag: 'up' },
                { key: 's',             tag: 'down' },
                { key: 'ArrowDown',     tag: 'down' },
                { key: 'a',             tag: 'left' },
                { key: 'ArrowLeft',     tag: 'left' },
                { key: 'd',             tag: 'right' },
                { key: 'ArrowRight',    tag: 'right' },
                { key: 'z',             tag: 'primary' },
                { key: 'x',             tag: 'secondary' },
            ],
        });

        Systems.add('update', new UpdateSystem({dbg: Util.getpath(Config, 'dbg.system.update')}));
        //Systems.add('ctrl', new CtrlSystem({bindings: bindings, ctrlid: 1, dbg: Util.getpath(Config, 'dbg.system.ctrl')}));
        Systems.add('move', new MoveSystem({ dbg: Util.getpath(Config, 'dbg.system.move')}));
        Systems.add('los', new LoSSystem({ dbg: Util.getpath(Config, 'dbg.system.los')}));
        Systems.add('turn', new TurnSystem({ dbg: Util.getpath(Config, 'dbg.system.turn')}));
        Systems.add('aggro', new AggroSystem({ dbg: Util.getpath(Config, 'dbg.system.aggro')}));

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onTock = this.onTock.bind(this);
        this.onLevelClick = this.onLevelClick.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        Events.listen(Game.evtTock, this.onTock);
        let x_view = UxCanvas.xspec({
            cvsid: 'game.canvas',
            tag: 'cvs.0',
            x_children: [
                UxMask.xspec({
                //UxPanel.xspec({
                    tag: 'viewport',
                    x_xform: XForm.xspec({border: .05, scalex: 1, scaley:1}),
                    dbg: { viewMask: true },
                    x_children: [
                        UxPanel.xspec({
                            tag: 'slider',
                            sketch: Sketch.zero,
                            x_xform: XForm.xspec({stretch: false, scalex: Config.scale, scaley: Config.scale, width: 50, height: 50}),
                            dbg: { xform: true },
                            //autocenter: true,
                            x_children: [
                                Level.xspec({
                                    losEnabled: Config.losEnabled,
                                    fowEnabled: Config.fowEnabled,
                                    //dbg: { xform: true },
                                    tag: 'lvl',
                                    tileSize: Config.tileSize,
                                    x_xform: XForm.xspec({origx: 0, origy:0}),
                                }),
                                UxDbg.xspec({
                                    tag: UxDbg.dfltTag,
                                    x_xform: XForm.xspec({origx: 0, origy:0}),
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });


        this.view = Generator.generate(x_view);
        console.log(`view: ${this.view}`);

        this.slider = Hierarchy.find(this.view, (v) => v.tag === 'slider');
        this.slider.resize(400,400);

        this.viewport = Hierarchy.find(this.view, (v) => v.tag === 'viewport');
        this.lvl = Hierarchy.find(this.view, (v) => v.tag === 'lvl');
        this.lvl.evt.listen(this.lvl.constructor.evtMouseClicked, this.onLevelClick);
        console.log(`this.lvl: ${this.lvl}`);
        //this.lvl.grid.dbg = true;


        Systems.get('los').lvl = this.lvl;

        this.template = Config.template;
        /*
        this.template = new ProcTemplate({
            doyield: true,
            seed: 2,
            unitSize: 4,
            maxCols: 180,
            maxRows: 120,
            tileSize: this.tileSize,
            outline: {
                hallWidth: 3,
                colOverflow: 2,
                rowOverflow: 2,
            },
            translate: {
                wall: 'twall',
            },
        });
        */

        let plvl;
        if (true) {
            plvl = ProcGen.genLvl(this.template);
        } else {
            plvl = new ProcLevel({ cols: 32, rows: 32, })
            plvl.spawnIdx = Array2D.idxfromij(16,12, 32, 32);
        }

        for (const idx of [
            Array2D.idxfromij(13,10, 32, 32),
            Array2D.idxfromij(14,10, 32, 32),
            Array2D.idxfromij(14,11, 32, 32),
            Array2D.idxfromij(14,12, 32, 32),
            Array2D.idxfromij(14,13, 32, 32),
            Array2D.idxfromij(15,12, 32, 32),
            /*
            Array2D.idxfromij(10,12, 32, 32),
            Array2D.idxfromij(10,13, 32, 32),
            Array2D.idxfromij(11,12, 32, 32),
            Array2D.idxfromij(12,12, 32, 32),
            Array2D.idxfromij(13,12, 32, 32),
            Array2D.idxfromij(14,12, 32, 32),
            Array2D.idxfromij(14,13, 32, 32),
            Array2D.idxfromij(10,15, 32, 32),
            Array2D.idxfromij(10,16, 32, 32),
            Array2D.idxfromij(11,16, 32, 32),
            Array2D.idxfromij(14,15, 32, 32),
            Array2D.idxfromij(13,16, 32, 32),
            Array2D.idxfromij(14,16, 32, 32),
            Array2D.idxfromij(14,11, 32, 32),
            */
        ]) {
            plvl.entities.push({
                cls: 'Tile',
                kind: 'wall',
                tileSize: Config.tileSize,
                baseAssetTag: 'twall',
                idx: idx,
                z: 1,
            });
        }

        /*
        // -- test floor
        for (const idx of [
            Array2D.idxfromij(18,11, 32, 32),
            Array2D.idxfromij(19,11, 32, 32),
            Array2D.idxfromij(17,12, 32, 32),
            Array2D.idxfromij(18,12, 32, 32),
            Array2D.idxfromij(16,13, 32, 32),
            Array2D.idxfromij(17,13, 32, 32),
            Array2D.idxfromij(18,13, 32, 32),
            Array2D.idxfromij(19,13, 32, 32),
            Array2D.idxfromij(16,14, 32, 32),
            Array2D.idxfromij(17,14, 32, 32),
            Array2D.idxfromij(18,14, 32, 32),
            Array2D.idxfromij(19,14, 32, 32),
            Array2D.idxfromij(17,15, 32, 32),
            Array2D.idxfromij(18,15, 32, 32),
            Array2D.idxfromij(20,14, 32, 32),
        ]) {
            plvl.entities.push({
                cls: 'Tile',
                kind: 'ground',
                tileSize: this.tileSize,
                baseAssetTag: 'floor',
                idx: idx,
                z: 0,
            });
        }
        */

        let x_player = Player.xspec({
            tag: 'pc',
            idx: plvl.spawnIdx,
            //idx: Array2D.idxfromij(20,12, 32, 32),
            //xform: new XForm({x:x, y:y, stretch: false}),
            x_sketch: Assets.get('pc'),
            //collider: new Collider({width: 20, height: 20}),
            maxSpeed: .25,
            ctrlid: 1,
            z: 2,
            healthMax: 100,
            losRange: Config.tileSize*5,
            team: 'player',
        });
        plvl.entities.push(x_player);

        plvl.entities.push(Object.assign(Assets.get('hack.1'), {
            idx: Array2D.idxfromdir(plvl.spawnIdx, Direction.south, plvl.cols, plvl.rows),
            z: 2,
        }));

        plvl.entities.push(Enemy.xspec({
            tag: 'enemy',
            idx: plvl.spawnIdx + 4,
            x_sketch: Assets.get('enemy'),
            maxSpeed: .25,
            ctrlid: 1,
            z: 2,
            losRange: Config.tileSize*8,
            aggroRange: Config.tileSize*5,
            resistances: { bonk: .25 },
        }));

        plvl.entities.push(Enemy.xspec({
            tag: 'enemy',
            idx: plvl.spawnIdx + 4,
            idx: Array2D.idxfromdir(plvl.spawnIdx+4, Direction.south, plvl.cols, plvl.rows),
            x_sketch: Assets.get('enemy'),
            maxSpeed: .15,
            z: 2,
            losRange: Config.tileSize*8,
            aggroRange: Config.tileSize*5,
        }));

        // -- pathfinding
        this.lvlgraph = new LevelGraph({
            lvl: this.lvl,
        })
        this.pathfinder = new Pathfinder({
            graph: this.lvlgraph,
            heuristicFcn: this.lvl.idxdist.bind(this.lvl),
            dbg: false,
        });

        // load level
        this.loadLevel(plvl);

        this.onPlayerUpdate = this.onPlayerUpdate.bind(this);
        this.player = Hierarchy.find(this.view, (v) => v.tag === 'pc');
        this.player.evt.listen(this.player.constructor.evtUpdated, this.onPlayerUpdate);
        this.onLoSUpdate({actor: this.player});
        this.player.addCharm( new FieryCharm() );

        this.wpn = Hierarchy.find(this.view, (v) => v.tag === 'hack.1');
        //console.log(`wpn: ${this.wpn} min: ${this.wpn.minx},${this.wpn.miny} max: ${this.wpn.maxx},${this.wpn.maxy}`);
        //console.log(`player: ${this.player} min: ${this.player.minx},${this.player.miny} max: ${this.player.maxx},${this.player.maxy}`);

        Systems.get('turn').leader = this.player;

        this.onLoSUpdate = this.onLoSUpdate.bind(this);
        Systems.get('los').evt.listen(Systems.get('los').constructor.evtUpdated, this.onLoSUpdate);


        /*
        console.log(`spawnidx: ${this.lvl.spawnIdx}`);

        let spawnIdx = this.lvl.spawnIdx;
        let x = this.lvl.data.ifromidx(spawnIdx) * 16;
        let y = this.lvl.data.jfromidx(spawnIdx) * 16;
        let x_player = Npc.xspec({
            tag: 'pc',
            xform: new XForm({x:x, y:y, stretch: false}),
            sketch: Assets.get('pc', true),
            //collider: new Collider({width: 20, height: 20}),
            maxSpeed: .4,
            ctrlid: 1,
            z: 1,
        });
        console.log(`pos: ${x},${y} x_player: ${Fmt.ofmt(x_player)}`);
        this.pidx = spawnIdx;
        this.player = Generator.generate(x_player);
        //console.log(`x_tile: ${Fmt.ofmt(x_tile)} tile: ${tile}}`);
        this.grid0.adopt(this.player);
        console.log(`player bounds: ${this.player.xform.getWorldBounds(false)}`);
        console.log(`grid bounds: ${this.grid0.xform.bounds}`);
        */

        this.camera = new Camera({view: this.slider, viewport: this.viewport, overflow: false, buffer: 0});
        this.camera.trackTarget(this.player);
        this.camera.evt.listen(this.camera.constructor.evtUpdated, (evt) => Events.trigger(RenderSystem.evtRenderNeeded));

    }

    loadLevel(plvl) {
        // clear old level data...
        // FIXME... 

        // resize UI elements for new level
        // -- resize slider/level to match level
        let width = plvl.cols * Config.tileSize;
        let height = plvl.rows * Config.tileSize;
        // -- resize scrollable area
        this.slider.resize(width, height, true);

        // instantiate level entities
        for (const x_e of plvl.entities) {
            //if (x_e.kind === 'wall') console.log(`x_e: ${Fmt.ofmt(x_e)}`);
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

        // trigger load complete
        Events.trigger('lvl.loaded', {lvl: this.lvl});
    }

    onPlayerUpdate(evt) {
        //console.log(`this.player.maxy: ${this.player.xform.y} ${this.player.maxy}`);
        //console.log(`twall.maxy: ${this.twall.xform.y} ${this.twall.maxy}`);
        //console.log(`onPlayerUpdate`);
        if (this.player.idx !== this.lastpidx) {
            this.lastpidx = this.player.idx;
        }
    }

    onLoSUpdate(evt) {
        //console.log(`onLoSUpdate`);
        if (evt.actor === this.player) {
            this.lvl.updateLoS(this.player.losIdxs);
        }
    }

    moveToIdx(idx) {
        let x = this.lvl.xfromidx(idx, true);
        let y = this.lvl.yfromidx(idx, true);
        // what's at index?
        for (const other of this.lvl.findidx(idx)) {
        //let bounds = new Bounds(x,y, 16,16);
        //for (const other of this.lvl.grid.findOverlaps(bounds)) {
            //console.log(`other: ${other}`);
            if (other.idx === idx && (this.player.blockedBy & other.blocks)) {
                if (other instanceof Enemy) {
                    console.log(`other is an enemy, try to attack...`);
                    TurnSystem.postLeaderAction( new MeleeAttackAction({
                        target: other,
                    }));
                } else {
                    console.log(`blocked from idx: ${this.player.idx} ${this.player.xform.x},${this.player.xform.y}, to: ${idx} ${x},${y} hit ${other}`);
                }
                return;
            }
        }
        //console.log(`move from idx: ${this.player.idx} ${this.player.xform.x},${this.player.xform.y}, to: ${idx} ${x},${y}`);
        TurnSystem.postLeaderAction( new MoveAction({ points: 2, x:x, y:y, accel: .001, snap: true, update: { idx: idx }}));
        //ActionSystem.assign(this.player, new UpdateAction({ update: { idx: idx}}));
        //ActionSystem.assign(this.player, new EndTurnAction());
    }

    wait() {
        TurnSystem.postLeaderAction(new WaitAction());
        //ActionSystem.assign(this.player, new EndTurnAction());
    }

    onKeyDown(evt) {
        //console.log(`${this.constructor.name} onKeyDown: ${Fmt.ofmt(evt)}`);
        switch (evt.key) {
            case '8': {
                Events.trigger(RenderSystem.evtRenderNeeded);
                break;
            }

            case '9': {
                Stats.enabled = !Stats.enabled;
                break;
            }

            case 'q': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.northWest);
                this.moveToIdx(nidx);
                break;
            }

            case 'w': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.north);
                this.moveToIdx(nidx);
                break;
            }

            case 'e': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.northEast);
                this.moveToIdx(nidx);
                break;
            }

            case 'a': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.west);
                this.moveToIdx(nidx);
                break;
            }

            case 'd': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.east);
                this.moveToIdx(nidx);
                break;
            }

            case 'z': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.southWest);
                this.moveToIdx(nidx);
                break;
            }

            case 'x': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.south);
                this.moveToIdx(nidx);
                break;
            }

            case 'c': {
                let nidx = this.lvl.idxfromdir(this.player.idx, Direction.southEast);
                this.moveToIdx(nidx);
                break;
            }

            case ' ': {
                this.wait();
                break;
            }

        }
    }

    onTock(evt) {
        Stats.count('game.tock')
        Stats.update(evt);
    }

    onLevelClick(evt) {
        console.log(`================================================================================`);
        console.log(`-- state onLevelClick`);
        let lmouse = this.lvl.xform.getLocal(new Vect(evt.mouse.x, evt.mouse.y));
        let idx = this.lvl.idxfromxy(lmouse.x, lmouse.y);
        console.log(`-- local: ${lmouse} idx: ${idx}`);

        this.dbg = true;

        let path = this.pathfinder.find(this.player, this.player.idx, idx);
        if (path) {
            //UxDbg.clear();
            //console.log(`path: ${Fmt.ofmt(path)}`);
            let lx = this.player.xform.x;
            let ly = this.player.xform.y;
            let first = true;
            for (const action of path.actions) {
                if (this.dbg && action.constructor.name === 'MoveAction') {
                    UxDbg.drawLine(lx, ly, action.x, action.y);
                    lx = action.x;
                    ly = action.y;
                }
                TurnSystem.postLeaderAction(action);
                /*
                ActionSystem.assign(this.player, action);
                if (action.points) {
                    ActionSystem.assign(this.player, new EndTurnAction());
                }
                */
            }
        }

    }

    stop() {
        Events.ignore(Keys.evtDown, this.onKeyDown);
        Events.ignore(Game.evtTock, this.onTock);
        this.view.destroy();
    }
}