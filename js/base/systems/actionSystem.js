export { ActionSystem };

import { Events } from '../event.js';
import { Fmt } from '../fmt.js';
import { System } from '../system.js';

class ActionSystem extends System {

    // STATIC METHODS ------------------------------------------------------
    static assign(actor, action) {
        // update actor to include action list
        if (!('actions' in actor)) actor.actions = [];

        // if actor has actions queued...
        let queued = actor.actions.length !== 0;
        if (Array.isArray(action)) {
            actor.actions.push(...action);
        } else {
            actor.actions.push(action);
        }
        if (!queued) {
            action = actor.actions[0];
            // listen for finished action
            action.evt.listen(action.constructor.evtDone, ActionSystem.onActionDone, Events.once);
            // start the action
            //console.log(`starting action: ${action} action evtDone: ${action.constructor.evtDone}`);
            action.actor = actor;
            Events.trigger(action.constructor.evtStarted, { actor: actor, action: action });
            action.start(actor);
        }
    }


    // STATIC EVENT HANDLERS ------------------------------------------------------
    static onActionDone(evt) {
        //console.log(`-- actionSystem onActionDone`);
        // clear listen state
        let action = evt.action;
        let actor = evt.actor;
        Events.trigger(action.constructor.evtDone, { actor: actor, action: action });
        //console.log(`action finished: ${Fmt.ofmt(evt)}`);
        if (!action || !actor || action !== actor.actions[0]) return;
        // pop current action (it is done)
        actor.actions.shift();
        // if actor has more actions queued...
        if (actor.actions.length) {
            action = actor.actions[0];
            // listen for finished action
            action.evt.listen(action.constructor.evtDone, ActionSystem.onActionDone, Events.once);
            // start the action
            //console.log(`starting action: ${action}`);
            action.actor = actor;
            Events.trigger(action.constructor.evtStarted, { actor: actor, action: action });
            action.start(actor);
        }
    }

}