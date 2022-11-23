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
        let cogRate1 = .001;
        let cogRate2 = -.002;
        let dt = evt.deltaTime;
        // cog 1
        let angle = this.cog1.xform.angle + cogRate1*dt;
        if (angle > Math.PI*2) angle -= Math.PI*2;
        this.cog1.xform.angle = angle;
        this.cog1.evt.trigger(this.cog1.constructor.evtUpdated, { actor: this.cog1 });
        // cog 2
        angle = this.cog2.xform.angle + cogRate2*dt;
        if (angle < -Math.PI*2) angle += Math.PI*2;
        this.cog2.xform.angle = angle;
        this.cog2.evt.trigger(this.cog1.constructor.evtUpdated, { actor: this.cog2 });
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
                    tag: 'cog1',
                    sketch: Assets.get('cog1', true),
                    x_xform: XForm.xspec({left: 1/39, right: 32/39, top: 8/21, bottom: 7/21, width: 6, height: 6, lockRatio: true}),
                }),
                UxPanel.xspec({
                    tag: 'cog2',
                    sketch: Assets.get('cog6', true),
                    x_xform: XForm.xspec({left: 0/39, right: 35/39, top: 5/21, bottom: 12/21, width: 4, height: 4, lockRatio: true}),
                }),
                // -- button panel
                UxPanel.xspec({
                    tag: 'menu.panel',
                    sketch: Assets.get('menu.bg', true),
                    x_xform: XForm.xspec({left: 14/39, right: 13/39, top: 3/21, bottom: 2/21, left: .3, width: 12, height: 16, lockRatio: true}),
                    x_children: [
                        button('     new     ', { tag: 'menu.new', x_xform: XForm.xspec({left: 2/12, right: 4/12, top: 1/16, bottom: 13/16}), }),
                        button('     load     ', { tag: 'menu.load', x_xform: XForm.xspec({left: 2/12, right: 4/12, top: 4/16, bottom: 10/16}), }),
                        button('  options  ', { tag: 'menu.options', x_xform: XForm.xspec({left: 2/12, right: 4/12, top: 7/16, bottom: 7/16}), }),
                        button('     help     ', { tag: 'menu.help', x_xform: XForm.xspec({left: 2/12, right: 4/12, top: 10/16, bottom: 4/16}), }),
                        button('  credits  ', { tag: 'menu.credits', x_xform: XForm.xspec({left: 2/12, right: 4/12, top: 13/16, bottom: 1/16}), }),
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
        this.cog1 = Hierarchy.find(this.view, (v) => v.tag === 'cog1');
        this.cog2 = Hierarchy.find(this.view, (v) => v.tag === 'cog2');
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
