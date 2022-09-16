export { TalentSystem };

import { System } from '../base/system.js';

class TalentSystem extends System {
    static talents = {
        // -- TIER 1
        golddigger: {
            tier: 1,
            name: 'Gold Digger',
            description: 'when defeating enemies loot more gold (10/20/30%)',
        },
        efficiency: {
            tier: 1,
            name: 'Efficiency',
            description: 'when at max health, player is more efficient, burning less fuel (10/20/30%)',
        },
        shielding: {
            tier: 1,
            name: 'Critical Shielding',
            description: 'when landing a critical hit, add shielding that blocks all damage (5/10/15 damage)',
        },
        gems: {
            tier: 1,
            name: 'Good Gems',
            description: 'whenever the player consumes a gem, player is healed (5/10/15 damage)',
        },

        // -- TIER 2
        bonkers: {
            tier: 2,
            name: 'Bonkers',
            description: 'adds bonus damage for any bonk weapons (5/10/15 damage)',
        },
        pointy: {
            tier: 2,
            name: 'Straight to the Pointy',
            description: 'adds bonus critical hit chance for any poke weapons (5/10/15%)',
        },
        hackety: {
            tier: 2,
            name: 'Hackety Hack Hack',
            description: 'adds bonus hit chance for any hack weapons (5/10/15%)',
        },
        powerage: {
            tier: 2,
            name: 'Maxx Powerage',
            description: 'when at max health, player power regenerates faster (10/20/30%)',
        },

        // -- TIER 3
        frosty: {
            tier: 3,
            name: 'Frosty',
            description: 'player resistance to ice damage increases (10/20/30%)',
        },
        fuego: {
            tier: 3,
            name: 'Fuego',
            description: 'player resistance to fire damage increases (10/20/30%)',
        },
        shocking: {
            tier: 3,
            name: 'Shocking',
            description: 'player resistance to shock damage increases (10/20/30%)',
        },
        darkness: {
            tier: 3,
            name: 'Hello Darkness',
            description: 'player resistance to dark damage increases (10/20/30%)',
        },

    }

    static current = {};

    // CONSTRUCTOR/DESTRUCTOR ----------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.player;
        this.current = {
            golddigger: 3,
        }
    }

    onEntityAdded(evt) {
        if (evt.actor && evt.actor.cls === 'Player') {
            this.player = evt.actor;
            console.log(`-- ${this} player emerged: ${this.player}`);
        }
        // -- GOLDDIGGER implementation
        if (evt.actor && evt.actor.cls === 'Token') {
            let loot = evt.actor;
            if (this.current.golddigger) {
                let lvl = this.current.golddigger || 0;
                let bonus = Math.round((loot.count * lvl)/10);
                if (this.dbg) console.log(`-- ${this} golddigger bonus: ${bonus}`);
                loot.count += bonus;
            }
        }
    }

}