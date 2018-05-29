import 'mocha';
import * as assert from 'power-assert';
import Optional from "../lib";

describe("Optional", () => {
    let payload: string = "foo";
    let sutPresent: Optional<string> = Optional.ofNonNull(payload);
    let sutEmpty: Optional<string> = Optional.empty();

    describe("#ofNullable", () => {
        let getNullable: () => string | null = () => null;
        let getUndefinedable: () => string | undefined = () => undefined;

        it("should return a present optional when it is given a non-null value.", () => {
            let sut = Optional.ofNullable("foo");
            assert(sut.isPresent);
        });
        
        it("should return an empty optional when it receives null.", () => {
            let sut: Optional<string> = Optional.ofNullable(getNullable());
            assert(sut.isEmpty);
        });

        it("should return an empty optional when it receives undefined.", () => {
            let sut: Optional<string> = Optional.ofNullable(getUndefinedable());
            assert(sut.isEmpty);
        });
    });
    
    describe("#ofNonNull", () => {
        it("should return a present optional when it is given a non-null value.", () => {
            let sut = Optional.ofNonNull("foo");
            assert(sut.isPresent);
        });

        it("should throw an exception when it is given null.", () => {
            assert.throws(() => Optional.ofNonNull<string | null>(null))
        });

        it("should throw an exception when it is given undefined.", () => {
            assert.throws(() => Optional.ofNonNull<string | undefined>(undefined))
        });
    });

    describe("#of", () => {
        it("should return a present optional when it is given a non-null value.", () => {
            let sut = Optional.of("foo");
            assert(sut.isPresent);
        });

        it("should throw an exception when it is given null.", () => {
            assert.throws(() => Optional.of<string | null>(null))
        });

        it("should throw an exception when it is given undefined.", () => {
            assert.throws(() => Optional.of<string | undefined>(undefined))
        });
    });

    describe("#empty", () => {
        it("should return an empty optional.", () => {
            let sut: Optional<string> = Optional.empty();
            assert(sut.isEmpty);
        });
    });

    describe("#get", () => {
        it("should return the payload when it is present.", () => {
            assert.strictEqual(sutPresent.get(), payload);
        });

        it("should throw an exception when it is empty.", () => {
            assert.throws(() => sutEmpty.get());
        });
    });

    describe("#isPresent", () => {
        it("should return true when it is present", () => {
            assert.strictEqual(sutPresent.isPresent, true);
        });

        it("should return false when it is not present", () => {
            assert.strictEqual(sutEmpty.isPresent, false);
        });
    });

    describe("#isEmpty", () => {
        it("should return false when it is present", () => {
            assert.strictEqual(sutPresent.isEmpty, false);
        });

        it("should return true when it is not present", () => {
            assert.strictEqual(sutEmpty.isEmpty, true);
        });
    });

    describe("#ifPresent", () => {
        it("should call the given function when it is present.", () => {
            let called = false;
            sutPresent.ifPresent(value => {
                assert.strictEqual(value, payload);
                called = true;
            });
            assert.strictEqual(called, true);
        });

        it("should not call the given function when it is empty.", () => {
            let called = false;
            sutEmpty.ifPresent(value => {
                called = true;
            });
            assert.strictEqual(called, false);
        });
    });

    describe("#ifPresentOrElse", () => {
        it("should call the given function when it is present.", () => {
            let called = false;
            let calledEmpty = false;
            sutPresent.ifPresentOrElse(value => {
                assert.strictEqual(value, payload);
                called = true;
            }, () => {
                calledEmpty = true;
            });
            assert.strictEqual(called, true);
            assert.strictEqual(calledEmpty, false);
        });

        it("should call the emptyAction function when it is empty.", () => {
            let called = false;
            let calledEmpty = false;
            sutEmpty.ifPresentOrElse(value => {
                called = true;
            }, () => {
                calledEmpty = true;
            });
            assert.strictEqual(called, false);
            assert.strictEqual(calledEmpty, true);
        });
    });

    describe("#filter", () => {
        it("should return a present optional when it is present and the predicate should return true.", () => {
            let actual = sutPresent.filter(value => value.length > 0);
            assert.strictEqual(actual.get(), payload);
        });

        it("should return an empty optional when it is present and the predicate should return false.", () => {
            let actual = sutPresent.filter(value => value.length === 0);
            assert(actual.isEmpty);
        });

        it("should return an empty optional when it is empty.", () => {
            let actual = sutEmpty.filter(value => true);
            assert(actual.isEmpty);
        });
    });

    describe("#map", () => {
        let mapper = (value: string) => value.length;

        it("should return a present optional whose payload is mapped by the given function when it is present.", () => {
            let actual = sutPresent.map(mapper).get();
            let expected = mapper(payload);
            assert.strictEqual(actual, expected);
        });

        it("should return an empty optional when it is empty.", () => {
            let actual = sutEmpty.map(mapper);
            assert(actual.isEmpty);
        });

        it("should handle null/undefined mapper return value properly", () => {
            const payload = {
                a: "A"
            };
            assert.strictEqual(payload.a, Optional.ofNonNull(payload).map(p => p.a).get());

            const fallback = "B";
            assert.strictEqual(fallback, Optional.ofNonNull(payload as any).map(p => p.b).orElse(fallback));
            assert.strictEqual(fallback, Optional.ofNonNull(payload).map(p => null as any).orElse(fallback));
        })
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
            
            it("should return the present optional which is mapped by the given function "
                    + "when it is present and the function should return present.", () => {
                let positive = 42;
                let sut = Optional.ofNonNull(positive);
                let actual = sut.flatMap(powerIfPositive);
                assert.strictEqual(actual.get(),  power(positive));
            });

            it("should return the empty optional which is mapped by the given function "
                    + "when it is present and the function should return empty.", () => {
                let negative = -42;
                let sut = Optional.ofNonNull(negative);
                let actual = sut.flatMap(powerIfPositive);
                assert(actual.isEmpty);
            });
            
            it("should return the empty optional when it is empty.", () => {
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
    
            it("should return value of applying bi-function to two payloads when both of the two optionals are present.", () => {
                let actual = left.flatMap(x => right.map(y => x + y));
                assert.strictEqual(actual.get(), sum);
            });
    
            it("should return empty optional when the left is present and the right is empty.", () => {
                let actual = left.flatMap(x => empty.map(y => x + y));
                assert(actual.isEmpty);
            });
    
            it("should return empty optional when the left is empty and the right is present.", () => {
                let actual = empty.flatMap(x => right.map(y => x + y));
                assert(actual.isEmpty);
            });
        }
    });

    describe("#or", () => {
        const another = "bar";
        const supplier = () => Optional.ofNonNull(another);

        it("should return the current optional when it is present.", () => {
            const actual = sutPresent.or(supplier);
            assert(actual === sutPresent);
        });

        it("should return the supplier's value when it is empty.", () => {
            const actual = sutEmpty.or(supplier);
            assert.strictEqual(actual.get(), another);
        });
    });

    describe("#orElse", () => {
        let another = "bar";

        it("should return the original payload when it is present.", () => {
            let actual = sutPresent.orElse(another);
            assert.strictEqual(actual, sutPresent.get());
        });

        it("should return the given value when it is empty.", () => {
            let actual = sutEmpty.orElse(another);
            assert.strictEqual(actual, another);
        });
    });

    describe("#orElseGet", () => {
        let another = "bar";

        it("should return the original payload when it is present.", () => {
            let actual = sutPresent.orElseGet(() => another);
            assert.strictEqual(actual, sutPresent.get());
        });

        it("should return the value returned by the given function when it is empty.", () => {
            let actual = sutEmpty.orElseGet(() => another);
            assert.strictEqual(actual, another);
        });
    });

    describe("#orElseThrow", () => {
        it("should return the original payload when it is present.", () => {
            let actual = sutPresent.orElseThrow(TypeError);
            assert.strictEqual(actual, sutPresent.get());
        });

        it("should throw the exception returned by the given function when it is empty.", () => {
            assert.throws(() => sutEmpty.orElseThrow(TypeError));
        });
    });
});
