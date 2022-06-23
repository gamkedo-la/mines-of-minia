import { Bits } from "../js/base/bits.js";

describe("a bits implementation", () => {

    it("can register/get a tag", ()=>{
        let bits = new Bits();
        expect(bits.get('test1')).toBe(1);
        expect(bits.get('test2')).toBe(2);
        expect(bits.get('test3')).toBe(4);
        expect(bits.get('test4')).toBe(8);
        expect(bits.get('test4')).toBe(8);
    });

    it("can auto register a tag", ()=>{
        let bits = new Bits();
        expect(bits.test1).toBe(1);
        expect(bits.test2).toBe(2);
        expect(bits.test3).toBe(4);
        expect(bits.test4).toBe(8);
        expect(bits.test4).toBe(8);
    });

    it("can reserve bits via kvs passed to constructor", ()=>{
        let bits = new Bits({test1: 2, test2: 4});
        expect(bits.test1).toBe(2);
        expect(bits.test2).toBe(4);
        expect(bits.test3).toBe(1);
        expect(bits.test4).toBe(8);
    });

    it("has an all property", ()=>{
        let bits = new Bits({test1: 2, test2: 4});
        expect(bits.test1).toBe(2);
        expect(bits.test2).toBe(4);
        expect(bits.test3).toBe(1);
        expect(bits.test4).toBe(8);
        expect(bits.all).toBe(15);
    });

});