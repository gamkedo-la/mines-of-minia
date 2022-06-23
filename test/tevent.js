import { Events, EvtStream } from "../js/base/event.js";

describe("an EvtStream", () => {

    it("can trigger listener once", ()=>{
        let evts = new EvtStream();
        let counter = 0;
        let once = () => counter++;
        evts.listen('test', once, EvtStream.once);
        evts.trigger('test');
        evts.trigger('test');
        expect(counter).toBe(1);
    });

});

/*
describe("events", () => {
    it("can be registered", ()=>{
        Events.register("test");
        let channel = Events.get("test");
        expect(channel).toBeDefined();
        let same = Events.getFromId(channel.id);
        expect(channel).toBe(same);
    });

});
*/