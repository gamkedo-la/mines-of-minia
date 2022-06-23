export { FiddleState };

import { MoveAction } from './base/actions/move.js';
import { WaitAction } from './base/actions/wait.js';
import { Assets } from './base/assets.js';
import { Bindings } from './base/bindings.js';
import { Camera } from './base/camera.js';
import { Collider } from './base/collider.js';
import { Config } from './base/config.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { GameState } from './base/gameState.js';
import { Generator } from './base/generator.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Random } from './base/random.js';
import { Systems } from './base/system.js';
import { ActionSystem } from './base/systems/actionSystem.js';
import { CollisionSystem } from './base/systems/collisionSystem.js';
import { CtrlSystem } from './base/systems/ctrlSystem.js';
import { MoveSystem } from './base/systems/moveSystem.js';
import { RenderSystem } from './base/systems/renderSystem.js';
import { UpdateSystem } from './base/systems/updateSystem.js';
import { Text } from './base/text.js';
import { Util } from './base/util.js';
import { UxButton } from './base/uxButton.js';
import { UxCanvas } from './base/uxCanvas.js';
import { UxGrid } from './base/uxGrid.js';
import { UxInput } from './base/uxInput.js';
import { UxMask } from './base/uxMask.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxToggle } from './base/uxToggle.js';
import { XForm } from './base/xform.js';
import { Character } from './entities/character.js';

class FiddleState extends GameState {

    async ready() {
        this.entities = [];

        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);

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
        Systems.add('ctrl', new CtrlSystem({bindings: bindings, ctrlid: 1, dbg: Util.getpath(Config, 'dbg.system.ctrl')}));
        Systems.add('move', new MoveSystem({ dbg: Util.getpath(Config, 'dbg.system.move')}));
        Systems.add('collision', new CollisionSystem({findBounds: (bounds, filter) => this.entities.filter(filter)}));

        let x_view = UxCanvas.xspec({
            cvsid: 'game.canvas',
            tag: 'cvs.0',
            resize: true,
            x_children: [
                UxMask.xspec({
                    tag: 'camera',
                    x_xform: XForm.xspec({border: .1}),
                    dbg: { viewMask: true },
                    x_children: [
                        UxToggle.xspec({
                            x_xform: XForm.xspec({top: .1, bottom: .8, left: .8, right: .1}),
                            x_iconXform: XForm.xspec({border: .1}),
                        }),
                        UxText.xspec({
                            x_text: Text.xspec({text: 'hi there', color: 'red', highlightColor: 'yellow'}),
                            x_xform: XForm.xspec({top: .2, bottom: .7, left: .8, right: .1}),
                        }),
                        UxButton.xspec({
                            x_text: Text.xspec({text: 'button', color: 'green'}),
                            x_xform: XForm.xspec({top: .3, bottom: .6, left: .8, right: .1}),
                        }),
                        UxInput.xspec({
                            x_text: Text.xspec({text: 'input', color: 'blue', align: 'left'}),
                            x_xform: XForm.xspec({top: .4, bottom: .5, left: .8, right: .1}),
                            x_textXform: XForm.xspec({top: .2, bottom: .2}),
                        }),
                        UxPanel.xspec({
                            tag: 'slider',
                            x_xform: XForm.xspec({right: -.5, bottom: -.25}),
                            dbg: { viewXform: true },
                            x_children: [
                                UxGrid.xspec({
                                    tag: 'grid.0',
                                    x_xform: XForm.xspec({border: .1}),
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });

        this.view = Generator.generate(x_view);
        console.log(`view: ${this.view}`);

        this.viewport = Hierarchy.find(this.view, (v) => v.tag === 'camera');
        this.slider = Hierarchy.find(this.view, (v) => v.tag === 'slider');
        this.grid0 = Hierarchy.find(this.view, (v) => v.tag === 'grid.0');

        let testModels = [
            Character.xspec({
                tag: 'npc.1',
                xform: new XForm({x: 100, y:50, stretch: false}),
                sketch: Assets.get('fairy.static', true),
                collider: new Collider({width: 20, height: 20}),
                maxSpeed: .4,
                ctrlid: 1,
            }),

            Character.xspec({
                tag: 'npc.2',
                xform: new XForm({x: 160, y:50, stretch: false}),
                sketch: Assets.get('torch', true),
                collider: new Collider({width: 20, height: 20}),
            }),

            Character.xspec({
                tag: 'npc.3',
                state: 'one',
                xform: new XForm({x: 100, y:100, stretch: false}),
                collider: new Collider({x: 0, y: 0, width: 20, height: 20}),
                sketch: Assets.get('one.two', true),
            }),

        ];

        for (const x_model of testModels) {
            let model = this.addModel(this.grid0, x_model);
        }


        this.npc = Hierarchy.find(this.slider, (v) => v.tag === 'npc.1');
        this.camera = new Camera({view: this.slider, viewport: this.viewport, overflow: false, buffer: 0});
        this.camera.trackTarget(this.npc);
        this.camera.evt.listen(this.camera.constructor.evtUpdated, (evt) => Events.trigger(RenderSystem.evtRenderNeeded));
        //Minia.systems.render.active=true);
        this.npc3 = Hierarchy.find(this.slider, (v) => v.tag === 'npc.3');

    }

    addModel(parent, x_model) {
        console.log(`model spec: ${Fmt.ofmt(x_model)}`);
        let model = Generator.generate(x_model);
        parent.adopt(model);
        this.entities.push(model);
        return model;
    }

    onKeyDown(evt) {
        console.log(`onKeyDown: ${Fmt.ofmt(evt)}`);
        if (evt.key === '1') {
            if (this.npc3) {
                let state = (this.npc3.state === "one") ? "two" : "one";
                console.log(`state: ${state}`);
                UpdateSystem.eUpdate(this.npc3, {state: state});
            }
        }
        if (evt.key === '2') {
            let choices = [
                () => new WaitAction({ttl: 2000}),
                () => new MoveAction({x: Random.rangeInt(1,800), y: Random.rangeInt(1,600), accel: .001}),
            ];
            if (!('which' in this)) {
                console.log(`setting zero`);
                this.which = 0;
            } else {
                this.which = (this.which + 1) % choices.length;
            }
            let action = choices[this.which]();
            console.log(`==> action: ${action} to ${this.npc.actions}`);
            ActionSystem.assign(this.npc, action);
            action.evt.listen('action.done', () => console.log(`${action} done`));
        }
    }

    stop() {
        Systems.remove('collision');
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

}