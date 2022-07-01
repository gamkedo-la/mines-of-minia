export { miniaAssets };

import { Animation, Cel } from './base/animation.js';
import { Animator } from './base/animator.js';
import { AssetRef, SheetRef, ImageRef, SfxRef } from './base/assets.js';
import { Rect } from './base/rect.js';
import { Sfx } from './base/sfx.js';
import { Shape } from './base/shape.js';
import { Sprite } from './base/sprite.js';
import { Weapon } from './entities/weapon.js';
import { Template } from './template.js';

let miniaAssets = [
    Shape.xspec({
        tag: 'sword.1',
        fill: true,
        verts: [ 
            {x:4, y:0}, {x:8, y:0}, {x:8, y:4}, {x:28, y:4}, {x:30, y:6}, {x:28, y:8}, {x:8, y:8}, {x:8, y:12},
            {x:4, y:12}, {x:4, y:8}, {x:0, y:8}, {x:0, y:4}, {x:4, y:4},
        ],
        border: 1,
        color: 'gray',
        borderColor: 'red',
    }),
    Shape.xspec({
        tag: 'stairs.up',
        fill: true,
        verts: [ 
            {x:8, y:2}, {x:14, y:8}, {x:14, y:14}, {x:2, y:14}, {x:2, y:8},
        ],
        border: 1,
        color: 'gray',
        borderColor: 'red',
    }),
    Shape.xspec({
        tag: 'stairs.down',
        fill: true,
        verts: [ 
            {x:8, y:14}, {x:2, y:8}, {x:2, y:2}, {x:14, y:2}, {x:14, y:8},
        ],
        border: 1,
        color: 'gray',
        borderColor: 'red',
    }),

    Weapon.xspec({
        tag: 'hack.1',
        kind: 'hack',
        sketch: new AssetRef({tag: 'sword.1'}),
    }),
    Rect.xspec({tag: 'floor', width: 32, height: 32, color: 'gray'}),
    Rect.xspec({tag: 'wall', width: 32, height: 32, color: 'blue'}),
    //Rect.xspec({tag: 'door', width: 32, height: 32, color: 'red'}),
    Rect.xspec({tag: 'door.close', width: 16, height: 16, color: 'red'}),
    Rect.xspec({tag: 'door.open', width: 16, height: 16, borderColor: 'green', fill: false, border: 2}),
    Rect.xspec({tag: 'pc', width: 12, height: 12, color: 'yellow'}),
    Rect.xspec({tag: 'idle', width: 12, height: 12, color: 'green'}),
    Rect.xspec({tag: 'melee', width: 12, height: 12, color: 'red'}),
    Rect.xspec({tag: 'dying', width: 12, height: 12, color: 'black'}),
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
    Rect.xspec({tag: 'one', width: 20, height: 20, color: 'cyan'}),
    Rect.xspec({tag: 'two', width: 20, height: 20, color: 'orange'}),
    Sprite.xspec({tag: 'fairy.static', img: new ImageRef({src: 'img/single.png'})}),
    Sfx.xspec({ tag: 'test.sound', audio: new SfxRef({src: 'snd/test.mp3'}) }),
    Animation.xspec({tag: 'torch', x_cels: [
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/torch.png', width: 50, height: 100, x: 0, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/torch.png', width: 50, height: 100, x: 50, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/torch.png', width: 50, height: 100, x: 100, y: 0})}), ttl: 150 }),
        Cel.xspec({x_sketch: Sprite.xspec({img: new SheetRef({src: 'img/torch.png', width: 50, height: 100, x: 150, y: 0})}), ttl: 150 }),
    ]}),
    Animator.xspec({
        tag: 'one.two',
        sketches: {
            'one': new AssetRef({tag: 'one'}),
            'two': new AssetRef({tag: 'two'}),
        },
        state: 'one',
    }),
    ...Template.walls('img/rock-walls.png', 'rock.wall'),
    ...Template.tiles('img/rock-floor.png', 'rock.floor', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    ...Template.tiles('img/rock-pit.png', 'rock.pit'),
    ...Template.tiles('img/rock-pit-border.png', 'rock.pit.border', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    ...Template.walls('img/rock-outcrop.png', 'rock.outcrop', { vars: { z: [[3,1],[3,2],[3,3],[3,4]]}}),
    ...Template.tiles('img/rock-outcrop-border.png', 'rock.outcrop.border', {vars: { z: [[3,1],[3,2],[3,3],[3,4],[3,5]]}}),
    //...Template.tiles('img/lavaBorder.png', 'lava.border'),
    //...Template.tiles('img/grass.png', 'grass', {vars: { z: [[3,1],[3,2],[1,3],[2,3],[3,3],[4,3],[5,3]]}}),
    //...Template.tiles('img/lava.png', 'lava'),
    //...Template.tiles('img/water.png', 'water'),
    //...Template.tiles('img/waterBorder.png', 'water.border'),
    //...Template.walls('img/outcrop.png', 'outcrop'),
    //...Template.tiles('img/outcropBorder.png', 'outcrop.border'),
];