import { Util } from "../js/base/util.js";

describe("utility functions", () => {

    /**
     * empty tests
     */
    for (const [test,[args, xrslt]] of Object.entries({
        'empty with undefined object': [ [undefined], true],
        'empty with {} object': [ [{}], true],
        'empty with {single} object': [ [{single: true}], false],
        'empty with [] object': [ [[]], true],
        'empty with [single] object': [ [['single']], false],
    })) {
        it(test, ()=>{
            let rslt = Util.empty(...args);
            console.log(`args: ${args} rslt: ${rslt}`);
            expect(rslt).toEqual(xrslt);
        });
    }

    let tests = {
        'with undefined target': [ [undefined, {'foo': true}], undefined],
        'with empty target': [ 
            [{}, {'foo': true, 'bar': {'baz': true}}], 
            {'foo': true, 'bar': {'baz': true}}
        ],
        'with fully-specified target': [ 
            [
                {'foo': false, 'bar': {'baz': false}},
                {'foo': true, 'bar': {'baz': true}},
            ], 
            {'foo': true, 'bar': {'baz': true}}
        ],
        'with over-specified target': [ 
            [
                {'foo': false, 'bar': {'baz': false, 'a': 42}, 'a': 42},
                {'foo': true, 'bar': {'baz': true}},
            ], 
            {'foo': true, 'bar': {'baz': true, 'a': 42}, 'a': 42}
        ],
        'with over-specified target and multiple updates': [ 
            [
                {'foo': false, 'bar': {'baz': false, 'a': 42}, 'a': 42},
                {'foo': true, 'bar': {'baz': true}},
                {'foobar': { 'hello': 'world'}, 'bar': {'baz': 'no'}},
            ], 
            {'foo': true, 'bar': {'baz': 'no', 'a': 42}, 'a': 42, 'foobar': { 'hello': 'world'}}
        ],

    };
    for (const [test,[args, xrslt]] of Object.entries(tests)) {
        it(test, ()=>{
            let rslt = Util.update(...args)
            expect(rslt).toEqual(xrslt);
        });
    }

});