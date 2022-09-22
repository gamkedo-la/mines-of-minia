export { PlayState };

import { Assets } from './base/assets.js';
import { Camera } from './base/camera.js';
import { Config } from './base/config.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Game } from './base/game.js';
import { GameState } from './base/gameState.js';
import { Generator } from './base/generator.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
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
import { XForm } from './base/xform.js';
import { Level } from './level.js';
import { LoSSystem } from './systems/losSystem.js';
import { TurnSystem } from './systems/turnSystem.js';
import { AggroSystem } from './systems/aggroSystem.js';
import { FieryCharm } from './charms/fiery.js';
import { LevelSystem } from './systems/levelSystem.js';
import { CloseSystem } from './systems/closeSystem.js';
import { Inventory } from './inventory.js';
import { UxText } from './base/uxText.js';
import { Text } from './base/text.js';
import { HealthRegenSystem } from './systems/healthRegenSystem.js';
import { FuelSystem } from './systems/fuelSystem.js';
import { ProcGen } from './procgen/procgen.js';
import { PowerRegenSystem } from './systems/powerRegenSystem.js';
import { XPSystem } from './systems/xpSystem.js';
import { AimHandler } from './aimHandler.js';
import { InteractHandler } from './interactHandler.js';
import { Hud } from './hud.js';
import { OverlaySystem } from './systems/overlaySystem.js';
import { TriggerSystem } from './systems/triggerSystem.js';
import { Serialization } from './serialization.js';
import { Cog } from './entities/cog.js';
import { Gem } from './entities/gem.js';
import { DetectSystem } from './systems/detectSystem.js';
import { ScanAction } from './actions/scan.js';
import { DazedCharm } from './charms/dazed.js';
import { WaitAction } from './base/actions/wait.js';
import { RagingBull } from './entities/ragingBull.js';
import { Direction } from './base/dir.js';
import { StealthBot } from './entities/stealthBot.js';
import { TalentSystem } from './systems/talentSystem.js';
import { Talents } from './talents.js';

class PlayState extends GameState {
    async init(data={}) {
        // -- initialize systems
        Systems.add('update', new UpdateSystem({dbg: Util.getpath(Config, 'dbg.system.update')}));
        Systems.add('move', new MoveSystem({ dbg: Util.getpath(Config, 'dbg.system.move')}));
        Systems.add('los', new LoSSystem({ dbg: Util.getpath(Config, 'dbg.system.los')}));
        Systems.add('turn', new TurnSystem({ dbg: Util.getpath(Config, 'dbg.system.turn')}));
        Systems.add('aggro', new AggroSystem({ dbg: Util.getpath(Config, 'dbg.system.aggro')}));
        Systems.add('close', new CloseSystem({ dbg: Util.getpath(Config, 'dbg.system.close')}));
        Systems.add('healthRegen', new HealthRegenSystem({ dbg: Util.getpath(Config, 'dbg.system.healthRegen')}));
        Systems.add('powerRegen', new PowerRegenSystem({ dbg: Util.getpath(Config, 'dbg.system.powerRegen')}));
        Systems.add('fuel', new FuelSystem({ dbg: Util.getpath(Config, 'dbg.system.fuel')}));
        Systems.add('xp', new XPSystem({ dbg: Util.getpath(Config, 'dbg.system.xp')}));
        Systems.add('overlay', new OverlaySystem({ dbg: Util.getpath(Config, 'dbg.system.overlay')}));
        Systems.add('trigger', new TriggerSystem({ dbg: Util.getpath(Config, 'dbg.system.trigger')}));
        Systems.add('level', new LevelSystem({ dbg: Util.getpath(Config, 'dbg.system.level')}));
        Systems.add('detect', new DetectSystem({ dbg: Util.getpath(Config, 'dbg.system.detect')}));
        Systems.add('talent', new TalentSystem({ dbg: Util.getpath(Config, 'dbg.system.talent')}));
    }

    async ready(data={}) {
        this.controlsActive = true;
        this.maxIndex = 0;

        let x_view = UxCanvas.xspec({
            cvsid: 'game.canvas',
            tag: 'cvs.0',
            x_children: [
                UxMask.xspec({
                    tag: 'viewport',
                    x_xform: XForm.xspec({border: .05}),
                    //dbg: { viewMask: true },
                    x_children: [
                        UxPanel.xspec({
                            tag: 'slider',
                            sketch: Sketch.zero,
                            x_xform: XForm.xspec({stretch: false, scalex: Config.scale, scaley: Config.scale, width: 50, height: 50}),
                            x_children: [
                                Level.xspec({
                                    losEnabled: Config.losEnabled,
                                    fowEnabled: Config.fowEnabled,
                                    tag: 'lvl',
                                    tileSize: Config.tileSize,
                                    x_xform: XForm.xspec({origx: 0, origy:0}),
                                }),
                                UxDbg.xspec({
                                    tag: UxDbg.dfltTag,
                                    x_xform: XForm.xspec({origx: 0, origy:0}),
                                }),
                                UxPanel.xspec({
                                    tag: 'overlay',
                                    sketch: Sketch.zero,
                                }),
                            ],
                        }),
                    ],
                }),
                UxPanel.xspec({
                    tag: 'hudroot',
                    sketch: Sketch.zero,
                    x_children: [
                        Hud.xspec({
                            tag: 'hud',
                            doSave: this.doSave.bind(this),
                            doScan: this.doScan.bind(this),
                            getCurrentHandler: () => this.currentHandler,
                        }),
                    ],
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
        this.overlay = Hierarchy.find(this.view, (v) => v.tag === 'overlay');
        this.hudroot = Hierarchy.find(this.view, (v) => v.tag === 'hudroot');
        this.dbgroot = Hierarchy.find(this.view, (v) => v.tag === 'dbgroot');
        this.hud = Hierarchy.find(this.view, (v) => v.tag === 'hud');

        // -- link UI elements to systems
        Systems.get('level').lvl = this.lvl;
        Systems.get('level').slider = this.slider;
        Systems.get('los').lvl = this.lvl;
        Systems.get('close').lvl = this.lvl;
        Systems.get('overlay').overlay = this.overlay;
        Systems.get('overlay').hud = this.hudroot;
        Systems.get('detect').lvl = this.lvl;

        // load player
        if (data && data.load) {
            this.player = Serialization.loadPlayer();
            this.setPlayerIdx = false;
        } else {
            this.player = ProcGen.genPlayer(Config.template);
            this.setPlayerIdx = true;
        }
        this.lvl.adopt(this.player);
        Systems.get('turn').leader = this.player;
        this.hud.linkPlayer(this.player);

        // -- camera
        this.camera = new Camera({view: this.slider, viewport: this.viewport, overflow: false, buffer: 0});
        this.camera.trackTarget(this.player);
        this.camera.evt.listen(this.camera.constructor.evtUpdated, (evt) => Events.trigger(RenderSystem.evtRenderNeeded));
        // -- hackety hack hack
        this.lvl.camera = this.camera;
        this.lvl.player = this.player;

        // bind event handlers
        this.onLoSUpdate = this.onLoSUpdate.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onTock = this.onTock.bind(this);
        this.onLevelWanted = this.onLevelWanted.bind(this);
        this.onLevelLoaded = this.onLevelLoaded.bind(this);
        this.onHandlerWanted = this.onHandlerWanted.bind(this);
        this.onTurnDone = this.onTurnDone.bind(this);
        this.onLoSUpdate({actor: this.player});
        Systems.get('los').evt.listen(Systems.get('los').constructor.evtUpdated, this.onLoSUpdate);
        Events.listen(Keys.evtDown, this.onKeyDown);
        Events.listen(Game.evtTock, this.onTock);
        Events.listen('handler.wanted', this.onHandlerWanted);
        Events.listen(LevelSystem.evtWanted, this.onLevelWanted);
        Events.listen(LevelSystem.evtLoaded, this.onLevelLoaded);
        Events.listen(TurnSystem.evtDone, this.onTurnDone)

        // -- load level
        // what level?
        let lvl = 1;
        if (data && data.load) {
            let gameState = Serialization.loadGameState();
            lvl = gameState.index;
            this.maxIndex = gameState.maxIndex;
            let cogState = Serialization.loadCogState();
            console.log(`cogState: ${Fmt.ofmt(cogState)}`);
            Cog.init(cogState);
            let gemState = Serialization.loadGemState();
            Gem.init(gemState);
            console.log(`-- level load`)
            // system state
            let systemState = Serialization.loadSystemState();
            if (systemState.talent) {
                Systems.get('talent').load(systemState.talent);
            }
        } else {
            ProcGen.genDiscovery(Config.template);
            console.log(`-- level new`)
        }
        Events.trigger(LevelSystem.evtWanted, { level: lvl, load: data && data.load });

        // setup input handler
        this.handler;
        this.loadHandler('interact');

    }

    onLevelWanted(evt) {
        // disable controls
        this.controlsActive = false;
    }
        
    onLevelLoaded(evt) {
        //console.log(`${this} onLevelLoaded`);
        if (this.lvl.index > this.maxIndex) {
            this.maxIndex = this.lvl.index;
            console.log(`-- new max level index: ${this.maxIndex}`);
        }
        // update player position
        let idx = this.player.idx;
        if (this.setPlayerIdx) {
            idx = (evt.goingUp) ? evt.plvl.startIdx : evt.plvl.exitIdx;
        }
        //idx = (evt.goingUp) ? evt.plvl.startIdx : evt.plvl.exitIdx;
        let wantx = this.lvl.grid.xfromidx(idx, true);
        let wanty = this.lvl.grid.yfromidx(idx, true);
        UpdateSystem.eUpdate(this.player, { idx: idx, xform: {x: wantx, y: wanty }});
        // force update to player los
        Systems.get('los').setLoS(this.player);
        // re-enable controls
        this.controlsActive = true;
    }

    onLoSUpdate(evt) {
        if (evt.actor === this.player) {
            //console.log(`${this} onLoSUpdate`);
            this.lvl.updateLoS(this.player.losIdxs);
        }
    }

    onHandlerWanted(evt) {
        //console.log(`-- ${this} onHandlerWanted: ${Fmt.ofmt(evt)}`);
        this.loadHandler(evt.which, evt);
    }

    onTurnDone(evt) {
        //console.log(`-- ${this} onTurnDone: ${Fmt.ofmt(evt)}`);
        if (evt.which !== 'follower') return;
        // handle dazed
        if (DazedCharm.isDazed(this.player)) {
            TurnSystem.postLeaderAction(new WaitAction());
            return;
        }
        // re-enable interact handler
        if (!this.handler) {
            this.loadHandler('interact');
        }
    }

    loadHandler(which, evt={}) {
        this.currentHandler = which;
        if (this.handler) {
            this.handler.destroy();
            //console.log(`-- clearing handler: ${this.handler}`);
            this.handler = null;
        }
        switch(which) {
            case 'aim': {
                this.handler = new AimHandler({
                    lvl: this.lvl,
                    player: this.player,
                    overlay: this.overlay,
                    shooter: evt.shooter,
                });
                break;
            }
            case 'interact': {
                this.handler = new InteractHandler({
                    lvl: this.lvl,
                    player: this.player,
                    overlay: this.overlay,
                });
            }
        }
        if (this.handler) {
            this.handler.evt.listen(this.handler.constructor.evtDestroyed, ()=>{
                //console.log(`-- removing destroyed handler: ${this.handler}`);
                this.handler = null;
            });
        }
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
            case '7': {
                UpdateSystem.eUpdate(this.player, {
                    lvl: this.player.lvl+1,
                });
                console.log(`-- lvl up`);
                break;
            }
            case '8': {
                UpdateSystem.eUpdate(this.player, {
                    health: this.player.health - 10,
                    power: this.player.power - 5,
                });
                console.log(`-- player health: ${this.player.health}/${this.player.healthMax} fuel: ${this.player.fuel} power: ${this.player.power}`);
                break;
            }

            case '9': {
                Stats.enabled = !Stats.enabled;
                break;
            }

            case 'i': {
                let toggle;

                if (this.inventory) {
                    toggle = false;
                    //console.log(`-- destroy inventory: ${this.inventory}`);
                    this.inventory.destroy();
                    this.inventory = null;
                } else {
                    toggle = true;

                    this.inventory = new Inventory({
                        tag: 'inventory',
                        xform: new XForm({border: .1}),
                        data: this.player.inventory,
                    });
                    this.inventory.evt.listen(this.inventory.constructor.evtDestroyed, () => {
                        this.inventory = null;
                        this.lvl.active = true;
                    });
                    //console.log(`-- new inventory: ${this.inventory}`)
                    this.hudroot.adopt(this.inventory);

                }
                this.lvl.active = !toggle;
                break;
            }

            case 't': {
                let toggle;
                if (this.talents) {
                    toggle = false;
                    this.talents.destroy();
                    this.talents = null;
                } else {
                    toggle = true;
                    this.talents = new Talents({
                        tag: 'talents',
                        xform: new XForm({border: .1}),
                    });
                    this.talents.evt.listen(this.talents.constructor.evtDestroyed, () => {
                        this.talents = null;
                        this.lvl.active = true;
                    });
                    this.hudroot.adopt(this.talents);
                }
                this.lvl.active = !toggle;
                console.log(`this.lvl active: ${this.lvl.active}`);
                break;
            }


        }
    }

    onTock(evt) {
        Stats.count('game.tock')
        Stats.update(evt);
    }

    stop() {
        for (const child of Hierarchy.children(this.view)) {
            child.destroy();
        }
        this.view.destroy();
        this.camera.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
        Events.ignore(Game.evtTock, this.onTock);
        Events.ignore('handler.wanted', this.onHandlerWanted);
        Events.ignore(LevelSystem.evtWanted, this.onLevelWanted);
        Events.ignore(LevelSystem.evtLoaded, this.onLevelLoaded);
        Events.ignore(TurnSystem.evtDone, this.onTurnDone)
        LevelSystem.currentLevelIndex = 0;
    }

    doSave() {
        Serialization.save(this);
        Events.trigger(OverlaySystem.evtNotify, {which: 'info', msg: `game saved`});
    }

    doScan() {
        if (!this.currentHandler === 'interact') return;
        let action = new ScanAction({
            lvl: this.lvl,
        });
        TurnSystem.postLeaderAction(action);
    }

}