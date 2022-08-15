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
import { Resurrect64 } from './resurrect64.js';
import { Template } from './template.js';

let miniaAssets = [

    Shape.xspec({
        tag: 'projectile.fire',
        fill: true,
        verts: [ {x:7, y:7}, {x:9, y:7}, {x:9, y:9}, {x:7, y:9} ],
        border: 1,
        color: 'orange',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'projectile.dark',
        fill: true,
        verts: [ {x:7, y:7}, {x:9, y:7}, {x:9, y:9}, {x:7, y:9} ],
        border: 1,
        color: 'purple',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'projectile.ice',
        fill: true,
        verts: [ {x:7, y:7}, {x:9, y:7}, {x:9, y:9}, {x:7, y:9} ],
        border: 1,
        color: 'aqua',
        borderColor: 'red',
    }),


    Shape.xspec({
        tag: 'projectile.shock',
        fill: true,
        verts: [ {x:7, y:7}, {x:9, y:7}, {x:9, y:9}, {x:7, y:9} ],
        border: 1,
        color: 'white',
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
    /*
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
    */

    Shape.xspec({
        tag: 'bonk.1',
        fill: true,
        verts: [ 
            {x:2, y:6}, {x:10, y:6}, {x:10, y:4}, {x:14, y:4},
            {x:14, y: 12}, {x:10, y: 12}, {x: 10, y: 10}, { x: 2, y: 10},
        ],
        border: 1,
        color: 'rgba(155,171,178,1)',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'bonk.2',
        fill: true,
        verts: [ 
            {x:2, y:6}, {x:10, y:6}, {x:10, y:4}, {x:14, y:4},
            {x:14, y: 12}, {x:10, y: 12}, {x: 10, y: 10}, { x: 2, y: 10},
        ],
        border: 1,
        color: 'rgba(247,150,23,1)',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'bonk.3',
        fill: true,
        verts: [ 
            {x:2, y:6}, {x:10, y:6}, {x:10, y:4}, {x:14, y:4},
            {x:14, y: 12}, {x:10, y: 12}, {x: 10, y: 10}, { x: 2, y: 10},
        ],
        border: 1,
        color: 'rgba(145,219,105,1)',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'shielding.1',
        fill: true,
        verts: [ 
            {x:4, y:4}, {x:12, y:4}, {x:12, y:12}, {x:4, y:12},
        ],
        border: 1,
        color: 'rgba(155,171,178,1)',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'shielding.2',
        fill: true,
        verts: [ 
            {x:4, y:4}, {x:12, y:4}, {x:12, y:12}, {x:4, y:12},
        ],
        border: 1,
        color: 'rgba(247,150,23,1)',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'shielding.3',
        fill: true,
        verts: [ 
            {x:4, y:4}, {x:12, y:4}, {x:12, y:12}, {x:4, y:12},
        ],
        border: 1,
        color: 'rgba(145,219,105,1)',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'gadget.1',
        fill: true,
        verts: [ 
            {x:6, y:6}, {x:10, y:6}, {x:10, y:10}, {x:6, y:10},
        ],
        border: 1,
        color: 'rgba(155,171,178,1)',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'gadget.2',
        fill: true,
        verts: [ 
            {x:6, y:6}, {x:10, y:6}, {x:10, y:10}, {x:6, y:10},
        ],
        border: 1,
        color: 'rgba(247,150,23,1)',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'gadget.3',
        fill: true,
        verts: [ 
            {x:6, y:6}, {x:10, y:6}, {x:10, y:10}, {x:6, y:10},
        ],
        border: 1,
        color: 'rgba(145,219,105,1)',
        borderColor: 'red',
    }),

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


    Animator.xspec({
        tag: 'trap.test',
        sketches: {
            'armed': new Rect({ width: 10, height: 10, borderColor: 'rgba(255,255,0,.75)', fill: false, border: 1 }),
            'inactive': new Rect({ width: 10, height: 10, borderColor: 'rgba(127,127,127,.75)', fill: false, border: 1 }),
        },
        state: 'armed',
    }),

    Animator.xspec({
        tag: 'growth.test',
        sketches: {
            'armed': new Rect({ width: 10, height: 10, borderColor: 'rgba(0,150,0,.75)', fill: false, border: 1 }),
            'inactive': new Rect({ width: 10, height: 10, borderColor: 'rgba(127,127,127,.75)', fill: false, border: 1 }),
        },
        state: 'armed',
    }),

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
        x_sketches: {
            'carry': new AssetRef({tag: 'reactor.1.carry'}),
            'free': new AssetRef({tag: 'reactor.1.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
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
        x_sketches: {
            'carry': new AssetRef({tag: 'reactor.2.carry'}),
            'free': new AssetRef({tag: 'reactor.2.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
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
        x_sketches: {
            'carry': new AssetRef({tag: 'reactor.3.carry'}),
            'free': new AssetRef({tag: 'reactor.3.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
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
        x_sketches: {
            'carry': new AssetRef({tag: 'poke.1.carry'}),
            'free': new AssetRef({tag: 'poke.1.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
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
        x_sketches: {
            'carry': new AssetRef({tag: 'poke.2.carry'}),
            'free': new AssetRef({tag: 'poke.2.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
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
        x_sketches: {
            'carry': new AssetRef({tag: 'poke.3.carry'}),
            'free': new AssetRef({tag: 'poke.3.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
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
        x_sketches: {
            'carry': new AssetRef({tag: 'hack.1.carry'}),
            'free': new AssetRef({tag: 'hack.1.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
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
        x_sketches: {
            'carry': new AssetRef({tag: 'hack.2.carry'}),
            'free': new AssetRef({tag: 'hack.2.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
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
        x_sketches: {
            'carry': new AssetRef({tag: 'hack.3.carry'}),
            'free': new AssetRef({tag: 'hack.3.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Sprite.xspec({tag: 'chest.brown.close', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*0, y: 0})}),
    Sprite.xspec({tag: 'chest.brown.open', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*1, y: 0})}),
    Animation.xspec({tag: 'chest.brown.opening', loop: false, x_cels: [
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.brown.open'}), ttl: 300 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.brown.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.brown.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'chest.brown',
        x_sketches: {
            'close': new AssetRef({tag: 'chest.brown.close'}),
            'open': new AssetRef({tag: 'chest.brown.opening'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'chest.blue.close', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*0, y: 32})}),
    Sprite.xspec({tag: 'chest.blue.open', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*1, y: 32})}),
    Animation.xspec({tag: 'chest.blue.opening', loop: false, x_cels: [
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.blue.open'}), ttl: 300 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.blue.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.blue.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'chest.blue',
        x_sketches: {
            'close': new AssetRef({tag: 'chest.blue.close'}),
            'open': new AssetRef({tag: 'chest.blue.opening'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'chest.dark.close', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*0, y: 64})}),
    Sprite.xspec({tag: 'chest.dark.open', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*1, y: 64})}),
    Animation.xspec({tag: 'chest.dark.opening', loop: false, x_cels: [
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.dark.open'}), ttl: 300 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.dark.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.dark.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'chest.dark',
        x_sketches: {
            'close': new AssetRef({tag: 'chest.dark.close'}),
            'open': new AssetRef({tag: 'chest.dark.opening'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'chest.green.close', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*0, y: 96})}),
    Sprite.xspec({tag: 'chest.green.open', img: new SheetRef({src: 'img/chest.png', width: 16, height: 32, x: 16*1, y: 96})}),
    Animation.xspec({tag: 'chest.green.opening', loop: false, x_cels: [
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.green.open'}), ttl: 300 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.green.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
        Cel.xspec({x_sketch: new AssetRef({tag: 'chest.green.open'}), ttl: 200 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'chest.green',
        x_sketches: {
            'close': new AssetRef({tag: 'chest.green.close'}),
            'open': new AssetRef({tag: 'chest.green.opening'}),
        },
        state: 'close',
    }),

    Sprite.xspec({tag: 'key.blue', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32, y: 32})}),
    Sprite.xspec({tag: 'key.dark', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32, y: 64})}),
    Sprite.xspec({tag: 'key.green', img: new SheetRef({src: 'img/chest.png', width: 16, height: 16, x: 32, y: 96})}),

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
        x_sketches: {
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
        x_sketches: {
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

    Rect.xspec({tag: 'door.brown.close', width: 16, height: 16, color: 'brown'}),
    Rect.xspec({tag: 'door.brown.open', width: 16, height: 16, borderColor: 'brown', fill: false, border: 2}),
    Animator.xspec({
        tag: 'door.brown',
        x_sketches: {
            'close': new AssetRef({tag: 'door.brown.close'}),
            'open': new AssetRef({tag: 'door.brown.open'}),
        },
        state: 'close',
    }),

    Rect.xspec({tag: 'door.blue.close', width: 16, height: 16, color: 'blue'}),
    Rect.xspec({tag: 'door.blue.open', width: 16, height: 16, borderColor: 'blue', fill: false, border: 2}),
    Animator.xspec({
        tag: 'door.blue',
        x_sketches: {
            'close': new AssetRef({tag: 'door.blue.close'}),
            'open': new AssetRef({tag: 'door.blue.open'}),
        },
        state: 'close',
    }),

    Rect.xspec({tag: 'door.dark.close', width: 16, height: 16, color: 'gray'}),
    Rect.xspec({tag: 'door.dark.open', width: 16, height: 16, borderColor: 'gray', fill: false, border: 2}),
    Animator.xspec({
        tag: 'door.dark',
        x_sketches: {
            'close': new AssetRef({tag: 'door.dark.close'}),
            'open': new AssetRef({tag: 'door.dark.open'}),
        },
        state: 'close',
    }),

    Rect.xspec({tag: 'door.green.close', width: 16, height: 16, color: 'green'}),
    Rect.xspec({tag: 'door.green.open', width: 16, height: 16, borderColor: 'green', fill: false, border: 2}),
    Animator.xspec({
        tag: 'door.green',
        x_sketches: {
            'close': new AssetRef({tag: 'door.green.close'}),
            'open': new AssetRef({tag: 'door.green.open'}),
        },
        state: 'close',
    }),

    Rect.xspec({tag: 'idle', width: 12, height: 12, color: 'green'}),
    Rect.xspec({tag: 'melee', width: 12, height: 12, color: 'red'}),
    Rect.xspec({tag: 'dying', width: 12, height: 12, color: 'black'}),
    Animator.xspec({
        tag: 'enemy',
        x_sketches: {
            'idle': new AssetRef({tag: 'idle'}),
            'melee': new AssetRef({tag: 'melee'}),
            'dying': new AssetRef({tag: 'dying'}),
        },
        state: 'idle',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Sfx.xspec({ tag: 'test.sound', audio: new SfxRef({src: 'snd/test.mp3'}) }),
    Sfx.xspec({ tag: 'gem.break', audio: new SfxRef({src: 'snd/gem-break.mp3'}) }),
    Sfx.xspec({ tag: 'trap.trigger', audio: new SfxRef({src: 'snd/trap_triggered_short.mp3'}), volume: .5 }),
    Sfx.xspec({ tag: 'growth.trigger', audio: new SfxRef({src: 'snd/step-thud.mp3'}), volume: .5 }),
    Sfx.xspec({ tag: 'player.pickup', audio: new SfxRef({src: 'snd/pickup-ding.mp3'}), volume: .25 }),
    Sfx.xspec({ tag: 'blip.1', audio: new SfxRef({src: 'snd/blip-1.mp3'}) }),
    Sfx.xspec({ tag: 'player.step', audio: new SfxRef({src: 'snd/step-motor-whir-3.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'menu.click', audio: new SfxRef({src: 'snd/click.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'item.drop', audio: new SfxRef({src: 'snd/wet-thud.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'item.throw', audio: new SfxRef({src: 'snd/arrow-shoot.mp3'}), volume: .3, loop: false }),
    Sfx.xspec({ tag: 'item.throwHit', audio: new SfxRef({src: 'snd/hit-bolt.mp3'}), volume: .5, loop: false }),
    Sfx.xspec({ tag: 'item.loot', audio: new SfxRef({src: 'snd/uncork-flask.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'item.lootThud', audio: new SfxRef({src: 'snd/hard-bump.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'action.failed', audio: new SfxRef({src: 'snd/failed_action_short.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'cog.use', audio: new SfxRef({src: 'snd/cog_use.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'currency.pickup', audio: new SfxRef({src: 'snd/currency-pickup2.mp3'}), volume: .4, loop: false }),
    Sfx.xspec({ tag: 'chest.open', audio: new SfxRef({src: 'snd/open-chest.mp3'}), volume: .4, loop: false }),

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

    Sprite.xspec({tag: 'funguy.idler', img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*0, y: 16*0})}),

    Animation.xspec({tag: 'funguy.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*1, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 25 }),
    ]}),

    Sprite.xspec({tag: 'funguy.idlel', img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*0, y: 32})}),
    Animation.xspec({tag: 'funguy.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*1, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*2, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*3, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*4, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*5, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*6, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*7, y: 32})}), ttl: 25 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/funguy.png', width: 16, height: 32, x: 16*8, y: 32})}), ttl: 25 }),
    ]}),

    Animator.xspec({
        tag: 'funguy',
        x_sketches: {
            'idler': new AssetRef({tag: 'funguy.idler'}),
            'idlel': new AssetRef({tag: 'funguy.idlel'}),
            'mover': new AssetRef({tag: 'funguy.mover'}),
            'movel': new AssetRef({tag: 'funguy.movel'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

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
        x_sketches: {
            'carry': new AssetRef({tag: 'token.carry'}),
            'free': new AssetRef({tag: 'token.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'dark.gun.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'dark.gun.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'dark.gun.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'dark.gun.1.carry'}),
            'free': new AssetRef({tag: 'dark.gun.1.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'dark.gun.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'dark.gun.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'dark.gun.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'dark.gun.2.carry'}),
            'free': new AssetRef({tag: 'dark.gun.2.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'dark.gun.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'dark.gun.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/dark-gun.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'dark.gun.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'dark.gun.3.carry'}),
            'free': new AssetRef({tag: 'dark.gun.3.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'ice.gun.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'ice.gun.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'ice.gun.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'ice.gun.1.carry'}),
            'free': new AssetRef({tag: 'ice.gun.1.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'ice.gun.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'ice.gun.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'ice.gun.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'ice.gun.2.carry'}),
            'free': new AssetRef({tag: 'ice.gun.2.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'ice.gun.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'ice.gun.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/ice-gun.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'ice.gun.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'ice.gun.3.carry'}),
            'free': new AssetRef({tag: 'ice.gun.3.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),


    Animation.xspec({tag: 'fire.gun.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'fire.gun.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'fire.gun.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'fire.gun.1.carry'}),
            'free': new AssetRef({tag: 'fire.gun.1.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'fire.gun.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'fire.gun.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'fire.gun.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'fire.gun.2.carry'}),
            'free': new AssetRef({tag: 'fire.gun.2.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'fire.gun.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'fire.gun.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/fire-gun.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'fire.gun.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'fire.gun.3.carry'}),
            'free': new AssetRef({tag: 'fire.gun.3.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'shock.gun.1.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*3, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*9, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'shock.gun.1.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 0, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*3, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*6, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*9, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'shock.gun.1',
        x_sketches: {
            'carry': new AssetRef({tag: 'shock.gun.1.carry'}),
            'free': new AssetRef({tag: 'shock.gun.1.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'shock.gun.2.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*7, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'shock.gun.2.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*1, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*4, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*7, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*10, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'shock.gun.2',
        x_sketches: {
            'carry': new AssetRef({tag: 'shock.gun.2.carry'}),
            'free': new AssetRef({tag: 'shock.gun.2.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Animation.xspec({tag: 'shock.gun.3.carry', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*5, y: 0})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 16, x: 16*11, y: 0})}), ttl: 200 }),
    ]}),
    Animation.xspec({tag: 'shock.gun.3.free', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*2, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*5, y: 16})}), ttl: 200 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*8, y: 16})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/shock-gun.png', width: 16, height: 32, x: 16*11, y: 16})}), ttl: 200 }),
    ]}),
    Animator.xspec({
        tag: 'shock.gun.3',
        x_sketches: {
            'carry': new AssetRef({tag: 'shock.gun.3.carry'}),
            'free': new AssetRef({tag: 'shock.gun.3.free'}),
        },
        state: 'free',
        //evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    Template.varsprite('img/rock-area-clutter.png', 'rock.clutter', [[0,0], [1,0]], {width: 16, height: 16}),

    // -- gems
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
    Animation.xspec({tag: 'gem.blue', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/gem-1.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 150 }),
    ]}),

    // -- cogs
    Shape.xspec({
        tag: 'cog.four',
        fill: true,
        verts: [ 
            {x:4, y:3}, {x:11, y:4}, {x:10, y:11}, {x:3, y:10},
        ],
        border: 1,
        color: 'silver',
        borderColor: 'red',
    }),

    Shape.xspec({
        tag: 'cog.six',
        fill: true,
        verts: [ 
            {x:7, y:3}, {x:11, y:5}, {x:11, y:10}, {x:7, y:12}, {x: 3, y: 10}, {x:3, y: 5},
        ],
        border: 1,
        color: 'silver',
        borderColor: 'red',
    }),
    Shape.xspec({
        tag: 'cog.cam',
        fill: true,
        verts: [ 
            {x:3, y:2}, {x:13, y:2}, {x:13, y:12}, {x:11, y:13}, {x:10, y: 5}, {x:2, y:4},
        ],
        border: 1,
        color: 'silver',
        borderColor: 'red',
    }),
    Shape.xspec({
        tag: 'cog.three',
        fill: true,
        verts: [ 
            {x:8, y:3}, {x:12, y:12}, {x:3, y:12}, {x:7, y:3},
        ],
        border: 1,
        color: 'silver',
        borderColor: 'red',
    }),
    Shape.xspec({
        tag: 'cog.five',
        fill: true,
        verts: [ 
            {x:8, y:1}, {x:10, y:5}, {x:14, y:5}, {x:10, y:9}, {x:12, y:14}, {x:8, y:11},
            {x:7, y:11}, {x:3, y:14}, {x:5, y:9}, {x:1, y:5}, {x:5, y:5}, {x:7, y:1},
        ],
        border: 1,
        color: 'silver',
        borderColor: 'red',
    }),

    // -- trap
    Animation.xspec({ tag: 'trap.armed', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*0, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*2, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*4, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*6, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*8, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*10, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*12, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*14, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({ tag: 'trap.inactive', jitter: true, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/trap.png', width: 16, height: 16, x: 16*1, y: 0})}), ttl: 100 }),
    ]}),
    Animator.xspec({
        tag: 'trap',
        x_sketches: {
            'armed': new AssetRef({tag: 'trap.armed'}),
            'inactive': new AssetRef({tag: 'trap.inactive'}),
        },
        state: 'armed',
    }),

    Animator.xspec({
        tag: 'rock.growth',
        x_sketches: {
            'armed': Template.varsprite('img/shroom-growth.png', 'rock.growth.armed', [[0,0], [1,0], [2,0], [3,0]], {width: 20, height: 32}),
            'inactive': Sprite.xspec({img: new SheetRef({src: 'img/shroom-growth.png', width: 20, height: 32, x: 20*4, y: 0})}),
        },
        state: 'armed',
    }),

    Animation.xspec({tag: 'magma.idler', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*3, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'magma.idlel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*4, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*5, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*7, y: 0})}), ttl: 150 }),
    ]}),
    Animation.xspec({tag: 'magma.mover', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*8, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*9, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*10, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*11, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'magma.movel', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*12, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*13, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*14, y: 0})}), ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*15, y: 0})}), ttl: 100 }),
    ]}),
    Animation.xspec({tag: 'magma.dyingr', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*16, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*17, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*18, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*19, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 50 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*20, y: 0})}), ttl: 50 }),
    ]}),
    Animation.xspec({tag: 'magma.dyingl', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*21, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*22, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*23, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*24, y: 0})}), ttl: 50 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*25, y: 0})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*25, y: 0})}), ttl: 100 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 100 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/magma.png', width: 16, height: 32, x: 16*25, y: 0})}), ttl: 100 }),
    ]}),
    Animator.xspec({
        tag: 'magma',
        x_sketches: {
            'idler': new AssetRef({tag: 'magma.idler'}),
            'idlel': new AssetRef({tag: 'magma.idlel'}),
            'mover': new AssetRef({tag: 'magma.mover'}),
            'movel': new AssetRef({tag: 'magma.movel'}),
            'dyingr': new AssetRef({tag: 'magma.dyingr'}),
            'dyingl': new AssetRef({tag: 'magma.dyingl'}),
        },
        state: 'idler',
        evtAccessor: (evt) => (evt.update && evt.update.animState) ? evt.update.animState : null,
    }),

    // -- menu
    Rect.xspec({tag: 'options.bg', width: 16, height: 16, color: Resurrect64.colors[0]}),

    // -- vfx
    Animation.xspec({tag: 'vfx.reveal', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*1, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*2, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*3, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*4, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*5, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*6, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 16, x: 64*7, y: 0})}), ttl: 150 }),
    ]}),

    Animation.xspec({tag: 'vfx.alert', loop: false, x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 850 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 150 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 150 }),
        Cel.xspec({sketch: Sketch.zero, ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/vfx.png', width: 16, height: 32, x: 16, y: 0})}), ttl: 150 }),
    ]}),

];