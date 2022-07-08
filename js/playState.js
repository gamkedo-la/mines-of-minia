export { PlayState };

import { MoveAction } from './base/actions/move.js';
import { Array2D } from './base/array2d.js';
import { Assets } from './base/assets.js';
import { Bindings } from './base/bindings.js';
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
import { Pathfinder } from './base/pathfinder.js';
import { Sketch } from './base/sketch.js';
import { Stats } from './base/stats.js';
import { Systems } from './base/system.js';
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
import { LoSSystem } from './systems/losSystem.js';
import { TurnSystem } from './systems/turnSystem.js';
import { AggroSystem } from './systems/aggroSystem.js';
import { Enemy } from './entities/enemy.js';
import { WaitAction } from './base/actions/wait.js';
import { MeleeAttackAction } from './actions/attack.js';
import { Player } from './entities/player.js';
import { FieryCharm } from './charms/fiery.js';
import { Stairs } from './entities/stairs.js';
import { LevelSystem } from './systems/levelSystem.js';
import { PickupAction } from './actions/pickup.js';
import { TakeStairsAction } from './actions/takeStairs.js';
import { OpenAction } from './actions/open.js';
import { Door } from './entities/door.js';
import { CloseSystem } from './systems/closeSystem.js';
import { Inventory } from './inventory.js';


class PlayState extends GameState {
    async ready() {

        this.controlsActive = true;

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
        Systems.add('close', new CloseSystem({ dbg: Util.getpath(Config, 'dbg.system.close')}));

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onTock = this.onTock.bind(this);
        this.onLevelClick = this.onLevelClick.bind(this);
        this.onLevelWanted = this.onLevelWanted.bind(this);
        this.onLevelLoaded = this.onLevelLoaded.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        Events.listen(Game.evtTock, this.onTock);
        Events.listen(LevelSystem.evtWanted, this.onLevelWanted);
        Events.listen(LevelSystem.evtLoaded, this.onLevelLoaded);
        let x_view = UxCanvas.xspec({
            cvsid: 'game.canvas',
            tag: 'cvs.0',
            x_children: [
                UxMask.xspec({
                    tag: 'viewport',
                    x_xform: XForm.xspec({border: .05}),
                    dbg: { viewMask: true },
                    x_children: [
                        UxPanel.xspec({
                            tag: 'slider',
                            sketch: Sketch.zero,
                            x_xform: XForm.xspec({stretch: false, scalex: Config.scale, scaley: Config.scale, width: 50, height: 50}),
                            //dbg: { xform: true },
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
                UxPanel.xspec({
                    tag: 'hudroot',
                    sketch: Sketch.zero,
                }),
                Inventory.xspec({
                    tag: 'inventory',
                    x_xform: XForm.xspec({border: .1}),
                }),
            ],
        });


        this.view = Generator.generate(x_view);
        //console.log(`view: ${this.view}`);

        this.slider = Hierarchy.find(this.view, (v) => v.tag === 'slider');
        this.slider.resize(400,400);

        this.viewport = Hierarchy.find(this.view, (v) => v.tag === 'viewport');
        this.lvl = Hierarchy.find(this.view, (v) => v.tag === 'lvl');

        this.inventory = Hierarchy.find(this.view, (v) => v.tag === 'inventory');
        this.inventory.visible = false;
        this.inventory.active = false;

        this.hudroot = Hierarchy.find(this.view, (v) => v.tag === 'hudroot');

        Systems.add('level', new LevelSystem({ slider: this.slider, lvl: this.lvl, dbg: Util.getpath(Config, 'dbg.system.level')}));

        this.lvl.evt.listen(this.lvl.constructor.evtMouseClicked, this.onLevelClick);
        //console.log(`this.lvl: ${this.lvl}`);
        //this.lvl.grid.dbg = true;


        Systems.get('los').lvl = this.lvl;
        Systems.get('close').lvl = this.lvl;

        this.template = Config.template;

        /*
        let plvl;
        if (true) {
            plvl = ProcGen.genLvl(this.template);
        } else {
            plvl = new ProcLevel({ cols: 32, rows: 32, })
            plvl.startIdx = Array2D.idxfromij(16,12, 32, 32);
        }
        */


        this.player = new Player({
            tag: 'pc',
            idx: 0,
            xform: new XForm({ stretch: false }),
            sketch: Assets.get('player', true),
            maxSpeed: .25,
            z: 2,
            healthMax: 100,
            losRange: Config.tileSize*5,
            team: 'player',
        });

        this.inventory.setData(this.player.inventory);

        //let a1 = Assets.get('player.idler', true);
        //let a2 = Assets.get('player', true);
        //console.log(`a1: ${a1} cel0: ${a1.cels[0]} img: ${Fmt.ofmt(a1.cels[0].sketch.img)}`);
        //console.log(`a2: ${a2} sketch: ${a2.sketch} cel0: ${a2.sketch.cels[0]} img: ${Fmt.ofmt(a2.sketch.cels[0].sketch.img)}`);

        // -- pathfinding
        this.lvlgraph = new LevelGraph({
            lvl: this.lvl,
        })
        this.pathfinder = new Pathfinder({
            graph: this.lvlgraph,
            heuristicFcn: this.lvl.idxdist.bind(this.lvl),
            dbg: false,
        });

        //console.log(`=== player sketch: ${this.player.sketch} cel0.sketch: ${Fmt.ofmt(this.player.sketch.cels[0].sketch)}`);

        // load level
        // trigger want level event
        Events.trigger(LevelSystem.evtWanted, { level: 1 });
        //this.loadLevel(plvl);

        this.onPlayerUpdate = this.onPlayerUpdate.bind(this);
        //this.player = Hierarchy.find(this.view, (v) => v.tag === 'pc');
        this.player.evt.listen(this.player.constructor.evtUpdated, this.onPlayerUpdate);
        this.onLoSUpdate({actor: this.player});
        this.player.addCharm( new FieryCharm() );
        this.lvl.adopt(this.player);

        //this.wpn = Hierarchy.find(this.view, (v) => v.tag === 'hack.1');
        //console.log(`wpn: ${this.wpn} min: ${this.wpn.minx},${this.wpn.miny} max: ${this.wpn.maxx},${this.wpn.maxy}`);
        //console.log(`player: ${this.player} min: ${this.player.minx},${this.player.miny} max: ${this.player.maxx},${this.player.maxy}`);

        Systems.get('turn').leader = this.player;

        this.onLoSUpdate = this.onLoSUpdate.bind(this);
        Systems.get('los').evt.listen(Systems.get('los').constructor.evtUpdated, this.onLoSUpdate);


        this.camera = new Camera({view: this.slider, viewport: this.viewport, overflow: false, buffer: 0});
        this.camera.trackTarget(this.player);
        this.camera.evt.listen(this.camera.constructor.evtUpdated, (evt) => Events.trigger(RenderSystem.evtRenderNeeded));

    }

    onLevelWanted(evt) {
        console.log(`-- controls disabled`);
        // disable controls
        this.controlsActive = false;
    }
        
    onLevelLoaded(evt) {
        // resize UI elements for new level
        // -- resize slider/level to match level
        /*
        let width = evt.plvl.cols * Config.tileSize;
        let height = evt.plvl.rows * Config.tileSize;
        // -- resize scrollable area
        this.slider.resize(width, height, true);
        console.log(`on LevelLoaded width: ${width} height: ${height}`);
        */

        // update player position
        let idx = (evt.goingUp) ? evt.plvl.startIdx : evt.plvl.exitIdx;
        let wantx = this.lvl.grid.xfromidx(idx, true);
        let wanty = this.lvl.grid.yfromidx(idx, true);
        UpdateSystem.eUpdate(this.player, { idx: idx, xform: {x: wantx, y: wanty }});

        console.log(`adjust player: ${idx} ${wantx},${wanty}`);

        // re-enable controls
        this.controlsActive = true;
        console.log(`-- controls enabled`);
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
        let facing = (x > this.player.xform.x) ? Direction.east : (x < this.player.xform.x) ? Direction.west : 0;
        // what's at index?
        let others = Array.from(this.lvl.findidx(idx, (v) => v.idx === idx));

        if (others.some((v) => v instanceof Enemy)) {
            let target = others.find((v) => v instanceof Enemy);
            console.log(`other is an enemy, try to attack...`);
            TurnSystem.postLeaderAction( new MeleeAttackAction({
                target: target,
            }));
        } else if (others.some((v) => v instanceof Stairs)) {
            let target = others.find((v) => v instanceof Stairs);
            console.log(`stairs ${target} is hit`);
            TurnSystem.postLeaderAction( new MoveAction({ points: 2, x:x, y:y, accel: .001, snap: true, update: { idx: idx }}));
            TurnSystem.postLeaderAction( new TakeStairsAction({ stairs: target }));
        } else if (others.some((v) => v instanceof Door)) {
            let target = others.find((v) => v instanceof Door);
            if (target.state === 'close') {
                TurnSystem.postLeaderAction( new OpenAction({ target: target }));
            } else {
                TurnSystem.postLeaderAction( new MoveAction({ points: 2, x:x, y:y, accel: .001, snap: true, facing: facing, update: { idx: idx } }));
            }
        } else if (others.some((v) => v.constructor.lootable)) {
            let target = others.find((v) => v.constructor.lootable);
            TurnSystem.postLeaderAction( new PickupAction({ target: target }));
        } else if (others.some((v) => this.player.blockedBy & v.blocks)) {
            console.log(`blocked from idx: ${this.player.idx} ${this.player.xform.x},${this.player.xform.y}, to: ${idx} ${x},${y} hit ${others}`);
        } else {
            //TurnSystem.postLeaderAction( new MoveAction({ points: 2, x:x, y:y, accel: .001, snap: true, update: { idx: idx }}));
            TurnSystem.postLeaderAction( new MoveAction({ points: 2, x:x, y:y, accel: .001, snap: true, facing: facing, update: { idx: idx } }));
        }

    }

    wait() {
        TurnSystem.postLeaderAction(new WaitAction());
        //ActionSystem.assign(this.player, new EndTurnAction());
    }

    onKeyDown(evt) {
        //console.log(`-- ${this.constructor.name} onKeyDown: ${Fmt.ofmt(evt)}`);
        if (!this.controlsActive) {
            console.log(`-- controls disabled, skip onKeyDown evt: ${Fmt.ofmt(evt)}`);
            return;
        }
        switch (evt.key) {
            case '-': {
                this.slider.xform.scalex -= .5;
                this.slider.xform.scaley -= .5;
                if (this.slider.xform.scalex < 1) this.slider.xform.scalex = 1;
                if (this.slider.xform.scaley < 1) this.slider.xform.scaley = 1;
                this.slider.evt.trigger(this.viewport.constructor.evtUpdated, {actor: this});
                break;
            }
            case '+': 
            case '=': {
                this.slider.xform.scalex += .5;
                this.slider.xform.scaley += .5;
                if (this.slider.xform.scalex > 6) this.slider.xform.scalex = 6;
                if (this.slider.xform.scaley > 6) this.slider.xform.scaley = 6;
                this.slider.evt.trigger(this.viewport.constructor.evtUpdated, {actor: this});
                break;
            }

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

            case 'i': {
                let toggle = this.inventory.active;
                //this.inventory = new Inventory();
                this.inventory.visible = !toggle;
                this.inventory.active = !toggle;
                this.lvl.active = toggle;
                break;
            }

            case 'l': {
                let toggle = this.lvl.fowEnabled;
                this.lvl.fowEnabled = !toggle;
                this.lvl.losEnabled = !toggle;
                console.log(`this.lvl.fowEnabled: ${this.lvl.fowEnabled} ${this.lvl.losEnabled}`);
                for (const gidx of this.lvl.grid.keys()) this.lvl.gidupdates.add(gidx);
                this.lvl.evt.trigger(this.lvl.constructor.evtUpdated, {actor: this.lvl});
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
        if (!this.controlsActive) return;
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