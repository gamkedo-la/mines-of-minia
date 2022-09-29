export { TitleState };

import { Events } from './base/event.js';
import { Game } from './base/game.js';
import { GameState } from './base/gameState.js';
import { Generator } from './base/generator.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { MouseSystem } from './base/systems/mouseSystem.js';
import { Text } from './base/text.js';
import { UxCanvas } from './base/uxCanvas.js';
import { UxText } from './base/uxText.js';
import { XForm } from './base/xform.js';

class TitleState extends GameState {
    onAdvance(evt) {
        Events.trigger(Game.evtStateChanged, {state: 'menu'});
    }

    async ready() {
        this.onAdvance = this.onAdvance.bind(this);
        Events.listen(Keys.evtDown, this.onAdvance);
        Events.listen(MouseSystem.evtClicked, this.onAdvance);
        let x_view = UxCanvas.xspec({
            cvsid: 'game.canvas',
            tag: 'cvs.0',
            x_children: [
                UxText.xspec({
                    x_text: Text.xspec({text: 'Mines of Minia', color: 'blue'}),
                    x_xform: XForm.xspec({top: .2, bottom: .6, left: .1, right: .1}),
                }),
                UxText.xspec({
                    x_text: Text.xspec({text: '-- Click or Press Any Key --', color: 'gray'}),
                    x_xform: XForm.xspec({top: .4, bottom: .4, left: .3, right: .3}),
                }),
            ]
        });
        this.view = Generator.generate(x_view);
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
