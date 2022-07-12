export { PlayState };

import { MoveAction } from './base/actions/move.js';
import { Assets } from './base/assets.js';
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
import { UxText } from './base/uxText.js';
import { Text } from './base/text.js';
import { HealthRegenSystem } from './systems/healthRegenSystem.js';
import { FuelSystem } from './systems/fuelSystem.js';
import { ProcGen } from './procgen/procgen.js';

class PlayState extends GameState {
    async ready() {

        this.controlsActive = true;

        Systems.add('update', new UpdateSystem({dbg: Util.getpath(Config, 'dbg.system.update')}));
        Systems.add('move', new MoveSystem({ dbg: Util.getpath(Config, 'dbg.system.move')}));
        Systems.add('los', new LoSSystem({ dbg: Util.getpath(Config, 'dbg.system.los')}));
        Systems.add('turn', new TurnSystem({ dbg: Util.getpath(Config, 'dbg.system.turn')}));
        Systems.add('aggro', new AggroSystem({ dbg: Util.getpath(Config, 'dbg.system.aggro')}));
        Systems.add('close', new CloseSystem({ dbg: Util.getpath(Config, 'dbg.system.close')}));
        Systems.add('healthRegen', new HealthRegenSystem({ dbg: Util.getpath(Config, 'dbg.system.healthRegen')}));
        Systems.add('fuel', new FuelSystem({ dbg: Util.getpath(Config, 'dbg.system.fuel')}));

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
                    active: false,
                    visible: false,
                    x_xform: XForm.xspec({border: .1}),
                }),
                UxPanel.xspec({
                    tag: 'dbgroot',
                    sketch: Sketch.zero,
                    x_xform: XForm.xspec({ left: .75, right: .05, top: .1, bottom: .5}),
                    x_children: [
                        UxText.xspec({ text: new Text({text: '0 - show/hide debug', color: 'red', align: 'right'}), x_xform: XForm.xspec({top: 0/8, bottom: 1-1/8})}),
                        UxText.xspec({ text: new Text({text: '1 - show/hide los/fow', color: 'red', align: 'right'}), x_xform: XForm.xspec({top: 1/8, bottom: 1-2/8})}),
                        UxText.xspec({ text: new Text({text: '9 - show/hide stats in console', color: 'red', align: 'right'}), x_xform: XForm.xspec({top: 2/8, bottom: 1-3/8})}),
                        UxText.xspec({ text: new Text({text: '+ - zoom in', color: 'red', align: 'right'}), x_xform: XForm.xspec({top: 3/8, bottom: 1-4/8})}),
                        UxText.xspec({ text: new Text({text: '- - zoom out', color: 'red', align: 'right'}), x_xform: XForm.xspec({top: 4/8, bottom: 1-5/8})}),
                        UxText.xspec({ text: new Text({text: '<space> - end player turn', color: 'red', align: 'right'}), x_xform: XForm.xspec({top: 5/8, bottom: 1-6/8})}),
                        UxText.xspec({ text: new Text({text: 'qweadzxc - move player', color: 'red', align: 'right'}), x_xform: XForm.xspec({top: 6/8, bottom: 1-7/8})}),
                        UxText.xspec({ text: new Text({text: 'i - show/hide inventory', color: 'red', align: 'right'}), x_xform: XForm.xspec({top: 7/8, bottom: 1-8/8})}),
                    ],
                }),
            ],
        });

        // -- UI elements
        this.view = Generator.generate(x_view);
        this.slider = Hierarchy.find(this.view, (v) => v.tag === 'slider');
        this.viewport = Hierarchy.find(this.view, (v) => v.tag === 'viewport');
        this.lvl = Hierarchy.find(this.view, (v) => v.tag === 'lvl');
        this.inventory = Hierarchy.find(this.view, (v) => v.tag === 'inventory');
        this.hudroot = Hierarchy.find(this.view, (v) => v.tag === 'hudroot');
        this.dbgroot = Hierarchy.find(this.view, (v) => v.tag === 'dbgroot');

        // -- link UI elements to systems
        Systems.add('level', new LevelSystem({ slider: this.slider, lvl: this.lvl, dbg: Util.getpath(Config, 'dbg.system.level')}));
        Systems.get('los').lvl = this.lvl;
        Systems.get('close').lvl = this.lvl;

        // -- FIXME: player generation needs to get moved to procedural generation
        this.player = ProcGen.genPlayer(Config.template);
        /*
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
        */

        // -- FIXME: remove test charm
        this.player.addCharm( new FieryCharm() );
        this.lvl.adopt(this.player);
        this.inventory.setData(this.player.inventory);
        Systems.get('turn').leader = this.player;

        // -- camera
        this.camera = new Camera({view: this.slider, viewport: this.viewport, overflow: false, buffer: 0});
        this.camera.trackTarget(this.player);
        this.camera.evt.listen(this.camera.constructor.evtUpdated, (evt) => Events.trigger(RenderSystem.evtRenderNeeded));

        // -- pathfinding
        this.lvlgraph = new LevelGraph({
            lvl: this.lvl,
        })
        this.pathfinder = new Pathfinder({
            graph: this.lvlgraph,
            heuristicFcn: this.lvl.idxdist.bind(this.lvl),
            dbg: false,
        });

        // bind event handlers
        //this.onPlayerUpdate = this.onPlayerUpdate.bind(this);
        this.onLoSUpdate = this.onLoSUpdate.bind(this);
        //this.player.evt.listen(this.player.constructor.evtUpdated, this.onPlayerUpdate);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onTock = this.onTock.bind(this);
        this.onLevelClick = this.onLevelClick.bind(this);
        this.onLevelWanted = this.onLevelWanted.bind(this);
        this.onLevelLoaded = this.onLevelLoaded.bind(this);
        this.onLoSUpdate({actor: this.player});
        Systems.get('los').evt.listen(Systems.get('los').constructor.evtUpdated, this.onLoSUpdate);
        this.lvl.evt.listen(this.lvl.constructor.evtMouseClicked, this.onLevelClick);
        Events.listen(Keys.evtDown, this.onKeyDown);
        Events.listen(Game.evtTock, this.onTock);
        Events.listen(LevelSystem.evtWanted, this.onLevelWanted);
        Events.listen(LevelSystem.evtLoaded, this.onLevelLoaded);

        // -- load level
        Events.trigger(LevelSystem.evtWanted, { level: 1 });

    }

    onLevelWanted(evt) {
        // disable controls
        this.controlsActive = false;
    }
        
    onLevelLoaded(evt) {
        // update player position
        let idx = (evt.goingUp) ? evt.plvl.startIdx : evt.plvl.exitIdx;
        let wantx = this.lvl.grid.xfromidx(idx, true);
        let wanty = this.lvl.grid.yfromidx(idx, true);
        UpdateSystem.eUpdate(this.player, { idx: idx, xform: {x: wantx, y: wanty }});
        // re-enable controls
        this.controlsActive = true;
    }

    onLoSUpdate(evt) {
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
            //console.log(`other is an enemy, try to attack...`);
            TurnSystem.postLeaderAction( new MeleeAttackAction({
                target: target,
            }));
        } else if (others.some((v) => v instanceof Stairs)) {
            let target = others.find((v) => v instanceof Stairs);
            //console.log(`stairs ${target} is hit`);
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
            TurnSystem.postLeaderAction( new PickupAction({ target: target, sfx: Assets.get('player.pickup', true)}));
        } else if (others.some((v) => this.player.blockedBy & v.blocks)) {
            //console.log(`blocked from idx: ${this.player.idx} ${this.player.xform.x},${this.player.xform.y}, to: ${idx} ${x},${y} hit ${others}`);
        } else {
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

            case '0': {
                let toggle = this.dbgroot.active;
                this.dbgroot.active = !toggle;
                this.dbgroot.visible = !toggle;
                break;
            }

            case '1': {
                let toggle = this.lvl.fowEnabled;
                this.lvl.fowEnabled = !toggle;
                this.lvl.losEnabled = !toggle;
                for (const gidx of this.lvl.grid.keys()) this.lvl.gidupdates.add(gidx);
                this.lvl.evt.trigger(this.lvl.constructor.evtUpdated, {actor: this.lvl});
                break;
            }

            // FIXME: remove
            case '8': {
                UpdateSystem.eUpdate(this.player, {health: this.player.health - 10});
                console.log(`-- player health: ${this.player.health}/${this.player.healthMax} fuel: ${this.player.fuel}`);
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
                console.log(`-- player health: ${this.player.health}/${this.player.healthMax} fuel: ${this.player.fuel}`);
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
            UxDbg.clear();
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
            }
        }

    }

    stop() {
        Events.ignore(Keys.evtDown, this.onKeyDown);
        Events.ignore(Game.evtTock, this.onTock);
        this.view.destroy();
    }
}