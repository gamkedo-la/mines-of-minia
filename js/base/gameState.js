export { GameState };

import { Assets } from "./assets.js";
import { Events } from "./event.js";
import { Fmt } from "./fmt.js";

class GameState {
    // STATIC VARIABLES ----------------------------------------------------
    static assetRefs = [];
    static initialized = false;
    static evtInitialized = 'state.initialized';
    static evtLoaded = 'state.loaded';
    static evtStarted = 'state.started';
    static evt = Events.main;
    static dbg = true;
    static tag = 'play';

    // STATIC METHODS ------------------------------------------------------
    static _init() {
        this.init();
        this.initialized = true;
    }

    /**
     * Abstract static class initialization -- override to add functionality to state initialization
     */
    static init() {
    }

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    constructor(spec={}) {
        // -- static class initialization
        if (!this.constructor.initialized) this.constructor._init();
        this.assets = new Assets({refs: this.constructor.assetRefs, extends: Assets.main});
        this.evt = spec.evt || this.constructor.evt;
        this.dbg = spec.hasOwnProperty('dbg') ? spec.dbg : this.constructor.dbg;
        this.tag = spec.tag || this.constructor.tag;
        this.initialized = false;
        this.loaded = false;
        this.readied = false;
    }
    destroy() {
    }

    // EVENT HANDLERS ------------------------------------------------------

    // METHODS -------------------------------------------------------------
    async _init() {
        if (this.dbg) console.log(`${this} starting initialization`);
        await this.init();
        if (this.dbg) console.log(`${this} initialization complete`);
        this.initialized = true;
        return Promise.resolve();
    }
    async init() {
        return Promise.resolve();
    }

    async _load() {
        if (this.dbg) console.log(`${this} starting loading`);
        await this.assets.load();
        await this.load();
        if (this.dbg) console.log(`${this} loading complete`);
        this.loaded = true;
        return Promise.resolve();
    }
    async load() {
        return Promise.resolve();
    }

    async _ready() {
        if (this.dbg) console.log(`${this} starting ready`);
        await this.ready();
        if (this.dbg) console.log(`${this} ready complete`);
        this.readied = true;
        return Promise.resolve();
    }
    async ready() {
        return Promise.resolve();
    }

    async start() {
        // initialization
        if (!this.initialized) {
            await this._init();
        }
        // load
        if (!this.loaded) {
            await this._load();
        }
        // ready
        if (!this.readied) {
            await this._ready();
        }
    }

    stop() {
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.tag);
    }

}