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
import { PlayOptions } from './playOptions.js';
import { Prompt } from './prompt.js';
import { Resurrect64 } from './resurrect64.js';
import { Serialization } from './serialization.js';

function button(text, spec) {
    return Object.assign({}, UxButton.xspec({
        x_textXform: XForm.xspec({offset: 10}),
        highlight: Sketch.zero,
        unpressed: Sketch.zero,
        pressed: Sketch.zero,
        text: new Text({text: text, color: Resurrect64.colors[0]}),
        hltext: new Text({text: text, color: Resurrect64.colors[10]}),
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
            console.log(`${this} onNewClicked: ${Fmt.ofmt(evt)}`);
            Events.trigger(Game.evtStateChanged, {state: 'play'});
        }
    }

    onLoadClicked(evt) {
        console.log(`${this} onLoadClicked: ${Fmt.ofmt(evt)}`);
        Events.trigger(Game.evtStateChanged, {state: 'play', data: {load: true}});
    }

    onOptionsClicked(evt) {
        console.log(`${this} onOptionsClicked: ${Fmt.ofmt(evt)}`);
        // disable
        this.view.active = false;
        let options = new PlayOptions({
            xform: new XForm({border: .2}),
        });
        this.view.adopt(options);
        options.evt.listen(options.constructor.evtDestroyed, () => {
            this.view.active = true;
        });
    }

    onHelpClicked(evt) {
        console.log(`${this} onHelpClicked: ${Fmt.ofmt(evt)}`);
    }

    onCreditsClicked(evt) {
        console.log(`${this} onCreditsClicked: ${Fmt.ofmt(evt)}`);
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
                // -- button panel
                UxPanel.xspec({
                    tag: 'menu.panel',
                    sketch: Sketch.zero,
                    x_xform: XForm.xspec({top: .2, bottom: .2, left: .3, right: .3}),
                    x_children: [
                        button('   new   ', { tag: 'menu.new', x_xform: XForm.xspec({top: 0, bottom: .8}), }),
                        button('   load   ', { tag: 'menu.load', x_xform: XForm.xspec({top: .2, bottom: .6}), }),
                        button('   options   ', { tag: 'menu.options', x_xform: XForm.xspec({top: .4, bottom: .4}), }),
                        button('   help   ', { tag: 'menu.help', x_xform: XForm.xspec({top: .6, bottom: .2}), }),
                        button('   credits   ', { tag: 'menu.credits', x_xform: XForm.xspec({top: .8, bottom: 0}), }),
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
        console.log(`${this} view: ${this.view}`);
        // -- ui elements
        this.panel = Hierarchy.find(this.view, (v) => v.tag === 'menu.panel');
        this.newButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.new');
        this.loadButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.load');
        this.optionsButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.options');
        this.helpButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.help');
        this.creditsButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.credits');
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
        this.newButton.evt.listen(this.newButton.constructor.evtMouseClicked, this.onNewClicked);
        this.loadButton.evt.listen(this.loadButton.constructor.evtMouseClicked, this.onLoadClicked);
        this.optionsButton.evt.listen(this.optionsButton.constructor.evtMouseClicked, this.onOptionsClicked);
        this.helpButton.evt.listen(this.helpButton.constructor.evtMouseClicked, this.onHelpClicked);
        this.creditsButton.evt.listen(this.creditsButton.constructor.evtMouseClicked, this.onCreditsClicked);
        return Promise.resolve();
    }

    stop() {
        //console.log(`${this} stop view children: ${this.view.children}`);
        //let children = Array.from(Hierarchy.children(this.view));
        for (const child of Hierarchy.children(this.view)) {
            //console.log(`destroy: ${child}`);
            child.destroy();
        }
        this.view.destroy();
        Events.ignore(Keys.evtDown, this.onAdvance);
        Events.ignore(MouseSystem.evtClicked, this.onAdvance);
    }

}
