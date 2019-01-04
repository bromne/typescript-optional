import "mocha";
import * as assert from "power-assert";
import { Cases, Option, Optional } from ".";

describe("Optional", () => {
    const payload: string = "foo";
    const sutPresent: Optional<string> = Optional.ofNonNull(payload);
    const sutEmpty: Optional<string> = Optional.empty();

    describe("#of", () => {
        it("should return a present Optional when it is given a non-null value.", () => {
            const sut = Optional.of("foo");
            assert(sut.isPresent);
        });

        it("should throw an exception when it is given null.", () => {
            assert.throws(() => Optional.of<string | null>(null));
        });

        it("should throw an exception when it is given undefined.", () => {
            assert.throws(() => Optional.of<string | undefined>(undefined));
        });
    });

    describe("#ofNonNull", () => {
        it("should return a present Optional when it is given a non-null value.", () => {
            const sut = Optional.ofNonNull("foo");
            assert(sut.isPresent);
        });

        it("should throw an exception when it is given null.", () => {
            assert.throws(() => Optional.ofNonNull<string | null>(null));
        });

        it("should throw an exception when it is given undefined.", () => {
            assert.throws(() => Optional.ofNonNull<string | undefined>(undefined));
        });
    });

    describe("#ofNullable", () => {
        const getNullable: () => string | null = () => null;
        const getUndefinedable: () => string | undefined = () => undefined;

        it("should return a present Optional when it is given a non-null value.", () => {
            const sut = Optional.ofNullable("foo");
            assert(sut.isPresent);
        });
        
        it("should return an empty Optional when it receives null.", () => {
            const sut: Optional<string> = Optional.ofNullable(getNullable());
            assert(sut.isEmpty);
        });

        it("should return an empty Optional when it receives undefined.", () => {
            const sut: Optional<string> = Optional.ofNullable(getUndefinedable());
            assert(sut.isEmpty);
        });
    });

    describe("#from", () => {
        it("returns a present optional when it is given a present option.", () => {
            const presentOption: Option<string> = { kind: "present", value: payload };
            const sut = Optional.from(presentOption);
            assert(sut.isPresent);
        });

        it("returns an empty optional when it is given an empty option.", () => {
            const emptyOption: Option<string> = { kind: "empty" };
            const sut = Optional.from(emptyOption);
            assert(sut.isEmpty);
        });

        it("throws an exception when it is given a value which is not Option type.", () => {
            const malformed: any = {};
            assert.throws(() => Optional.from(malformed));
        });
    });

    describe("#empty", () => {
        it("should return an empty Optional.", () => {
            const sut: Optional<string> = Optional.empty();
            assert(sut.isEmpty);
        });
    });

    describe("#isPresent", () => {
        it("should return true if it is present", () => {
            assert.strictEqual(sutPresent.isPresent, true);
        });

        it("should return false if it is not present", () => {
            assert.strictEqual(sutEmpty.isPresent, false);
        });
    });

    describe("#isEmpty", () => {
        it("should return false if it is present", () => {
            assert.strictEqual(sutPresent.isEmpty, false);
        });

        it("should return true if it is not present", () => {
            assert.strictEqual(sutEmpty.isEmpty, true);
        });
    });

    describe("#get", () => {
        it("should return the payload if it is present.", () => {
            assert.strictEqual(sutPresent.get(), payload);
        });

        it("should throw an exception if it is empty.", () => {
            assert.throws(() => sutEmpty.get());
        });
    });

    describe("#ifPresent", () => {
        it("should call the given function if it is present.", () => {
            let called = false;
            sutPresent.ifPresent(value => {
                assert.strictEqual(value, payload);
                called = true;
            });
            assert.strictEqual(called, true);
        });

        it("should not call the given function if it is empty.", () => {
            let called = false;
            sutEmpty.ifPresent(value => {
                called = true;
            });
            assert.strictEqual(called, false);
        });
    });

    describe("#ifPresentOrElse", () => {
        it("should call the given function if it is present.", () => {
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

        it("should call the emptyAction function if it is empty.", () => {
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
        it("should return a present Optional if it is present and the predicate should return true.", () => {
            const actual = sutPresent.filter(value => value.length > 0);
            assert.strictEqual(actual.get(), payload);
        });

        it("should return an empty Optional if it is present and the predicate should return false.", () => {
            const actual = sutPresent.filter(value => value.length === 0);
            assert(actual.isEmpty);
        });

        it("should return an empty Optional if it is empty.", () => {
            const actual = sutEmpty.filter(value => true);
            assert(actual.isEmpty);
        });
    });

    describe("#map", () => {
        const mapper = (value: string) => value.length;

        it("should return a present Optional whose payload is mapped by the given function "
                + "if it is present and the result is not null.", () => {
            const actual = sutPresent.map(mapper).get();
            const expected = mapper(payload);
            assert.strictEqual(actual, expected);
        });

        it("should return an empty Optional if it is empty.", () => {
            const actual = sutEmpty.map(mapper);
            assert(actual.isEmpty);
        });

        it("should handle null/undefined mapper return value properly", () => {
            interface Payload {
                a: string;
            }

            const p: Payload = {
                a: "A",
            };
            assert.strictEqual(p.a, Optional.ofNonNull(p).map(x => x.a).get());

            const fallback = "B";
            assert.strictEqual(fallback, Optional.ofNonNull(p as any).map(x => x.b).orElse(fallback));
            assert.strictEqual(fallback, Optional.ofNonNull(p).map(x => null as any).orElse(fallback));

            const m: (x: boolean) => undefined | Payload = (isNull: boolean) => isNull ? undefined : p;

            const fallbackPayload = {
                a: "B",
            };

            assert.strictEqual(fallbackPayload,
                Optional.ofNonNull(p).map(x => m(true)).orElse(fallbackPayload));
            assert.strictEqual(p.a, Optional.ofNonNull(p).map(x => m(false)).map(x => x.a).get());
        });
    });

    describe("#flatMap", () => {
        {
            const sqrtIfNonNegative: (x: number) => Optional<number> = x => {
                if (x >= 0)
                    return Optional.ofNonNull(Math.sqrt(x));
                else
                    return Optional.empty();
            };
            
            it("should return the present Optional which is mapped by the given function "
                    + "if it is present and the function should return present.", () => {
                const nonNegative = 16;
                const sut = Optional.ofNonNull(nonNegative);
                const actual = sut.flatMap(sqrtIfNonNegative);
                assert.strictEqual(actual.get(), Math.sqrt(nonNegative));
            });

            it("should return the empty Optional which is mapped by the given function "
                    + "if it is present and the function should return empty.", () => {
                const negative = -16;
                const sut = Optional.ofNonNull(negative);
                const actual = sut.flatMap(sqrtIfNonNegative);
                assert(actual.isEmpty);
            });
            
            it("should return the empty Optional if it is empty.", () => {
                const sut = Optional.empty<number>();
                const actual = sut.flatMap(sqrtIfNonNegative);
                assert(actual.isEmpty);
            });
        }
        {
            const left: Optional<number> = Optional.ofNonNull(3);
            const right: Optional<number> = Optional.ofNonNull(4);
            const empty: Optional<number> = Optional.empty();
            const sum = left.get() + right.get();
    
            // tslint:disable-next-line:max-line-length
            it("should return value of applying bi-function to two payloads if both of the two Optionals are present.", () => {
                const actual = left.flatMap(x => right.map(y => x + y));
                assert.strictEqual(actual.get(), sum);
            });
    
            it("should return empty Optional if the left is present and the right is empty.", () => {
                const actual = left.flatMap(x => empty.map(y => x + y));
                assert(actual.isEmpty);
            });
    
            it("should return empty Optional if the left is empty and the right is present.", () => {
                const actual = empty.flatMap(x => right.map(y => x + y));
                assert(actual.isEmpty);
            });
        }
    });

    describe("#or", () => {
        const another = "bar";
        const supplier = () => Optional.ofNonNull(another);

        it("should return the current Optional if it is present.", () => {
            const actual = sutPresent.or(supplier);
            assert(actual === sutPresent);
        });

        it("should return the supplier's value if it is empty.", () => {
            const actual = sutEmpty.or(supplier);
            assert.strictEqual(actual.get(), another);
        });
    });

    describe("#orElse", () => {
        const another = "bar";

        it("should return the original payload if it is present.", () => {
            const actual = sutPresent.orElse(another);
            assert.strictEqual(actual, sutPresent.get());
        });

        it("should return the given value if it is empty.", () => {
            const actual = sutEmpty.orElse(another);
            assert.strictEqual(actual, another);
        });
    });

    describe("#orElseGet", () => {
        const another = "bar";

        it("should return the original payload if it is present.", () => {
            const actual = sutPresent.orElseGet(() => another);
            assert.strictEqual(actual, sutPresent.get());
        });

        it("should return the value returned by the given function if it is empty.", () => {
            const actual = sutEmpty.orElseGet(() => another);
            assert.strictEqual(actual, another);
        });
    });

    describe("#orElseThrow", () => {
        it("should return the original payload if it is present.", () => {
            const actual = sutPresent.orElseThrow(TypeError);
            assert.strictEqual(actual, sutPresent.get());
        });

        it("should throw the exception returned by the given function if it is empty.", () => {
            assert.throws(() => sutEmpty.orElseThrow(TypeError));
        });
    });

    describe("#orNull", () => {
        it("returns the original payload when it is present.", () => {
            const actual = sutPresent.orNull();
            assert.strictEqual(actual, sutPresent.get());
        });

        it("returns null when it is empty.", () => {
            const actual = sutEmpty.orNull();
            assert.strictEqual(actual, null);
        }); 
    });

    describe("#orUndefined", () => {
        it("returns the original payload when it is present.", () => {
            const actual = sutPresent.orUndefined();
            assert.strictEqual(actual, sutPresent.get());
        });

        it("returns null when it is empty.", () => {
            const actual = sutEmpty.orUndefined();
            assert.strictEqual(actual, undefined);
        }); 
    });

    describe("#toOption", () => {
        it("returns a Some value when it is present.", () => {
            const actual = sutPresent.toOption();
            assert.equal(actual.kind, "present");
        });

        it("returns a None value when it is empty.", () => {
            const actual = sutEmpty.toOption();
            assert.equal(actual.kind, "empty");
        });
    });

    describe("#matches", () => {
        const cases: Cases<string, number> = {
            present: x => x.length,
            empty: () => 0,
        };

        it("returns a value converted from the payload by the given 'some' function when it is present", () => {
            const actual = sutPresent.matches(cases);
            const expected = cases.present(payload);
            assert.strictEqual(actual, expected);
        });

        it("returns the value returned by the given 'none' function when it is empty.", () => {
            const actual = sutEmpty.matches(cases);
            const expected = cases.empty();
            assert.strictEqual(actual, expected);
        });
    });
});
