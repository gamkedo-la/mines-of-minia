export { Game };

import { Assets } from "./assets.js";
import { Config } from './config.js';
import { Events, EvtStream } from "./event.js";
import { Fmt } from "./fmt.js";
import { GameState } from "./gameState.js";
import { Keys } from "./keys.js";
import { Systems } from "./system.js";
import { MouseSystem } from "./systems/mouseSystem.js";
import { Timer } from "./timer.js";
import { Util } from "./util.js";
import { UxCanvas } from "./uxCanvas.js";


/**
 * class for static/global game state management, including initial game loading of assets, initializating and starting of global game state
 */
class Game {
    // STATIC VARIABLES ----------------------------------------------------
    static evtTock = 'game.tock';
    static evtStarted = 'game.started';
    static evtInteracted = 'game.interacted';
    static evtStateChanged = 'game.statechanged';
    static dbg = false;
    static evt = Events.main;
    static assetRefs = [];
    static states = {
        'play': new GameState(),
    }
    static _assets = null;
    static currentState = null;
    static startStateTag = 'play';
    static config = {};

    // STATIC PROPERTIES ---------------------------------------------------
    static get assets() {
        if (this.currentState) {
            return this.currentState.assets;
        }
        return this._assets;
    }

    // STATIC METHODS ------------------------------------------------------
    static async _init() {
        if (this.dbg) console.log(`${this.name} starting initialization`);
        // -- bind event handlers
        this.onInteract = this.onInteract.bind(this);
        this.onTock = this.onTock.bind(this);
        this.onStateChanged = this.onStateChanged.bind(this);
        // -- config
        Config.init(this.config);
        // -- assets
        this._assets = new Assets({refs: this.assetRefs, main: true});
        Keys.init( { dbg: Util.getpath(Config, 'dbg.keys') });
        UxCanvas.getCanvas().addEventListener('click', this.onInteract, {once: true});
        Events.listen(Keys.evtDown, this.onInteract, EvtStream.once);
        Events.listen(this.evtStateChanged, this.onStateChanged)
        await this.init();
        if (this.dbg) console.log(`${this.name} initialization complete`);
        return Promise.resolve();
    }
    static async init() {
        return Promise.resolve();
    }

    static async _load() {
        if (this.dbg) console.log(`${this.name} starting loading`);
        await this._assets.load();
        await this.load();
        if (this.dbg) console.log(`${this.name} loading complete`);
        return Promise.resolve();
    }
    static async load() {
        return Promise.resolve();
    }

    static async _ready() {
        if (this.dbg) console.log(`${this.name} starting ready`);
        // -- bring game systems online
        await this.readySystems();
        await this.ready();
        if (this.dbg) console.log(`${this.name} ready complete`);
        return Promise.resolve();
    }
    static async readySystems() {
        Systems.add('mouse', new MouseSystem({dbg: Util.getpath(Config, 'dbg.system.mouse')}));
        return Promise.resolve();
    }
    static async ready() {
        return Promise.resolve();
    }

    static onInteract(evt) {
        console.log(`--- onInteract`);
        Events.trigger(this.evtInteracted);
    }

    static onTock(evt) {
    }

    static onStateChanged(evt) {
        console.log(`onStateChanged: ${Fmt.ofmt(evt)}`);
        let newState = evt.state;
        let data = evt.data;
        if (newState && newState !== this.currentState) {
            new Timer({ttl: 0, cb: () => {this.startState(newState, data)}});
        }
    }

    static async start() {
        // initialization
        await this._init();
        // load
        await this._load();
        // ready
        await this._ready();
        // load starting state
        this.startState(this.startStateTag);
    }

    static startState(tag, data) {
        console.log(`startState`);
        let state = this.states[tag];
        if (!state) {
            console.error(`invalid state: ${tag}`);
            return;
        }
        // stop current state
        if (this.currentState) {
            this.currentState.stop();
        }
        // start new state
        state.start(data);
        this.currentState = state;
    }

}