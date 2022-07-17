import { Bounds } from '../js/base/bounds.js';
import { Grid } from '../js/base/grid.js';

describe("grid implementation", () => {
    it("can iterate through entries", ()=>{
        let grid = new Grid({bounds: new Bounds(0,0,16,16)});
        grid.add({ gid: 5, x: 7, y: 7 });
        grid.add({ gid: 1, x: 1, y: 1 });
        grid.add({ gid: 2, x: 1, y: 1 });
        grid.add({ gid: 3, x: 3, y: 1 });
        grid.add({ gid: 4, x: 15, y: 15 });
        grid.add({ gid: 6, x: 7, y: 7 });
        let found = Array.from(Array.from(grid.getidx(0)).map((v)=>v.gid));
        expect(found).toEqual([1, 2]);
        found = Array.from(Array.from(grid)).map((v)=>v.gid);
        expect(found).toEqual([1, 2, 3, 5, 6, 4]);
    });

    for (const test of [
        { idx1: 0, idx2: 3, xrslt: [0,1,2,3] },
        { idx1: 0, idx2: 11, xrslt: [0,1,10,11] },
    ]) {
        it(`can determine indices between ${test.idx1} and ${test.idx2}`, ()=>{
            let grid = new Grid({cols: 8, rows: 8, bounds: new Bounds(0,0,16,16)});
            let rslt = Array.from(grid.idxsBetween(test.idx1, test.idx2));
            expect(rslt).toEqual(test.xrslt);
        });
    };

});