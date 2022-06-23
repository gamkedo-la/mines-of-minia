import { Direction } from "../js/base/dir.js";
import { Mathf } from "../js/base/math.js";

describe("procedural generation", () => {

    // playground
    let tests = [
        { 
            desc: 'play',
            r1mini: 10,
            r1minj: 10,
            r1maxi: 20,
            r1maxj: 20,
            r2mini: 22,
            r2minj: 18,
            r2maxi: 28,
            r2maxj: 28,
            r1dir: Direction.east,
        }
    ];

    for (const test of tests) {
        it(`can ${test.desc}`, ()=>{

            let r1midi = test.r1mini + Math.floor((test.r1maxi-test.r1mini)/2);
            let r1midj = test.r1minj + Math.floor((test.r1maxj-test.r1minj)/2);
            let r2midi = test.r2mini + Math.floor((test.r2maxi-test.r2mini)/2);
            let r2midj = test.r2minj + Math.floor((test.r2maxj-test.r2minj)/2);

            expect(true).toEqual(true);

            //let omini = Math.min(test.r1mini, test.r1maxi);
            //let omaxi = Math.max(test.r1maxi, test.r1maxi);
            //if (omaxi > test.r2maxi) omaxi = test.r2maxi;
            //if (omini < test.r2mini) omini = test.r2mini;

            let [omini,omaxi] = Mathf.projectSegment(test.r1mini, test.r1maxi, test.r2mini, test.r2maxi);
            let [nmini,nmaxi] = Mathf.invProjectSegment(test.r1mini, test.r1maxi, omini, omaxi);
            let [ominj,omaxj] = Mathf.projectSegment(test.r1minj, test.r1maxj, test.r2minj, test.r2maxj);
            let [nminj,nmaxj] = Mathf.invProjectSegment(test.r1minj, test.r1maxj, ominj, omaxj);

            // -------X--------------X-----------
            // --------------X-------X----------- omini>test.r1mini  min: test.r1mini max: omini
            // -------X------X-------0----------- omini<=test.r1mini min: omaxi max: test.r1maxi


            //let nmini = (omini>test.r1mini) ? test.r1mini : omaxi;
            //let nmaxi = (omini>test.r1mini) ? omini : test.r1maxi;

            console.log(`testi: ${test.r1mini},${test.r1maxi}`);
            console.log(`oi: ${omini},${omaxi}`);
            console.log(`oj: ${ominj},${omaxj}`);
            console.log(`ni: ${nmini},${nmaxi}`);
            console.log(`nj: ${nminj},${nmaxj}`);

            let onaxi = Math.abs(Direction.asX(test.r1dir));
            let onaxj = Math.abs(Direction.asY(test.r1dir));
            let offaxi = (onaxi) ? 0 : 1;
            let offaxj = (onaxj) ? 0 : 1;

            let coord = Math.floor((nmini+nmaxi)*offaxi/2 + (nminj+nmaxj)*offaxj/2);

            let bmini = (test.r1mini-1)*onaxi + coord*offaxi;
            let bminj = (test.r1minj-1)*onaxj + coord*offaxj;
            let bmaxi = (test.r1maxi+1)*onaxi + coord*offaxi;
            let bmaxj = (test.r1maxj+1)*onaxj + coord*offaxj;

            console.log(`bmin: ${bmini},${bminj} bmax: ${bmaxi},${bmaxj}`);


        });
    }

});