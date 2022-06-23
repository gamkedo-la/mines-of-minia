import { Prng } from "../js/base/prng.js";


describe("prng random integer with range", () => {
    it("has expected distribution", ()=>{
        let dist = {};
        for (let i=0; i<1000; i++) {
            let rslt = Prng.rangeInt(1,10);
            dist[rslt] = (dist[rslt]) ? dist[rslt]+1 : 1;
        }
        for (let i=1; i<=10; i++) {
            expect(dist[i]).toBeGreaterThan(0);
            console.log(`dist[${i}]: ${dist[i]}`);
        }
    });
});