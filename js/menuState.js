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

class MenuState extends GameState {
    onNewClicked(evt) {
        console.log(`${this} onNewClicked: ${Fmt.ofmt(evt)}`);
        Events.trigger(Game.evtStateChanged, {state: 'play'});
    }

    onLoadClicked(evt) {
        console.log(`${this} onLoadClicked: ${Fmt.ofmt(evt)}`);
    }

    onOptionsClicked(evt) {
        console.log(`${this} onOptionsClicked: ${Fmt.ofmt(evt)}`);
    }

    onHelpClicked(evt) {
        console.log(`${this} onHelpClicked: ${Fmt.ofmt(evt)}`);
    }

    onCreditsClicked(evt) {
        console.log(`${this} onCreditsClicked: ${Fmt.ofmt(evt)}`);
    }

    async ready() {
        //this.onAdvance = this.onAdvance.bind(this);
        //Events.listen(Keys.evtDown, this.onAdvance);
        //Events.listen(MouseSystem.evtClicked, this.onAdvance);
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
                    sketch: Sketch.zero,
                    x_xform: XForm.xspec({top: .2, bottom: .2, left: .3, right: .3}),
                    x_children: [
                        UxButton.xspec({
                            tag: 'menu.new',
                            x_xform: XForm.xspec({top: 0, bottom: .8}),
                            x_textXform: XForm.xspec({offset: 10}),
                            text: new Text({text: '   new   '}),
                        }),
                        UxButton.xspec({
                            tag: 'menu.load',
                            x_xform: XForm.xspec({top: .2, bottom: .6}),
                            x_textXform: XForm.xspec({offset: 10}),
                            text: new Text({text: '   load   '}),
                        }),
                        UxButton.xspec({
                            tag: 'menu.options',
                            x_xform: XForm.xspec({top: .4, bottom: .4}),
                            x_textXform: XForm.xspec({offset: 10}),
                            text: new Text({text: '   options   '}),
                        }),
                        UxButton.xspec({
                            tag: 'menu.help',
                            x_xform: XForm.xspec({top: .6, bottom: .2}),
                            x_textXform: XForm.xspec({offset: 10}),
                            text: new Text({text: '   help   '}),
                        }),
                        UxButton.xspec({
                            tag: 'menu.credits',
                            x_xform: XForm.xspec({top: .8, bottom: 0}),
                            x_textXform: XForm.xspec({offset: 10}),
                            text: new Text({text: '   credits   '}),
                        }),
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
        this.newButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.new');
        this.loadButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.load');
        this.optionsButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.options');
        this.helpButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.help');
        this.creditsButton = Hierarchy.find(this.view, (v) => v.tag === 'menu.credits');
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
        this.view.destroy();
        Events.ignore(Keys.evtDown, this.onAdvance);
        Events.ignore(MouseSystem.evtClicked, this.onAdvance);
    }

}
