import { Fmt } from './base/fmt.js';
import { Generator } from './base/generator.js';
import { Storage } from './base/storage.js';
import { Cog } from './entities/cog.js';
import { Gem } from './entities/gem.js';

export { Serialization };

class Serialization {

    static saveLevel(lvl) {
        let key = `lvl${lvl.index}`;
        let data = {
            index: lvl.index,
            entities: [],
            fowIdxs: Array.from(lvl.fowIdxs),
        };
        // -- level data
        for (const e of lvl.grid) {
            // -- skip player
            if (e.cls === 'Player') continue;
            // -- skip tiles
            if (e.cls === 'Tile') continue;
            // serialize entity
            let x_e = e.as_kv();
            data.entities.push(x_e);
        }
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

    static save(state) {

        // -- level
        this.saveLevel(state.lvl);
        // -- player
        this.savePlayer(state.player);
        // -- gem state
        this.saveGemState();
        // -- cog state
        this.saveCogState();

    }

    static loadPlayer() {
        let key = `player`;
        let x_player = Storage.getItem(key);
        console.log(`x_player: ${Fmt.ofmt(x_player)}`);
        // FIXME
        x_player.idx = 0;
        return Generator.generate(x_player);
    }

    static load() {
    }

}