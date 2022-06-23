
import { Entity } from '../js/base/entity.js';
import { EvtChannel } from '../js/base/event.js';
import { UpdateSystem } from '../js/base/systems/updateSystem.js';

describe('an update system', () => {

    let sys;
    let evtIntent;
    let evtUpdated;
    let evtCreated;
    let evtDestroyed;

    beforeEach(() => {
        evtIntent = new EvtChannel('test.intent');
        evtUpdated = new EvtChannel('test.update');
        evtCreated = new EvtChannel('test.created');
        evtDestroyed = new EvtChannel('test.destroyed');
        sys = new UpdateSystem({
            evtEntityAdded: evtCreated, 
            evtEntityRemoved: evtDestroyed,
        });
    });

    it('ignores non-updatable entities', ()=>{
        let e = new Entity({
            evtIntent: evtIntent,
            evtCreated: evtCreated,
            evtDestroyed: evtDestroyed,
            evtUpdated: evtUpdated,
        });
        expect(evtIntent.length).toBe(0);
    });

    it('listens for updatable entities', ()=>{
        let e = new Entity({
            evtIntent: evtIntent,
            evtCreated: evtCreated,
            evtDestroyed: evtDestroyed,
            evtUpdated: evtUpdated,
            flags: ['updatable'],
        });
        expect(evtIntent.length).toBe(1);
    });

    it('tracks entity update', ()=>{
        let e = new Entity({
            evtIntent: evtIntent,
            evtCreated: evtCreated,
            evtDestroyed: evtDestroyed,
            evtUpdated: evtUpdated,
            flags: ['updatable'],
        });
        UpdateSystem.eUpdate(e, {foo: 'value'});
        expect(evtIntent.length).toBe(1);
        expect(sys.updates).toEqual(new Map([[e, [{foo: 'value'}]]]));
    });

    it('can apply update', ()=>{
        let e = new Entity({
            evtIntent: evtIntent,
            evtCreated: evtCreated,
            evtDestroyed: evtDestroyed,
            evtUpdated: evtUpdated,
            flags: ['updatable'],
        });
        UpdateSystem.eUpdate(e, {foo: 'value'});
        sys.finalize();
        expect(evtIntent.length).toBe(1);
        expect(sys.updates).toEqual(new Map());
        expect(e.foo).toEqual('value');
    });

    it('can apply update modified by handler', ()=>{
        let e = new Entity({
            evtIntent: evtIntent,
            evtCreated: evtCreated,
            evtDestroyed: evtDestroyed,
            evtUpdated: evtUpdated,
            flags: ['updatable'],
        });
        evtIntent.listen((evt)=>evt.update.foo = "other");
        UpdateSystem.eUpdate(e, {foo: 'value'});
        sys.finalize();
        expect(evtIntent.length).toBe(2);
        expect(sys.updates).toEqual(new Map());
        expect(e.foo).toEqual('other');
    });

});