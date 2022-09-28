export { DirectiveHandler };

import { Entity } from './base/entity.js';
import { Events } from './base/event.js';
import { Fmt } from './base/fmt.js';
import { Keys } from './base/keys.js';
import { TurnSystem } from './systems/turnSystem.js';

class DirectiveHandler extends Entity {
    cpost(spec) {
        super.cpost(spec);
        this.directive = spec.directive;
        this.onTurnDone = this.onTurnDone.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        Events.listen(TurnSystem.evtDone, this.onTurnDone);
        Events.listen(Keys.evtDown, this.onKeyDown);
    }
    cfinal(spec) {
        this.start();
    }

    destroy() {
        super.destroy();
        Events.ignore(TurnSystem.evtDone, this.onTurnDone);
        Events.ignore(Keys.evtDown, this.onKeyDown);
    }

    start() {
        this.runner = this.directive.run();
        let iaction = this.runner.next();
        if (iaction.done || !iaction.value) {
            Events.trigger('handler.wanted', {which: 'interact'});
            this.destroy();
        // post leader action
        } else {
            TurnSystem.postLeaderAction(iaction.value);
        }
    }

    onTurnDone(evt) {
        // wait for follower turn to be done
        if (evt.which !== 'follower') return;
        // pull next action from directive
        let iaction = this.runner.next();
        // handle end of directive
        if (iaction.done || !iaction.value) {
            Events.trigger('handler.wanted', {which: 'interact'});
            this.destroy();
        // post leader action
        } else {
            TurnSystem.postLeaderAction(iaction.value);
        }
    }

    onKeyDown(evt) {
        switch (evt.key) {
            case 'Escape': {
                Events.trigger('handler.wanted', {which: 'interact'});
                this.destroy();
                break;
            }
        }
    }

}