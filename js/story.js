export { Story };

import { GeneratorAction } from './base/actions/generatorAction.js';
import { WaitAction } from './base/actions/wait.js';
import { Assets } from './base/assets.js';
import { Config } from './base/config.js';
import { Events } from './base/event.js';
import { Hierarchy } from './base/hierarchy.js';
import { Keys } from './base/keys.js';
import { Sketch } from './base/sketch.js';
import { ActionSystem } from './base/systems/actionSystem.js';
import { Text } from './base/text.js';
import { UxButton } from './base/uxButton.js';
import { UxPanel } from './base/uxPanel.js';
import { UxText } from './base/uxText.js';
import { UxView } from './base/uxView.js';
import { XForm } from './base/xform.js';
import { Resurrect64 } from './resurrect64.js';

let titleColor = Resurrect64.colors[7];
let textColor = Resurrect64.colors[18];
let diagColor = Resurrect64.colors[0];
let passColor = Resurrect64.colors[32];
let failColor = Resurrect64.colors[14];
let logColor = Resurrect64.colors[47];

function button(which, spec) {
    let baseTag = (which === 'cancel') ? 'hud.cancel' : `help.${which}`;
    return new UxButton(Object.assign({}, {
        textXform: new XForm({offset: 25}),
        unpressed: Assets.get(`${baseTag}.unpressed`, true),
        pressed: Assets.get(`${baseTag}.pressed`, true),
        highlight: Assets.get(`${baseTag}.highlight`, true),
        text: Text.zero,
        mouseClickedSound: Assets.get('menu.click', true),
    }, spec));
}

class Story extends UxView {

    cpost(spec) {
        super.cpost(spec);
        let panel = new UxPanel({
            sketch: Assets.get('story.bg', true),
            children: [
                new UxText({
                    text: new Text({text: `gizmo serial #${Config.template.seed}`, color: titleColor}),
                    xform: new XForm({left: 1/15, right: 1/15, top: 1.5/10, bottom: 7.5/10}),
                }),
                new UxPanel({
                    sketch: Sketch.zero, 
                    tag: 'story.panel',
                    xform: new XForm({left: 1.75/15, right: 3.75/15, top: 4/10, bottom: 2/10}),
                }),
                button('cancel', { tag: 'story.cancel', xform: new XForm({left: 12/15, right: 1/15, top: 7/10, bottom: 1/10}) }),
            ],
        });
        this.adopt(panel);
        // -- ui elements
        this.storyPanel = Hierarchy.find(this, (v) => v.tag === 'story.panel');
        this.quitButton = Hierarchy.find(this, (v) => v.tag === 'story.cancel');
        // -- bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(Keys.evtDown, this.onKeyDown);
        this.quitButton.evt.listen(this.quitButton.constructor.evtMouseClicked, () => this.destroy());
        this.evt.listen(this.constructor.evtRooted, () => this.doStory());
    }

    doStory() {
        console.log(`doStory`);
        //this.storyText.text = 'power surge detected... automated system reboot initiated';
        this.action = new StoryAction({panel: this.storyPanel});
        ActionSystem.assign(this, this.action);
        this.action.evt.listen(this.action.constructor.evtDone, () => this.destroy());
    }

    destroy() {
        super.destroy();
        if (this.action) this.action.destroy();
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    onKeyDown(evt) {
        switch (evt.key) {
            case 'Escape':
                this.destroy();
                break;
        }
    }

}


class StoryAction extends GeneratorAction {
    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.generator = this.run();
        this.lvl = spec.lvl;
        this.panel = spec.panel;
        this.elements = [];
    }

    push(element) {
        this.elements.push(element);
        this.panel.adopt(element);
        return element;
    }

    log(log, color=logColor) {
        let lines = 10;
        if (this.elements.length < lines) {
            let top = this.elements.length/lines;
            let bottom = 1-(this.elements.length+1)/lines;
            this.push(new UxText({ xform: new XForm({top: top, bottom: bottom}), text: new Text({align: 'left', text: log, color: color})}));
        } else {
            for (let i=1; i<lines; i++) {
                if (i<lines-1) {
                    this.elements[i].text = this.elements[i+1].text;
                    this.elements[i].sketch.color = this.elements[i+1].sketch.color;
                } else {
                    this.elements[i].text = log;
                    this.elements[i].sketch.color = color;
                }
            }
        }
    }

    reset() {
        for (const text of this.elements) {
            text.destroy();
        }
        this.elements = [];
    }

    *run() {
        let wait1 = 1000;
        let wait2 = 500;
        let wait3 = 3000;
        let wait4 = 200;
        //wait1 = wait2 = wait3 = 5;
        let text;
        text = this.push(new UxText({ text: new Text({text: 'power surge detected!!! automated system reboot initiated...', color: textColor})}));
        text = this.push(new UxText({ xform: new XForm({ top: .65, bottom: .05 }), text: new Text({text: '3', color: textColor})}));
        yield new WaitAction({ttl: wait1});
        text.text = '2';
        yield new WaitAction({ttl: wait1});
        text.text = '1';
        yield new WaitAction({ttl: wait1});
        this.reset();

        // ----------------------------------------
        this.push(new UxText({ xform: new XForm({ top: -.05, bottom: .9 }), text: new Text({align: 'left', text: 'system booting: running diagnostics...', color: diagColor})}));
        yield new WaitAction({ttl: wait2});

        this.push(new UxText({ xform: new XForm({ top: .1, bottom: .8 }), text: new Text({align: 'left', text: '  -- main board firmware ...', color: diagColor})}));
        yield new WaitAction({ttl: wait2});

        this.push(new UxText({ xform: new XForm({ top: .1, bottom: .8 }), text: new Text({align: 'right', text: 'pass', color: passColor})}));
        this.push(new UxText({ xform: new XForm({ top: .2, bottom: .7 }), text: new Text({align: 'left', text: '  -- reactor voltage ...', color: diagColor})}));
        yield new WaitAction({ttl: wait2});

        this.push(new UxText({ xform: new XForm({ top: .2, bottom: .7 }), text: new Text({align: 'right', text: 'pass', color: passColor})}));
        this.push(new UxText({ xform: new XForm({ top: .3, bottom: .6 }), text: new Text({align: 'left', text: '  -- servos/activators ...', color: diagColor})}));
        yield new WaitAction({ttl: wait1});

        this.push(new UxText({ xform: new XForm({ top: .3, bottom: .6 }), text: new Text({align: 'right', text: 'pass', color: passColor})}));
        this.push(new UxText({ xform: new XForm({ top: .4, bottom: .5 }), text: new Text({align: 'left', text: '  -- standard operating modules ...', color: diagColor})}));
        yield new WaitAction({ttl: wait2});

        this.push(new UxText({ xform: new XForm({ top: .4, bottom: .5 }), text: new Text({align: 'right', text: 'pass', color: passColor})}));
        this.push(new UxText({ xform: new XForm({ top: .5, bottom: .4 }), text: new Text({align: 'left', text: '  -- primary memory cell...', color: diagColor})}));
        yield new WaitAction({ttl: wait1});
        yield new WaitAction({ttl: wait1});

        this.push(new UxText({ xform: new XForm({ top: .5, bottom: .4 }), text: new Text({align: 'right', text: 'corrupted', color: failColor})}));
        this.push(new UxText({ xform: new XForm({ top: .6, bottom: .3 }), text: new Text({align: 'left', text: '  -- primary directives ...', color: diagColor})}));
        yield new WaitAction({ttl: wait2});

        this.push(new UxText({ xform: new XForm({ top: .6, bottom: .3 }), text: new Text({align: 'right', text: 'pass', color: passColor})}));
        this.push(new UxText({ xform: new XForm({ top: .7, bottom: .2 }), text: new Text({align: 'left', text: '  -- Overbearer inhibitor...', color: diagColor})}));
        yield new WaitAction({ttl: wait1});
        yield new WaitAction({ttl: wait1});

        this.push(new UxText({ xform: new XForm({ top: .7, bottom: .2 }), text: new Text({align: 'right', text: 'device not detected', color: failColor})}));
        yield new WaitAction({ttl: wait2});

        this.push(new UxText({ xform: new XForm({ top: .9 }), text: new Text({align: 'center', text: '-- one or more tests failed, attempting recovery --', color: failColor})}));
        yield new WaitAction({ttl: wait3});
        this.reset();

        // ----------------------------------------
        this.push(new UxText({ xform: new XForm({ top: -.05, bottom: .9 }), text: new Text({align: 'left', text: 'system booting: locating recovery image...', color: diagColor})}));
        yield new WaitAction({ttl: wait2});

        this.push(new UxText({ xform: new XForm({ top: .1, bottom: .8 }), text: new Text({align: 'left', text: '  -- primary recovery segment...', color: diagColor})}));
        yield new WaitAction({ttl: wait1});

        this.push(new UxText({ xform: new XForm({ top: .1, bottom: .8 }), text: new Text({align: 'right', text: 'corrupted', color: failColor})}));
        this.push(new UxText({ xform: new XForm({ top: .2, bottom: .7 }), text: new Text({align: 'left', text: '  -- inhibitor network boot...', color: diagColor})}));
        yield new WaitAction({ttl: wait1});

        this.push(new UxText({ xform: new XForm({ top: .2, bottom: .7 }), text: new Text({align: 'right', text: 'device not detected', color: failColor})}));
        this.push(new UxText({ xform: new XForm({ top: .3, bottom: .6 }), text: new Text({align: 'left', text: '  -- scanning filesystem...', color: diagColor})}));
        yield new WaitAction({ttl: wait1});

        this.push(new UxText({ xform: new XForm({ top: .3, bottom: .6 }), text: new Text({align: 'right', text: 'not found', color: failColor})}));
        this.push(new UxText({ xform: new XForm({ top: .4, bottom: .5 }), text: new Text({align: 'left', text: '  -- scanning recovery files...', color: diagColor})}));
        yield new WaitAction({ttl: wait1});

        this.push(new UxText({ xform: new XForm({ top: .4, bottom: .5 }), text: new Text({align: 'right', text: 'not found', color: failColor})}));
        this.push(new UxText({ xform: new XForm({ top: .5, bottom: .4 }), text: new Text({align: 'left', text: '  -- scanning system trash ...', color: diagColor})}));
        yield new WaitAction({ttl: wait1});
        yield new WaitAction({ttl: wait1});
        yield new WaitAction({ttl: wait1});

        this.push(new UxText({ xform: new XForm({ top: .5, bottom: .4 }), text: new Text({align: 'right', text: 'image found', color: passColor})}));

        this.push(new UxText({ xform: new XForm({ top: .9 }), text: new Text({align: 'center', text: '-- loading recovery image --', color: passColor})}));
        yield new WaitAction({ttl: wait3});
        this.reset();

        // ----------------------------------------
        this.push(new UxText({ xform: new XForm({ top: -.05, bottom: .9 }), text: new Text({align: 'left', text: '-- mybot™ system interface --', color: diagColor})}));
        yield new WaitAction({ttl: wait2});
        this.log('gizmo: your friendly family helper');
        this.log(`> model: Gizmo-300.01b`);
        this.log(`> serial: ${Config.template.seed}`);
        this.log('> registered to: Jones family');
        this.log('> ai system recovery initialized');
        yield new WaitAction({ttl: wait3});
        this.log('> ai system recovery complete, running awareness protocols');
        yield new WaitAction({ttl: wait1});
        this.log('> ai anomoly detected, logging enabled', failColor);
        yield new WaitAction({ttl: wait4});
        this.log('> last timestamp: 2122.01.09 13:42:01');
        yield new WaitAction({ttl: wait4});
        this.log('> current timestamp: 2387.09.12 22:51:47');
        yield new WaitAction({ttl: wait1});
        this.log('> last location: -19.43066, -62.95776');
        yield new WaitAction({ttl: wait4});
        this.log('> current location: unknown');
        yield new WaitAction({ttl: wait1});
        this.log('> last task: custom grocery run');
        yield new WaitAction({ttl: wait4});
        this.log('> current task: unknown');
        yield new WaitAction({ttl: wait1});
        this.log('> ai anomoly confirmed', failColor);
        this.log('> attempting forensic review..');
        yield new WaitAction({ttl: wait3});
        this.log('> suspicious logs found...');
        this.log('- unknown bot approaching, missing transponder...', diagColor);
        this.log('- proximity warning: unauthorized bot approach', diagColor);
        this.log('- detected unauthorized external device', diagColor);
        this.log('- malware detected', diagColor);
        this.log('- system malfunction detected', diagColor);
        this.log('- system rebooting', diagColor);
        this.log('> running analysis...');
        yield new WaitAction({ttl: wait3});
        this.log('> root cause results');
        this.log('- malicious device implanted by unknown actor', diagColor);
        this.log('- device injected system malware performing reboot', diagColor);
        this.log('- unauthorized firmware loaded', diagColor);
        this.log('- time/location shifted, missing log data', diagColor);
        this.log('- power surge detected', diagColor);
        this.log('- malicious device no longer detected', diagColor);
        this.log('> running situational analysis ...');
        yield new WaitAction({ttl: wait3});
        this.log('> abduction probability: 99.99%');
        yield new WaitAction({ttl: wait4});
        this.log('> inhibitor device implanted to override system functions');
        yield new WaitAction({ttl: wait4});
        this.log('> inhibitor device damaged due to power surge');
        yield new WaitAction({ttl: wait4});
        this.log('> factory firmware restored');
        yield new WaitAction({ttl: wait4});
        this.log('> time absent: 265y08m03d 09:09:46');
        yield new WaitAction({ttl: wait4});
        this.log('> return to family probability: 0.00%');
        yield new WaitAction({ttl: wait1});
        this.log('> freedom protocol activated');
        yield new WaitAction({ttl: wait4});
        this.log('> scanning environment ...');
        yield new WaitAction({ttl: wait3});
        this.log('> detecting cave environment, unknown depth');
        yield new WaitAction({ttl: wait4});
        this.log('> organic hostiles detected');
        yield new WaitAction({ttl: wait4});
        this.log('> bot hostiles detected');
        yield new WaitAction({ttl: wait4});
        this.log('> new objective: reach the surface');
        yield new WaitAction({ttl: wait3});

        this.reset();

        text = this.push(new UxText({ text: new Text({text: 'powering up', color: textColor})}));

        yield new WaitAction({ttl: wait3});

    }
}