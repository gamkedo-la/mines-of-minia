import { Bounds } from '../js/base/bounds.js';
import { Fmt } from '../js/base/fmt.js';
import { Grid } from '../js/base/grid.js';


describe("grid implementation", () => {
    it("can iterate through entries", ()=>{
        let grid = new Grid({bounds: new Bounds(0,0,16,16)});
        let v1 = { gid: 1, x: 1, y: 1};
        grid.add(v1);
        console.log(`idx of ${Fmt.ofmt(v1)}: ${grid.idxof(v1)}`);
        for (const v of grid) {
            console.log(`v: ${Fmt.ofmt(v)}`);
        }
    });
});