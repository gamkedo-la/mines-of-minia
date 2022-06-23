import { Layout } from "../js/procgen/layout.js";

describe("a layout generator", () => {

    it("can iterate", ()=>{
        let g = Layout.generator();

        console.log(`calling first g`);
        g.next();
        console.log(`calling second g`);
        g.next();
        console.log(`calling third g`);
        g.next();
    });

});