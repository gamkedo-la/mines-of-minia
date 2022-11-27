export { MenuState };

import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Game } from './base/game.js';
import { GameState } from './base/gameState.js';
import { Generator } from './base/generator.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Sketch } from './base/sketch.js';
import { MouseSystem } from './base/systems/mouseSystem.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxCanvas } from './base/uxCanvas.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { XForm } from './base/xform.js';
import { Options } from './options.js';
import { Credits } from './credits.js';
import { Prompt } from './prompt.js';
import { Resurrect64 } from './resurrect64.js';
import { Serialization } from './serialization.js';
import { Help } from './help.js';
import { Assets } from './base/assets.js';

function button(text, spec) {
    return Object.assign({}, UxButton.xspec({
        x_textXform: XForm.xspec({offset: 10}),
        highlight: Assets.get('menu.button', true),
        unpressed: Assets.get('menu.button', true),
        pressed: Assets.get('menu.button', true),
        text: new Text({text: text, color: Resurrect64.colors[0]}),
        hltext: new Text({text: text, color: Resurrect64.colors[16]}),
    }), spec);
}

class MenuState extends GameState {
    onNewClicked(evt) {
        if (Serialization.hasSaveGame()) {
            let prompt = new Prompt({
                xform: new XForm({ border: .3 }),
                title: 'confirm',
                prompt: `previous save game will be lost if new game started, proceed?`,
                handleConfirm: () => {
                    Serialization.reset();
                    Events.trigger(Game.evtStateChanged, {state: 'play'});
                },
            });
            this.view.adopt(prompt);
        } else {
            Serialization.reset();
            Events.trigger(Game.evtStateChanged, {state: 'play'});
        }
    }

    onLoadClicked(evt) {
        Events.trigger(Game.evtStateChanged, {state: 'play', data: {load: true}});
    }

    onOptionsClicked(evt) {
        // disable
        this.panel.active = false;
        let options = new Options({
            xform: new XForm({border: .2}),
        });
        this.view.adopt(options);
        options.evt.listen(options.constructor.evtDestroyed, () => {
            this.panel.active = true;
        });
    }

    onHelpClicked(evt) {
        // disable
        this.panel.active = false;
        let help = new Help({
            xform: new XForm({border: .2}),
        });
        this.view.adopt(help);
        help.evt.listen(help.constructor.evtDestroyed, () => {
            this.panel.active = true;
        });
    }

    onCreditsClicked(evt) {
        // disable
        this.panel.active = false;
        let credits = new Credits({
            xform: new XForm({border: .0125}),
        });
        this.view.adopt(credits);
        credits.evt.listen(credits.constructor.evtDestroyed, () => {
            this.panel.active = true;
        });
    }

    onTock(evt) {
        let ratePerSize = .001;
        let dt = evt.deltaTime;
        let cogs = [
            { cog: this.cog0, size: 2, dir: -1 },
            { cog: this.cog0l, size: 2, dir: -1 },
            { cog: this.cog1, size: 8, dir: 1 },
            { cog: this.cog2, size: 4, dir: -1 },
            { cog: this.cog3, size: 12, dir: 1 },
            { cog: this.cog4, size: 6, dir: -1 },
            { cog: this.cog5, size: 2, dir: 1 },
            { cog: this.cog6, size: 2, dir: 1 },
            { cog: this.cog7, size: 2*4/8, dir: -1 },
            { cog: this.cog8, size: 2*4/8, dir: 1 },
            { cog: this.cog9, size: 2*4/8, dir: -1 },
            { cog: this.cog10, size: 2*4/8*2/4, dir: 1 },
            { cog: this.cog11, size: 2*4/8*2/4, dir: 1 },
        ]

        for (const cog of cogs) {
            let rate = ratePerSize/cog.size;
            let angle = cog.cog.xform.angle + rate*dt*cog.dir;
            if (angle > Math.PI*2) angle -= Math.PI*2;
            if (angle < Math.PI*2) angle += Math.PI*2;
            cog.cog.xform.angle = angle;
            cog.cog.evt.trigger(cog.cog.constructor.evtUpdated, { actor: cog.cog });
        }
    }

    async ready() {
        let x_view = UxCanvas.xspec({
            cvsid: 'game.canvas',
            tag: 'cvs.0',
            x_children: [
                // -- bg panel
                UxPanel.xspec({
                    sketch: Sketch.zero,
                }),
                // -- cogs
                UxPanel.xspec({
                    tag: 'cog0l',
                    sketch: Assets.get('tcog.blue', true),
                    x_xform: XForm.xspec({left: -7.2/39, right: 22.2/39, top: 4/21, bottom: -5/21, width: 22, height: 22, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog1',
                    sketch: Assets.get('tcog.gray', true),
                    x_xform: XForm.xspec({left: -3/39, right: 34/39, top: 8/21, bottom: 5/21, width: 8, height: 8, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog0',
                    sketch: Assets.get('cog8', true),
                    x_xform: XForm.xspec({left: 2.8/39, right: 32.2/39, top: 14/21, bottom: 5/21, width: 2, height: 2, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog2',
                    sketch: Assets.get('tcog.green', true),
                    x_xform: XForm.xspec({left: .5/39, right: 34.5/39, top: 4.3/21, bottom: 12.7/21, width: 4, height: 4, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog3',
                    sketch: Assets.get('tcog.orange', true),
                    x_xform: XForm.xspec({left: 4/39, right: 23/39, top: -2/21, bottom: 11/21, width: 12, height: 12, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog6',
                    sketch: Assets.get('tcog.green', true),
                    x_xform: XForm.xspec({left: 19/39, right: 12/39, top: 0/21, bottom: 13/21, width: 8, height: 8, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog4',
                    sketch: Assets.get('tcog.blue', true),
                    x_xform: XForm.xspec({left: 16/39, right: 17/39, top: 1/21, bottom: 14/21, width: 6, height: 6, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog11',
                    sketch: Assets.get('tcog.blue', true),
                    x_xform: XForm.xspec({left: 23.2/39, right: -0.2/39, top: 8/21, bottom: -1/21, width: 14, height: 14, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog5',
                    sketch: Assets.get('cog9', true),
                    x_xform: XForm.xspec({left: 22/39, right: 15/39, top: 3/21, bottom: 16/21, width: 2, height: 2, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog7',
                    sketch: Assets.get('tcog.gray', true),
                    x_xform: XForm.xspec({left: 24/39, right: 11/39, top: 7/21, bottom: 10/21, width: 4, height: 4, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog8',
                    sketch: Assets.get('tcog.gray', true),
                    x_xform: XForm.xspec({left: 23/39, right: 12/39, top: 10.8/21, bottom: 6.2/21, width: 4, height: 4, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog9',
                    sketch: Assets.get('tcog.gray', true),
                    x_xform: XForm.xspec({left: 26.2/39, right: 8.8/39, top: 13/21, bottom: 4/21, width: 4, height: 4, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog10',
                    sketch: Assets.get('tcog.orange', true),
                    x_xform: XForm.xspec({left: 29.2/39, right: 5.8/39, top: 14/21, bottom: 5/21, width: 2, height: 2, lockRatio: true}),
                }),
                // -- button panel
                UxPanel.xspec({
                    tag: 'menu.panel',
                    sketch: Assets.get('menu.bg', true),
                    x_xform: XForm.xspec({left: 14/39, right: 14/39, top: 3/21, bottom: 2/21, left: .3, width: 11, height: 16, lockRatio: true}),
                    x_children: [
                        button('     new     ', { tag: 'menu.new', x_xform: XForm.xspec({left: 1/11, right: 3/11, top: 1/16, bottom: 13/16}), }),
                        button('     load     ', { tag: 'menu.load', x_xform: XForm.xspec({left: 1/11, right: 3/11, top: 4/16, bottom: 10/16}), }),
                        button('  options  ', { tag: 'menu.options', x_xform: XForm.xspec({left: 1/11, right: 3/11, top: 7/16, bottom: 7/16}), }),
                        button('     help     ', { tag: 'menu.help', x_xform: XForm.xspec({left: 1/11, right: 3/11, top: 10/16, bottom: 4/16}), }),
                        button('  credits  ', { tag: 'menu.credits', x_xform: XForm.xspec({left: 1/12, right: 3/11, top: 13/16, bottom: 1/16}), }),
                    ],
                }),
                /*
                UxText.xspec({
                    x_text: Text.xspec({text: 'Mines of Minia', color: 'blue'}),
                    x_xform: XForm.xspec({top: .2, bottom: .6, left: .1, right: .1}),
                }),
                */
            ]
        });
        this.view = Generator.generate(x_view);
        // -- ui elements
        this.panel = Hierarchy.find(this.view, (v) => v.tag === 'menu.panel');
        this.newButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.new');
        this.loadButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.load');
        this.optionsButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.options');
        this.helpButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.help');
        this.creditsButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.credits');
        this.cog0 = Hierarchy.find(this.view, (v) => v.tag === 'cog0');
        this.cog0l = Hierarchy.find(this.view, (v) => v.tag === 'cog0l');
        this.cog1 = Hierarchy.find(this.view, (v) => v.tag === 'cog1');
        this.cog2 = Hierarchy.find(this.view, (v) => v.tag === 'cog2');
        this.cog3 = Hierarchy.find(this.view, (v) => v.tag === 'cog3');
        this.cog4 = Hierarchy.find(this.view, (v) => v.tag === 'cog4');
        this.cog5 = Hierarchy.find(this.view, (v) => v.tag === 'cog5');
        this.cog6 = Hierarchy.find(this.view, (v) => v.tag === 'cog6');
        this.cog7 = Hierarchy.find(this.view, (v) => v.tag === 'cog7');
        this.cog8 = Hierarchy.find(this.view, (v) => v.tag === 'cog8');
        this.cog9 = Hierarchy.find(this.view, (v) => v.tag === 'cog9');
        this.cog10 = Hierarchy.find(this.view, (v) => v.tag === 'cog10');
        this.cog11 = Hierarchy.find(this.view, (v) => v.tag === 'cog11');
        // -- disable load if no game is saved...
        if (!Serialization.hasSaveGame()) {
            this.loadButton.active = false;
        }
        // -- bind event handlers
        this.onNewClicked = this.onNewClicked.bind(this);
        this.onLoadClicked = this.onLoadClicked.bind(this);
        this.onOptionsClicked = this.onOptionsClicked.bind(this);
        this.onHelpClicked = this.onHelpClicked.bind(this);
        this.onCreditsClicked = this.onCreditsClicked.bind(this);
        this.onTock = this.onTock.bind(this);
        this.newButton.evt.listen(this.newButton.constructor.evtMouseClicked, this.onNewClicked);
        this.loadButton.evt.listen(this.loadButton.constructor.evtMouseClicked, this.onLoadClicked);
        this.optionsButton.evt.listen(this.optionsButton.constructor.evtMouseClicked, this.onOptionsClicked);
        this.helpButton.evt.listen(this.helpButton.constructor.evtMouseClicked, this.onHelpClicked);
        this.creditsButton.evt.listen(this.creditsButton.constructor.evtMouseClicked, this.onCreditsClicked);
        Events.listen('game.tock', this.onTock);
        return Promise.resolve();
    }

    stop() {
        for (const child of Hierarchy.children(this.view)) {
            child.destroy();
        }
        this.view.destroy();
        Events.ignore(Keys.evtDown, this.onAdvance);
        Events.ignore(MouseSystem.evtClicked, this.onAdvance);
    }

}
