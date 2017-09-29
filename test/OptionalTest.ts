import 'mocha';
import * as assert from 'power-assert';
import Optional from "../lib";

describe("Optional", () => {
    describe("#empty", () => {
        it("should return empty", () => {
            let actual = Optional.empty();
            assert.equal(actual.isEmpty, true);
        })
    });
});
