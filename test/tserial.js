import { Assets } from "../js/base/assets.js";
import { Fmt } from "../js/base/fmt.js";
import { Generator } from "../js/base/generator.js";
import { Registry } from "../js/base/registry.js";
import { Character } from "../js/entities/character.js";

describe("a model serializer", () => {

    it("can serialize", ()=>{
        Assets.add('test', {cls: 'Rect', width: 16, height: 16, color: 'rgba(255,255,0,.75)' });
        Registry.extend([
            Character,
        ]);
        let e = new Character({sketch: Assets.get('test', true) });
        console.log(`e: ${e}`);
        let kv = e.as_kv();
        console.log(`kv: ${Fmt.ofmt(kv)}`);

        let ne = Generator.generate(kv);
        console.log(`ne: ${Fmt.ofmt(ne)}`);
    });

});