import 'mocha';
import * as assert from 'power-assert';
import Optional from "../lib";

describe("Optional", () => {
    let payload: string = "foo";
    let sutPresent: Optional<string> = Optional.ofNonNull(payload);
    let sutEmpty: Optional<string> = Optional.empty();

    describe("#ofNullable", () => {
        it("returns a present optional when it is given a non-null value.", () => {
            let sut = Optional.ofNullable("foo");
            assert(sut.isPresent);
        });
        
        it("returns an empty optional when it receives null.", () => {
            let sut = Optional.ofNullable<string | null>(null);
            assert(sut.isEmpty);
        });

        it("returns an empty optional when it receives undefined.", () => {
            let sut = Optional.ofNullable<string | undefined>(undefined);
            assert(sut.isEmpty);
        }) 
    });
    
    describe("#ofNonNull", () => {
        it("returns a present optional when it is given a non-null value.", () => {
            let sut = Optional.ofNonNull("foo");
            assert(sut.isPresent);
        });

        it("throws an exception when it is given null.", () => {
            assert.throws(() => Optional.ofNonNull(null))
        });

        it("throws an exception when it is given undefined.", () => {
            assert.throws(() => Optional.ofNonNull(undefined))
        });
    });

    describe("#empty", () => {
        it("returns an empty optional.", () => {
            let sut = Optional.empty();
            assert(sut.isEmpty);
        });
    });

    describe("#get", () => {
        it("returns the payload when it is present.", () => {
            assert.equal(sutPresent.get(), payload);
        });

        it("throws an exception when it is empty.", () => {
            assert.throws(() => sutEmpty.get());
        });
    });

    describe("#isPresent", () => {
        it("returns true when it is present", () => {
            assert.equal(sutPresent.isPresent, true);
        });

        it("returns false when it is not present", () => {
            assert.equal(sutEmpty.isPresent, false);
        });
    });

    describe("#isEmpty", () => {
        it("returns false when it is present", () => {
            assert.equal(sutPresent.isEmpty, false);
        });

        it("returns true when it is not present", () => {
            assert.equal(sutEmpty.isEmpty, true);
        });
    });

    describe("#ifPresent", () => {
        it("calls the given function when it is present.", () => {
            let called = false;
            sutPresent.ifPresent(value => {
                assert.equal(value, payload);
                called = true;
            });
            assert.equal(called, true);
        });

        it("does not call the given function when it is empty.", () => {
            let called = false;
            sutEmpty.ifPresent(value => {
                called = true;
            });
            assert.equal(called, false);
        });
    });
    
    describe.skip("#filter", () => {
        it("returns a present optional when it is present and the predicate returns true.", () => {

        });

        it("returns an empty optional when it is present and the predicate returns false.", () => {
            
        });

        it("returns an empty optional when it is empty.", () => {
            
        });
    });

    describe.skip("#map", () => {
        it("returns a present optional whose payload is mapped by the given function when it is present.", () => {

        });

        it("return an empty optional when it is empty.", () => {
            
        });
    });

    describe("#flatMap", () => {
        {
            let power = (x: number) => Math.pow(x, 2);
            let powerIfPositive: (x: number) => Optional<number> = x => {
                if (x > 0)
                    return Optional.ofNonNull(power(x));
                else
                    return Optional.empty();
            };
            
            it("returns the present optional which is mapped by the given function "
                    + "when it is present and the function returns present.", () => {
                let positive = 42;
                let sut = Optional.ofNonNull(positive);
                let actual = sut.flatMap(powerIfPositive);
                assert.equal(actual.get(),  power(positive));
            });

            it("returns the empty optional which is mapped by the given function "
                    + "when it is present and the function returns empty.", () => {
                let negative = -42;
                let sut = Optional.ofNonNull(negative);
                let actual = sut.flatMap(powerIfPositive);
                assert(actual.isEmpty);
            });
            
            it("returns the empty optional when it is empty.", () => {
                let sut = Optional.empty<number>();
                let actual = sut.flatMap(powerIfPositive);
                assert(actual.isEmpty);
            });
        }
        {
            let left: Optional<number> = Optional.ofNonNull(3);
            let right: Optional<number> = Optional.ofNonNull(4);
            let empty: Optional<number> = Optional.empty();
            let sum = left.get() + right.get();
    
            it("returns value of applying bi-function to two payloads when both of the two optionals are present.", () => {
                let actual = left.flatMap(x => right.map(y => x + y));
                assert.equal(actual.get(), sum);
            });
    
            it("returns empty optional when the left is present and the right is empty.", () => {
                let actual = left.flatMap(x => empty.map(y => x + y));
                assert(actual.isEmpty);
            });
    
            it("returns empty optional when the left is empty and the right is present.", () => {
                let actual = empty.flatMap(x => right.map(y => x + y));
                assert(actual.isEmpty);
            });
        }
    });

    describe.skip("#orElse", () => {
        it("returns the original payload when it is present.", () => {
            
        });

        it("returns the given value when it is empty.", () => {
            
        });

        it("throws an exception when it is present and receives null.", () => {
            
        });

        it("throws an exception when it is present and receives undefined.", () => {
            
        });

        it("throws an exception when it is empty and receives null.", () => {
            
        });

        it("throws an exception when it is empty and receives undefined.", () => {
            
        });
    });

    describe.skip("#orElseGet", () => {
        it("returns the original payload when it is present.", () => {
            
        });

        it("returns the value returned by the given function when it is empty.", () => {
            
        });

        it("throws an exception when it is present and the given function returns null.", () => {
            
        });

        it("throws an exception when it is present and the given function returns undefined.", () => {
            
        });

        it("throws an exception when it is empty and the given function returns null.", () => {
            
        });

        it("throws an exception when it is empty and the given function returns undefined.", () => {
            
        });
    });

    describe.skip("#orElseThrow", () => {
        it("returns the original payload when it is present.", () => {
            
        });

        it("throw the exception returned by the given function when it is empty.", () => {
            
        });

        it("throws an exception when it is present and the given function returns null.", () => {
            
        });

        it("throws an exception when it is present and the given function returns undefined.", () => {
            
        });

        it("throws an exception when it is empty and the given function returns null.", () => {
            
        });

        it("throws an exception when it is empty and the given function returns undefined.", () => {
            
        });
    });
});
