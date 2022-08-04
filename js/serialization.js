export { Serialization };

import { Config } from './base/config.js';
import { Fmt } from './base/fmt.js';
import { Generator } from './base/generator.js';
import { Storage } from './base/storage.js';
import { Cog } from './entities/cog.js';
import { Gem } from './entities/gem.js';

class Serialization {

    static saveLevel(lvl) {
        let key = `lvl${lvl.index}`;
        let data = {
            index: lvl.index,
            entities: [],
            fowIdxs: Array.from(lvl.fowIdxs),
            fowMasks: Object.assign({}, lvl.fowMasks),
        };
        // -- level data
        for (const e of lvl.grid) {
            // -- skip player
            if (e.cls === 'Player') continue;
            // -- skip tiles
            if (e.cls === 'Tile') continue;
            // -- skip duplicates
            if (data.entities.some((v) => v.gid === e.gid)) continue;
            // serialize entity
            let x_e = e.as_kv();
            data.entities.push(x_e);
        }
        //console.log(`save data: ${Fmt.ofmt(data)} entities: ${Fmt.ofmt(data.entities)}`);
        Storage.setItem(key, data);
    }

    static savePlayer(player) {
        let key = `player`;
        let data = player.as_kv();
        Storage.setItem(key, data);
    }

    static saveGemState() {
        let key = `gems`;
        let data = Gem.as_kv();
        Storage.setItem(key, data);
    }

    static saveCogState() {
        let key = `cogs`;
        let data = Cog.as_kv();
        Storage.setItem(key, data);
    }

    static saveGameState(state) {
        let key = `game`;
        let data = {
            index: state.lvl.index,
        };
        Storage.setItem(key, data);
    }

    static save(state) {
        // -- level
        this.saveLevel(state.lvl);
        // -- player
        this.savePlayer(state.player);
        // -- gem state
        this.saveGemState();
        // -- cog state
        this.saveCogState();
        // -- game state
        this.saveGameState(state);
    }

    static loadPlayer() {
        let key = `player`;
        let x_player = Storage.getItem(key);
        //Generator.instance.dbg = true;
        let player = Generator.generate(x_player);
        //Generator.instance.dbg = false;
        return player;
    }

    static loadGameState() {
        return Storage.getItem('game');
    }

    static loadLevel(lvl) {
        let key = `lvl${lvl}`;
        let x_lvl = Storage.getItem(key);
        return x_lvl;
    }

    static reset() {
        //console.log(`-- reset`);
        // level data
        for (let i=1; i<Config.maxLvl; i++) {
            let key = `lvl${i}`;
            //console.log(`== clear level ${key}`);
            Storage.removeItem(key);
        }
        // player data
        Storage.removeItem('player');
        // cogs
        Storage.removeItem('cogs');
        // gems
        Storage.removeItem('gems');
        // game
        Storage.removeItem('game');

    }

}