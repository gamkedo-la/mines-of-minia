export { TurnSystem };

import { EndTurnAction } from '../actions/endTurn.js';
import { Action } from '../base/actions/action.js';
import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { ActionSystem } from '../base/systems/actionSystem.js';
import { Util } from '../base/util.js';

class TurnSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static evtDone = 'turn.done';

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
        //this.turnActive = false;
        this.followerTurnStarting = false;
        this.turnPoints = 0;
        // -- follower mgmt
        this.followerQ = {};
        this.followerPoints = {};
        this.followerActive = new Set();
        this.followersDone = false;
        // bind event handler
        this.onActionDone = this.onActionDone.bind(this);
        //this.onTurnDone = this.onTurnDone.bind(this);
        // listen for events
        //this.evt.listen(EndTurnAction.evtEndTurn, this.onTurnDone);
        this.evt.listen(Action.evtDone, this.onActionDone);
        this.active = false;
        // link as main system
        this.constructor._main = this;
    }

    // EVENT HANDLERS ------------------------------------------------------

    onActionDone(evt) {
        let action = evt.action;
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
                Events.trigger(this.constructor.evtDone, {which: 'follower'});
            // -- handle leader free action
            } else {
                if (this.dbg) console.log(`--- leader free action`)
            }
            //this.leaderPoints += evt.action.points;
        // check if action is tied to follower which has queued events
        } else if (evt.actor && this.store.has(evt.actor.gid)) {
            if (this.dbg) console.log(`follower action done ${Fmt.ofmt(evt)}`);
            this.followerActive.add(evt.actor.gid);
            this.active = true
        }
    }

    // METHODS -------------------------------------------------------------
    matchPredicate(e) {
        return e.actionStream;
    }

    prepare(evt) {
        this.followersDone = true;
    }

    iterate(evt, e) {
        // -- skip leader
        if (this.leader && this.leader === e) return;
        // -- check if action points are available...
        let spentPoints = this.followerPoints[e.gid] || 0;
        // -- skip non-active entities (if turn is not starting)
        if (!this.followerTurnStarting && !this.followerActive.has(e.gid)) {
            this.followersDone &= (spentPoints === this.turnPoints);
            return;
        }
        if (spentPoints >= this.turnPoints) return;
        // -- determine next action
        let action;
        if (this.followerQ.hasOwnProperty(e.gid)) {
            // -- pull from q
            action = this.followerQ[e.gid];
            delete this.followerQ[e.gid];
        } else {
            // -- pull from stream
            action = e.actionStream.next().value;
        }
        // -- if no next action (nothing to do)... so return
        if (!action) {
            // null action results in entity being done with turn
            this.followerPoints[e.gid] = this.turnPoints;
            return;
        }
        // check if action can be started
        if (spentPoints + action.points <= this.turnPoints) {
            ActionSystem.assign(e, action);
            this.followerPoints[e.gid] = spentPoints + action.points;
        // otherwise, action needs to be queued
        } else {
            // adjust cost of action (still guaranteed to be > 0 due to if/else clause)
            action.cost -= (this.turnPoints-spentPoints);
            this.followerPoints[e.gid] = this.turnPoints;
            this.followerQ[e.gid] = action;
        }
        // follower is done if they have spent all their points
        this.followersDone &= (spentPoints === this.turnPoints);

    }

    finalize(evt) {
        // clear marked followers
        this.followerActive.clear();
        this.active = false;
        this.followerTurnStarting = false;
        // check if all followers are done
        if (this.followersDone) {
            if (this.dbg) console.log(`=== STARTING LEADER TURN`)
            this.leaderTurn = true;
            this.startLeaderAction();
            Events.trigger(this.constructor.evtDone, {which: 'leader'});
        }
    }

    startLeaderAction() {
        if (Util.empty(this.leader.actions) && !Util.empty(this.leaderQ)) {
            let action = this.leaderQ.shift();
            if (action.points > 0) {
                // followers will be able to take actions <= leader action points on next follower turn
                this.turnPoints = action.points;
            }
            // assign leader action
            ActionSystem.assign(this.leader, action);
        }
    }

    postLeaderAction(action) {
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