export { miniaAssets };

import { Animation, Cel } from './base/animation.js';
import { Animator } from './base/animator.js';
import { AssetRef, SheetRef, ImageRef, SfxRef } from './base/assets.js';
import { Rect } from './base/rect.js';
import { Sfx } from './base/sfx.js';
import { Shape } from './base/shape.js';
import { Sketch } from './base/sketch.js';
import { Sprite } from './base/sprite.js';
import { StretchSprite } from './base/stretchSprite.js';
import { Weapon } from './entities/weapon.js';
import { Template } from './template.js';

let miniaAssets = [

    Shape.xspec({
        tag: 'range.yellow',
        fill: true,
        verts: [ {x:2, y:7}, {x:14, y:7}, {x:14, y:9}, {x:2, y:9} ],
        border: 1,
        color: 'yellow',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'projectile.yellow',
        fill: true,
        verts: [ {x:7, y:7}, {x:9, y:7}, {x:9, y:9}, {x:7, y:9} ],
        border: 1,
        color: 'yellow',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'stairs_up',
        fill: true,
        verts: [ 
            {x:8, y:2}, {x:14, y:8}, {x:14, y:14}, {x:2, y:14}, {x:2, y:8},
        ],
        border: 1,
        color: 'gray',
        borderColor: 'red',
    }),
    Shape.xspec({
        tag: 'stairs_down',
        fill: true,
        verts: [ 
            {x:8, y:14}, {x:2, y:8}, {x:2, y:2}, {x:14, y:2}, {x:14, y:8},
        ],
        border: 1,
        color: 'gray',
        borderColor: 'red',
    }),

    /*
    Shape.xspec({
        tag: 'gem.blue',
        fill: true,
        verts: [ 
            {x:8, y:2}, {x:14, y:8}, {x:8, y:14}, {x:2, y:8},
        ],
        border: 1,
        color: 'blue',
        borderColor: 'red',
    }),
    */

    Shape.xspec({
        tag: 'gem.gold',
        fill: true,
        verts: [ 
            {x:8, y:2}, {x:14, y:8}, {x:8, y:14}, {x:2, y:8},
        ],
        border: 1,
        color: 'gold',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'key.gold',
        fill: true,
        verts: [ 
            {x:2, y:8}, {x:5, y:5}, {x:7, y:7}, {x:14, y:7},
            {x:14, y:11}, {x:12, y: 11}, {x:12, y: 9}, {x:7, y:9}, {x:5, y:11}
        ],
        border: 1,
        color: 'gold',
        borderColor: 'red',
    }),
    Shape.xspec({
        tag: 'key.blue',
        fill: true,
        verts: [ 
            {x:2, y:8}, {x:5, y:5}, {x:7, y:7}, {x:14, y:7},
            {x:14, y:11}, {x:12, y: 11}, {x:12, y: 9}, {x:7, y:9}, {x:5, y:11}
        ],
        border: 1,
        color: 'blue',
        borderColor: 'red',
    }),
    Shape.xspec({
        tag: 'key.dark',
        fill: true,
        verts: [ 
            {x:2, y:8}, {x:5, y:5}, {x:7, y:7}, {x:14, y:7},
            {x:14, y:11}, {x:12, y: 11}, {x:12, y: 9}, {x:7, y:9}, {x:5, y:11}
        ],
        border: 1,
        color: 'rgba(75,75,75,1)',
        borderColor: 'red',
    }),
    //Rect.xspec({tag: 'token', width: 12, height: 8, color: 'gold', borderColor: 'red', border: 1}),
    Rect.xspec({tag: 'reactor', width: 8, height: 12, color: 'green', borderColor: 'red', border: 2}),
    Rect.xspec({tag: 'fuelcell', width: 8, height: 12, color: 'blue', borderColor: 'red', border: 1}),
    Rect.xspec({tag: 'reticle.aim.ok', width: 12, height: 12, borderColor: 'green', border: 1, fill: false}),
    Rect.xspec({tag: 'reticle.aim.nok', width: 12, height: 12, borderColor: 'red', border: 1, fill: false}),

    Rect.xspec({tag: 'oframe.red', width: 16, height: 16, color: 'black', borderColor: 'red', border: 3}),
    Rect.xspec({tag: 'frame.red', width: 16, height: 16, borderColor: 'red', border: 3, fill: false}),
    Rect.xspec({tag: 'frame.red.2', width: 16, height: 16, borderColor: 'red', border: 6, fill: false}),
    Rect.xspec({tag: 'frame.blue', width: 16, height: 16, borderColor: 'blue', border: 3, fill: false}),
    Rect.xspec({tag: 'frame.blue.2', width: 16, height: 16, borderColor: 'blue', border: 6, fill: false}),
    Rect.xspec({tag: 'frame.yellow', width: 16, height: 16, borderColor: 'yellow', border: 3, fill: false}),
    Rect.xspec({tag: 'frame.yellow.2', width: 16, height: 16, borderColor: 'yellow', border: 6, fill: false}),
    Rect.xspec({tag: 'frame.green', width: 16, height: 16, borderColor: 'green', border: 3, fill: false}),
    Rect.xspec({tag: 'frame.green.2', width: 16, height: 16, borderColor: 'green', border: 6, fill: false}),

    Rect.xspec({tag: 'door.close', width: 16, height: 16, color: 'red'}),
    Rect.xspec({tag: 'door.open', width: 16, height: 16, borderColor: 'green', fill: false, border: 2}),
    Rect.xspec({tag: 'idle', width: 12, height: 12, color: 'green'}),
    Rect.xspec({tag: 'melee', width: 12, height: 12, color: 'red'}),
    Rect.xspec({tag: 'dying', width: 12, height: 12, color: 'black'}),

    Animation.xspec({tag: 'gem.blue', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
    ]}),

    Animation.xspec({tag: 'reactor.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'reactor.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'reactor.1',
        sketches: {
            'carry': new AssetRef({tag: 'reactor.1.carry'}),
            'free': new AssetRef({tag: 'reactor.1.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'reactor.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'reactor.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'reactor.2',
        sketches: {
            'carry': new AssetRef({tag: 'reactor.2.carry'}),
            'free': new AssetRef({tag: 'reactor.2.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'reactor.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'reactor.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/reactor.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'reactor.3',
        sketches: {
            'carry': new AssetRef({tag: 'reactor.3.carry'}),
            'free': new AssetRef({tag: 'reactor.3.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'poke.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'poke.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'poke.1',
        sketches: {
            'carry': new AssetRef({tag: 'poke.1.carry'}),
            'free': new AssetRef({tag: 'poke.1.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'poke.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'poke.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'poke.2',
        sketches: {
            'carry': new AssetRef({tag: 'poke.2.carry'}),
            'free': new AssetRef({tag: 'poke.2.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'poke.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'poke.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/poke.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'poke.3',
        sketches: {
            'carry': new AssetRef({tag: 'poke.3.carry'}),
            'free': new AssetRef({tag: 'poke.3.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'hack.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'hack.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'hack.1',
        sketches: {
            'carry': new AssetRef({tag: 'hack.1.carry'}),
            'free': new AssetRef({tag: 'hack.1.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'hack.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'hack.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'hack.2',
        sketches: {
            'carry': new AssetRef({tag: 'hack.2.carry'}),
            'free': new AssetRef({tag: 'hack.2.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'hack.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'hack.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/hack.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'hack.3',
        sketches: {
            'carry': new AssetRef({tag: 'hack.3.carry'}),
            'free': new AssetRef({tag: 'hack.3.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Sprite.xspec({tag: 'chest.brown.close', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*0, y: 0})}),
    Sprite.xspec({tag: 'chest.brown.open', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*1, y: 0})}),
    Animation.xspec({tag: 'chest.brown.opening', loop: false, x_cels: [
        Cel.xspec({sketch: new AssetRef({tag: 'chest.brown.open'}), ttl: 300 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({sketch: new AssetRef({tag: 'chest.brown.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({sketch: new AssetRef({tag: 'chest.brown.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'chest.brown',
        sketches: {
            'close': new AssetRef({tag: 'chest.brown.close'}),
            'open': new AssetRef({tag: 'chest.brown.opening'}),
        },
        state: 'close',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),
    //Sprite.xspec({tag: 'blueChest.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 32*1, y: 0}),
    //Sprite.xspec({tag: 'greyChest.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 32*2, y: 0}),
    //Sprite.xspec({tag: 'greenChest.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 32*3, y: 0}),
    //Sprite.xspec({tag: 'brownChestopen.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 32*0, y: 16})}),
    //Sprite.xspec({tag: 'blueChestopen.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 32*1, y: 16}),
    //Sprite.xspec({tag: 'greyChestopen.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 32*2, y: 16}),
    //Sprite.xspec({tag: 'greenChestopen.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 32*3, y: 16}),
    
    //Sprite.xspec({tag: 'brownChestKey.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32*0, y: 32})}),
    //Sprite.xspec({tag: 'blueChestKey.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32*1, y: 32})}),
    //Sprite.xspec({tag: 'greyChestKey.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32*2, y: 32})}),
    //Sprite.xspec({tag: 'greenChestKey.test', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32*3, y: 32})}),
    Sprite.xspec({tag: 'player_portrait', img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 32*0, y: 0})}),

    Animation.xspec({tag: 'player_idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 250 }),
    ]}),

    Animation.xspec({tag: 'player_mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'player_movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/player.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 250 }),
    ]}),
    Animator.xspec({
        tag: 'player',
        sketches: {
            'idler': new AssetRef({tag: 'player_idler'}),
            'idlel': new AssetRef({tag: 'player_idlel'}),
            'mover': new AssetRef({tag: 'player_mover'}),
            'movel': new AssetRef({tag: 'player_movel'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'golem_idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'golem_mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*9, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*10, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*11, y: 0})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'golem_idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*12, y: 0})}), ttl: 350 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*13, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*14, y: 0})}), ttl: 250 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*15, y: 0})}), ttl: 250 }),
    ]}),
    Animation.xspec({tag: 'golem_movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*16, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*17, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*18, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*19, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*21, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*22, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*23, y: 0})}), ttl: 50 }),
    ]}),

    Animation.xspec({tag: 'golem_dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*24, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*25, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*26, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*27, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*28, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*29, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*30, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*29, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*30, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*29, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*30, y: 0})}), ttl: 150 }),
    ]}),

    Animation.xspec({tag: 'golem_dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*31, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*32, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*33, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*34, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*35, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*36, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*37, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*36, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*37, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*36, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/golem.png', width: 16, height: 32, x: 16*37, y: 0})}), ttl: 150 }),
    ]}),

    Animator.xspec({
        tag: 'golem',
        sketches: {
            'idler': new AssetRef({tag: 'golem_idler'}),
            'idlel': new AssetRef({tag: 'golem_idlel'}),
            'mover': new AssetRef({tag: 'golem_mover'}),
            'movel': new AssetRef({tag: 'golem_movel'}),
            'dyingr': new AssetRef({tag: 'golem_dyingr'}),
            'dyingl': new AssetRef({tag: 'golem_dyingl'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'cog_brass', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/brass_cog.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/brass_cog.png', width: 16, height: 16, x: 16, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/brass_cog.png', width: 16, height: 16, x: 32, y: 0})}), ttl: 150 }),
    ]}),

    Animator.xspec({
        tag: 'door',
        sketches: {
            'close': new AssetRef({tag: 'door.close'}),
            'open': new AssetRef({tag: 'door.open'}),
        },
        state: 'close',
    }),
    Animator.xspec({
        tag: 'enemy',
        sketches: {
            'idle': new AssetRef({tag: 'idle'}),
            'melee': new AssetRef({tag: 'melee'}),
            'dying': new AssetRef({tag: 'dying'}),
        },
        state: 'idle',
    }),
    Sfx.xspec({ tag: 'test.sound', audio: new SfxRef({src: 'snd/test.mp3'}) }),
    Sfx.xspec({ tag: 'gem.break', audio: new SfxRef({src: 'snd/gem-break.mp3'}) }),
    Sfx.xspec({ tag: 'trap.trigger', audio: new SfxRef({src: 'snd/pick-up-item.mp3'}) }),
    Sfx.xspec({ tag: 'player.pickup', audio: new SfxRef({src: 'snd/pickup-ding.mp3'}), volume: .25 }),
    Sfx.xspec({ tag: 'blip.1', audio: new SfxRef({src: 'snd/blip-1.mp3'}) }),
    Sfx.xspec({ tag: 'player.step', audio: new SfxRef({src: 'snd/step-motor-whir-3.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'menu.click', audio: new SfxRef({src: 'snd/click.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'item.drop', audio: new SfxRef({src: 'snd/wet-thud.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'item.throw', audio: new SfxRef({src: 'snd/arrow-shoot.mp3'}), volume: .3, loop: false }),
    Sfx.xspec({ tag: 'item.throwHit', audio: new SfxRef({src: 'snd/hit-bolt.mp3'}), volume: .5, loop: false }),
    ...Template.walls('img/rock-walls.png', 'rock.wall'),
    ...Template.tiles('img/rock-floor.png', 'rock.floor', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    ...Template.tiles('img/rock-pit.png', 'rock.pit'),
    ...Template.tiles('img/rock-pit-border.png', 'rock.pit.border', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    ...Template.walls('img/rock-outcrop.png', 'rock.outcrop', { vars: { z: [[3,1],[3,2],[3,3],[3,4]]}}),
    ...Template.tiles('img/rock-outcrop-border.png', 'rock.outcrop.border', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),

    StretchSprite.xspec({tag: 'hud.border', border: 27, img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 0, y: 16*4, scalex: 3, scaley: 3})}),
    Sprite.xspec({tag: 'hud.portrait', img: new SheetRef({src: 'img/hud.png', width: 48, height: 48, x: 0, y: 0})}),
    Sprite.xspec({tag: 'hud.bar', img: new SheetRef({src: 'img/hud.png', width: 80, height: 16, x: 16*3, y: 0})}),
    Sprite.xspec({tag: 'hud.button.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*8, y: 16*0})}),
    Sprite.xspec({tag: 'hud.button.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*8, y: 16*2})}),
    Sprite.xspec({tag: 'hud.button.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*8, y: 16*4})}),
    Sprite.xspec({tag: 'hud.sbutton.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*12, y: 16*0})}),
    Sprite.xspec({tag: 'hud.sbutton.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*12, y: 16*2})}),
    Sprite.xspec({tag: 'hud.sbutton.bg', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*12, y: 16*4})}),
    Sprite.xspec({tag: 'hud.gbutton.unpressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*14, y: 16*0})}),
    Sprite.xspec({tag: 'hud.gbutton.pressed', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*14, y: 16*2})}),
    Sprite.xspec({tag: 'hud.gbutton.highlight', img: new SheetRef({src: 'img/hud.png', width: 32, height: 32, x: 16*14, y: 16*4})}),

    Sprite.xspec({tag: 'funguy', img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*0, y: 16*0})}),

    Animation.xspec({tag: 'token.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'token.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/token.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'token',
        sketches: {
            'carry': new AssetRef({tag: 'token.carry'}),
            'free': new AssetRef({tag: 'token.free'}),
        },
        state: 'free',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

];