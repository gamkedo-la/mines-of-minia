
import { CollisionSystem } from "../js/base/systems/collisionSystem.js";
import { Collider } from "../js/base/collider.js";
import { Bounds } from "../js/base/bounds.js";
import { EvtChannel } from "../js/base/event.js";
import { Fmt } from "../js/base/fmt.js";
import { Entity } from "../js/base/entity.js";
import { UpdateSystem } from "../js/base/systems/updateSystem.js";
import { Model } from "../js/base/model.js";

describe("a collision system", () => {

    let sys;
    let evtIntent;
    let evtCollided;
    let evtCreated;
    let evtDestroyed;

    beforeEach(() => {
        evtIntent = new EvtChannel('test.intent');
        evtCollided = new EvtChannel('test.collided');
        evtCreated = new EvtChannel('test.created');
        evtDestroyed = new EvtChannel('test.destroyed');
        sys = new CollisionSystem({
            evtEntityCollided: evtCollided, 
            evtEntityAdded: evtCreated, 
            evtEntityRemoved: evtDestroyed,
        });
    });

    it('ignores non-collidable entities', ()=>{
        let e = new Model({
            evtIntent: evtIntent,
            evtCreated: evtCreated,
            evtDestroyed: evtDestroyed,
        });
        expect(evtIntent.length).toBe(0);
    });

    it('listens for collidable entities', ()=>{
        let e = new Model({
            evtIntent: evtIntent,
            evtCreated: evtCreated,
            evtDestroyed: evtDestroyed,
            flags: ['collidable'],
        });
        expect(evtIntent.length).toBe(1);
    });

    it('can apply update modified by collision', ()=>{
        let e = new Model({
            evtIntent: evtIntent,
            evtCreated: evtCreated,
            evtDestroyed: evtDestroyed,
            flags: ['collidable', 'updatable'],
            x:0, y:0, 
            collider: new Collider({x: 0, y: 0, width: 2, height: 2}),
        });
        sys.findBounds = (()=>[{x: 2, y: 2, collider: new Collider({x: 0, y:0, width:2, height: 2})}]);
        let update = {x: 1, y:1};
        UpdateSystem.eUpdate(e, update);
        expect(update).toEqual({x: 1, y: 0});
    });

    let colliderTests = [
        {args: [0, 0, 1, 1, new Collider({x: 0, y:0, width:2, height: 2}), 2, 2, new Collider({x: 0, y:0, width:2, height: 2})], xrslt: [1,0, new Bounds(1,1,1,1)]},
        {args: [4, 4, 3, 3, new Collider({x: 0, y:0, width:2, height: 2}), 2, 2, new Collider({x: 0, y:0, width:2, height: 2})], xrslt: [3,4, new Bounds(2,2,1,1)]},
    ];
    for (const test of colliderTests) {
        it("can check colliders " + test.args, ()=>{
            let rslt = sys._checkColliders(...test.args);
            expect(rslt).toEqual(test.xrslt);
        });
    }

    let collisionTests = [
        { 
            e: {x:0, y:0, collider: new Collider({x: 0, y: 0, width: 2, height: 2})}, 
            update: {x:1, y:1}, 
            xupdate: {x:1, y:0}, 
            findBounds: (()=>[{x: 2, y: 2, collider: new Collider({x: 0, y:0, width:2, height: 2})}]),
            xhits: [new Bounds(1,1,1,1)],
        }, 
    ];
    for (const test of collisionTests) {
        it("can check collision " + Fmt.ofmt(test.e), ()=>{
            let collisionEvt;
            evtCollided.listen((evt) => collisionEvt = evt);
            sys.findBounds = test.findBounds;
            sys.checkForCollision(test.e, test.update);
            expect(test.update).toEqual(test.xupdate);
            if (test.xhits) expect(collisionEvt.hits).toEqual(test.xhits);
        });
    }


});