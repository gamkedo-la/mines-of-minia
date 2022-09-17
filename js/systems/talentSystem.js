export { TalentSystem };

import { Events } from '../base/event.js';
import { Fmt } from '../base/fmt.js';
import { System } from '../base/system.js';
import { UpdateSystem } from '../base/systems/updateSystem.js';
import { BonkersCharm } from '../charms/bonkers.js';
import { Charm } from '../charms/charm.js';
import { EfficiencyCharm } from '../charms/efficiency.js';
import { ShieldCharm } from '../charms/shield.js';

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
            efficiency: 2,
            shielding: 1,
            gems: 2,
            bonkers: 3,
        }
        this.onPlayerUpdate = this.onPlayerUpdate.bind(this);
        this.onCharacterDamaged = this.onCharacterDamaged.bind(this);
        this.onItemUsed = this.onItemUsed.bind(this);
        this.onEquipChanged = this.onEquipChanged.bind(this);
        Events.listen('character.damaged', this.onCharacterDamaged);
        Events.listen('item.use', this.onItemUsed);
        Events.listen('equip.changed', this.onEquipChanged);
    }
    destroy() {
        super.destroy();
        if (this.player) this.player.evt.ignore(this.player.constructor.evtUpdated, this.onPlayerUpdate);
        Events.ignore('character.damaged', this.onCharacterDamaged);
        Events.ignore('item.use', this.onItemUsed);
        Events.ignore('equip.changed', this.onEquipChanged);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onEntityAdded(evt) {
        if (evt.actor && evt.actor.cls === 'Player') {
            this.player = evt.actor;
            this.player.evt.listen(this.player.constructor.evtUpdated, this.onPlayerUpdate);
            console.log(`-- ${this} player emerged: ${this.player}`);
            this.applyPlayerBuffs();
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

    onCharacterDamaged(evt) {
        console.log(`onCharacterDamaged: ${Fmt.ofmt(evt)}`);
        if (evt.actor !== this.player) return;
        if (evt.critical && this.current.shielding) {
            this.addShieldCharm();
        }
    }

    onPlayerUpdate(evt) {
        // check for player health updates
        if (evt.update && evt.update.health) {
            if (this.player.health === this.player.healthMax) {
                this.addEfficiencyCharm();
            }
        }
    }

    onItemUsed(evt) {
        // -- GEMS implementation
        if (this.current.gems && evt.actor && evt.actor.cls === 'Gem') {
            let actor = this.player;
            let amt = this.current.gems * 5;
            let health = Math.min(actor.healthMax, actor.health+amt);
            if (health !== actor.health) {
                console.log(`-- setting player health: ${health}`);
                UpdateSystem.eUpdate(actor, {health: health });
            }
        }
    }

    onEquipChanged(evt) {
        console.log(`${this} onEquipChanged: ${Fmt.ofmt(evt)}`);
        if (evt.actor !== this.player) return;
        if (evt.slot !== 'weapon') return;
        if (!evt.target) return;
        if (evt.target.kind === 'bonk' && this.current.bonkers) {
            this.addBonkersCharm();
        }
    }

    // METHODS -------------------------------------------------------------
    addShieldCharm() {
        let lvl = this.current.shielding;
        let amt = 5*lvl;
        let oldCharm = Charm.find(this.player, 'ShieldCharm');
        if (oldCharm) {
            oldCharm.replenish('critical', amt);
        } else {
            let charm = new ShieldCharm({ tag: 'critical', amounts: {'critical': amt} });
            console.log(`linking charm: ${charm}`);
            charm.link(this.player);
        }
    }

    addEfficiencyCharm() {
        let lvl = this.current.efficiency;
        let oldCharm = Charm.find(this.player, 'EfficiencyCharm');
        if (oldCharm) {
            if (oldCharm.lvl !== lvl) {
                oldCharm.unlink();
            } else {
                return;
            }
        }
        let charm = new EfficiencyCharm({ lvl: lvl});
        console.log(`linking charm: ${charm}`);
        charm.link(this.player);
    }

    addBonkersCharm() {
        let lvl = this.current.bonkers;
        let oldCharm = Charm.find(this.player, 'BonkersCharm');
        if (oldCharm) {
            if (oldCharm.lvl !== lvl) {
                oldCharm.unlink();
            } else {
                return;
            }
        }
        let charm = new BonkersCharm({ lvl: lvl });
        console.log(`linking charm: ${charm}`);
        charm.link(this.player);
    }

    applyPlayerBuffs() {
        // player at max health?
        if (this.player.health === this.player.healthMax) {
            // EFFICIENCY implementation
            if (this.current.efficiency) {
                this.addEfficiencyCharm();
            }
        }
        if (this.player.inventory && this.player.inventory.weapon && this.player.inventory.weapon.kind === 'bonk') {
            // BONKERS implementation
            if (this.current.bonkers) {
                this.addBonkersCharm();
            }
        }
    }

}