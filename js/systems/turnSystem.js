export { TurnSystem };

import { Action } from '../base/actions/action.js';
import { WaitAction } from '../base/actions/wait.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { Util } from '../base/util.js';
import { DazedCharm } from '../charms/dazed.js';

class TurnSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static evtDone = 'turn.done';
    static dfltIterateTTL = 0;

    // linked to the last instantiated system
    static _main;

    // STATIC PROPERTIES ---------------------------------------------------
    static get main() {
        if (!this._main) this._main = new TurnSystem();
        return this._main;
    }

    // STATIC METHODS ------------------------------------------------------
    static postLeaderAction(action) {
        this.main.postLeaderAction(action);
    }
    static cancelLeaderAction(action) {
        this.main.cancelLeaderAction(action);
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        // -- turn leader
        this.leader = spec.leader;
        //this.leaderPoints = 0;
        this.leaderQ = [];
        // -- turn management
        this.leaderTurn = true;
        this.followerTurnStarting = false;
        this.turnPoints = 0;
        // -- follower mgmt
        this.followerOverflow = {};
        this.followerPoints = {};
        this.followerActive = new Set();
        this.followersDone = false;
        // bind event handler
        this.onActionDone = this.onActionDone.bind(this);
        // listen for events
        this.evt.listen(Action.evtDone, this.onActionDone);
        this.active = false;
        // link as main system
        this.constructor._main = this;
    }

    // EVENT HANDLERS ------------------------------------------------------

    onActionDone(evt) {
        let action = evt.action;
        // only handle turn events for actions marked with turn delimiter
        if (!action.isTurn) return;
        // check if actor is leader
        if (this.leader && this.leader === evt.actor) {
            if (this.dbg) console.log(`leader action done: ${Fmt.ofmt(evt)}`);
            // -- handle leader finishing turn's action
            if (action.points > 0) {
                if (this.dbg) console.log(`=== STARTING FOLLOWER TURN`)
                this.leaderTurn = false;
                this.followerTurnStarting = true;
                // clear the follower point allocations
                this.followerPoints = {};
                // run single iteration when turn starts
                this.active = true
                //console.log(`onActionDone (leader) this.active = true`);
                if (this.dbg) console.log(`-- ${this} triggering ${this.constructor.evtDone} for leader`);
                // leader turn is done
                Events.trigger(this.constructor.evtDone, {which: 'leader', points: this.turnPoints});
            // -- handle leader free action
            } else {
                if (this.dbg) console.log(`--- leader free action`)
            }
        // check if action is tied to active follower
        } else if (evt.actor && this.store.has(evt.actor.gid)) {
            if (this.dbg) console.log(`follower action done ${Fmt.ofmt(evt)}`);
            this.followerActive.add(evt.actor.gid);

            // account for follower points
            let allocatedPoints = this.followerPoints[evt.actor.gid] || 0;
            this.followerPoints[evt.actor.gid] = allocatedPoints - action.points;
            // iterate
            if (this.iterating) {
                this.iterateAgain = true
            } else {
                //console.log(`onActionDone (follower) this.active = true`);
                this.active = true
            }
        }
    }

    onEntityRemoved(evt) {
        if (!this.matchPredicate(evt.actor)) return;
        if (this.dbg) console.log(`${this} onEntityRemoved: ${Fmt.ofmt(evt)}`);
        this.store.delete(evt.actor.gid);
        if (!this.leaderTurn) {
            if (this.iterating) {
                this.iterateAgain = true
            } else {
                //console.log(`onEntityRemoved this.active = true`);
                this.active = true
            }
        }
    }

    // METHODS -------------------------------------------------------------
    matchPredicate(e) {
        return e.actionStream;
    }

    prepare(evt) {
        this.followersDone = true;
        this.iterateAgain = false;
        //console.log(`starting w/ all followers done`);
    }

    iterate(evt, e) {
        // -- skip leader
        if (this.leader && this.leader === e) return;
        // -- on turn start... points are allocated to each follower...
        if (this.followerTurnStarting) {
            let overflow = this.followerOverflow[e.gid] || 0;
            delete this.followerOverflow[e.gid];
            this.followerPoints[e.gid] = this.turnPoints + overflow;
        }
        // -- check if action points are available...
        let allocatedPoints = this.followerPoints[e.gid] || 0;
        // -- skip non-active entities (if turn is not starting)
        if (!this.followerTurnStarting && !this.followerActive.has(e.gid)) {
            this.followersDone &= (allocatedPoints <= 0);
            //console.log(`=== skipping non active: ${e} done: ${allocatedPoints <= 0}`);
            return;
        }
        if (allocatedPoints <= 0) return;
        // -- determine next action
        let action;
        if (DazedCharm.isDazed(e)) {
            action = new WaitAction({points: allocatedPoints});
        } else {
            // -- pull from stream
            action = e.actionStream.next().value;
        }
        // -- if no next action (nothing to do)... so return
        if (!action) {
            // null action results in entity being done with turn and forfeit of any points
            this.followerPoints[e.gid] = 0;
            //console.log(`=== null turn: ${e}`);
            return;
        }
        // -- mark action as turn delimiter
        action.isTurn = true;
        // check if action can be started
        if (action.points <= allocatedPoints) {
            ActionSystem.assign(e, action);
            //this.followerPoints[e.gid] = allocatedPoints - action.points;
            //console.log(`=== post follower action: ${action} points: ${this.followerPoints[e.gid]} overflow: ${this.followerOverflow[e.gid]} allocated: ${allocatedPoints}`);
            // actor is not done
            this.followersDone = false;
        // otherwise, action gets discarded, point overflow is saved for follower, follower is done
        } else {
            this.followerOverflow[e.gid] = allocatedPoints;
            this.followerPoints[e.gid] = 0;
            //console.log(`=== discard follower action: ${action} points: ${this.followerPoints[e.gid]} overflow: ${this.followerOverflow[e.gid]} allocated: ${allocatedPoints}`);
        }

    }

    finalize(evt) {
        //console.log(`finalize: followersDone: ${this.followersDone} iterateAgain: ${this.iterateAgain}`);
        // clear marked followers
        this.followerActive.clear();
        //console.log(`finalize this.active = ${this.iterateAgain}`);
        this.active = this.iterateAgain;
        this.followerTurnStarting = false;
        // check if all followers are done
        if (this.followersDone) {
            if (this.dbg) console.log(`=== STARTING LEADER TURN`)
            this.leaderTurn = true;
            this.startLeaderAction();
            if (this.dbg) console.log(`-- ${this} triggering ${this.constructor.evtDone} for follower`);
            Events.trigger(this.constructor.evtDone, {which: 'follower', points: this.turnPoints}, true);
        }
    }

    startLeaderAction() {
        if (Util.empty(this.leader.actions) && !Util.empty(this.leaderQ)) {
            let action = this.leaderQ.shift();
            if (action.points > 0) {
                // followers will be able to take actions <= leader action points on next follower turn
                this.turnPoints = action.points;
            }
            //console.log(`start leader action: ${action}`);
            // assign leader action
            ActionSystem.assign(this.leader, action);
        }
    }

    postLeaderAction(action) {
        //console.log(`-- posted leader action: ${action}`);
        // -- mark action as turn delimiter
        action.isTurn = true;
        if (!this.leader) return;
        // push action to leader queue
        this.leaderQ.push(action);
        // if currently is leader's turn, and they are not busy...
        if (this.leaderTurn && Util.empty(this.leader.actions)) {
            this.startLeaderAction();
        }
    }

    cancelLeaderAction(action) {
        if (!this.leader) return;
        // FIXME
    }



}