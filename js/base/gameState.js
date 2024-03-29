export { GameState };

import { Assets } from "./assets.js";
import { Events } from "./event.js";
import { Fmt } from "./fmt.js";

/**
 * A generic game state
 * Lifecycle
 * -- init -> load -> ready -> started -V
 *                     ^-  stopped <-
 *                    
 */
class GameState {
    // STATIC VARIABLES ----------------------------------------------------
    static assetRefs = [];
    static initialized = false;
    static evtInitialized = 'state.initialized';
    static evtLoaded = 'state.loaded';
    static evtStarted = 'state.started';
    static evt = Events.main;
    static dbg = false;
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
    /**
     * init is called only once during state lifetime (when state is first started, before any other setup)
     * -- intended to create required state/variables for the given game state
     * -- override init() for state specific init functionality
     * @param {*} data 
     * @returns 
     */
    async _init(data) {
        if (this.dbg) console.log(`${this} starting initialization`);
        await this.init(data);
        if (this.dbg) console.log(`${this} initialization complete`);
        this.initialized = true;
        return Promise.resolve();
    }
    async init(data) {
        return Promise.resolve();
    }

    /**
     * load is called once during state lifetime (when state is first started but after initialization)
     * -- intended to load assets or other setup that needs to occur after initial state setup.
     * -- override load() for state specific load functionality
     * @param {*} data 
     * @returns 
     */
    async _load(data) {
        if (this.dbg) console.log(`${this} starting loading`);
        await this.assets.load();
        await this.load(data);
        if (this.dbg) console.log(`${this} loading complete`);
        this.loaded = true;
        return Promise.resolve();
    }
    async load(data) {
        return Promise.resolve();
    }

    /**
     * ready is called every time a state is started
     * @param {*} data 
     * @returns 
     */
    async _ready(data) {
        if (this.dbg) console.log(`${this} starting ready`);
        await this.ready(data);
        if (this.dbg) console.log(`${this} ready complete`);
        this.readied = true;
        return Promise.resolve();
    }
    async ready(data) {
        return Promise.resolve();
    }

    async start(data) {
        // initialization
        if (!this.initialized) {
            await this._init(data);
        }
        // load
        if (!this.loaded) {
            await this._load(data);
        }
        // ready
        await this._ready(data);
    }

    stop() {
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.tag);
    }

}