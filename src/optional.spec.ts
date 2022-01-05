import { Optional } from "./optional";
import { Cases, Option } from "./types";

describe("Optional", () => {
    const payload: string = "foo";
    const sutPresent: Optional<string> = Optional.ofNonNull(payload);
    const sutEmpty: Optional<string> = Optional.empty();

    describe("#of", () => {
        it("should return a present Optional when it is given a non-null value.", () => {
            const sut = Optional.of("foo");
            expect(sut.isPresent()).toBe(true);
        });

        it("should throw an exception when it is given null.", () => {
            expect(() => Optional.of<string | null>(null)).toThrow();
        });

        it("should throw an exception when it is given undefined.", () => {
            expect(() => Optional.of<string | undefined>(undefined)).toThrow();
        });
    });

    describe("#ofNonNull", () => {
        it("should return a present Optional when it is given a non-null value.", () => {
            const sut = Optional.ofNonNull("foo");
            expect(sut.isPresent()).toBe(true);
        });

        it("should throw an exception when it is given null.", () => {
            expect(() => Optional.ofNonNull<string | null>(null)).toThrow();
        });

        it("should throw an exception when it is given undefined.", () => {
            expect(() => Optional.ofNonNull<string | undefined>(undefined)).toThrow();
        });
    });

    describe("#ofNullable", () => {
        const getNullable: () => string | null = () => null;
        const getUndefinedable: () => string | undefined = () => undefined;

        it("should return a present Optional when it is given a non-null value.", () => {
            const sut = Optional.ofNullable("foo");
            expect(sut.isPresent()).toBe(true);
        });
        
        it("should return an empty Optional when it receives null.", () => {
            const sut: Optional<string> = Optional.ofNullable(getNullable());
            expect(sut.isEmpty()).toBe(true);
        });

        it("should return an empty Optional when it receives undefined.", () => {
            const sut: Optional<string> = Optional.ofNullable(getUndefinedable());
            expect(sut.isEmpty()).toBe(true);
        });
    });

    describe("#from", () => {
        it("returns a present optional when it is given a present option.", () => {
            const presentOption: Option<string> = { kind: "present", value: payload };
            const sut = Optional.from(presentOption);
            expect(sut.isPresent()).toBe(true);
        });

        it("returns an empty optional when it is given an empty option.", () => {
            const emptyOption: Option<string> = { kind: "empty" };
            const sut = Optional.from(emptyOption);
            expect(sut.isEmpty()).toBe(true);
        });

        it("throws an exception when it is given a value which is not Option type.", () => {
            const malformed: any = {};
            expect(() => Optional.from(malformed)).toThrow();
        });
    });

    describe("#empty", () => {
        it("should return an empty Optional.", () => {
            const sut: Optional<string> = Optional.empty();
            expect(sut.isEmpty()).toBe(true);
        });
    });

    describe("#isPresent", () => {
        it("should return true if it is present", () => {
            expect(sutPresent.isPresent()).toBe(true);
        });

        it("should return false if it is not present", () => {
            expect(sutEmpty.isPresent()).toBe(false);
        });
    });

    describe("#isEmpty", () => {
        it("should return false if it is present", () => {
            expect(sutPresent.isEmpty()).toBe(false);
        });

        it("should return true if it is not present", () => {
            expect(sutEmpty.isEmpty()).toBe(true);
        });
    });

    describe("#get", () => {
        it("should return the payload if it is present.", () => {
            expect(sutPresent.get()).toBe(payload);
        });

        it("should throw an exception if it is empty.", () => {
            expect(() => sutEmpty.get()).toThrow();
        });
    });

    describe("#ifPresent", () => {
        it("should call the given function if it is present.", () => {
            let called = false;
            sutPresent.ifPresent(value => {
                expect(value).toBe(payload);
                called = true;
            });
            expect(called).toBe(true);
        });

        it("should not call the given function if it is empty.", () => {
            let called = false;
            sutEmpty.ifPresent(value => {
                called = true;
            });
            expect(called).toBe(false);
        });
    });

    describe("#ifPresentOrElse", () => {
        it("should call the given function if it is present.", () => {
            let called = false;
            let calledEmpty = false;
            sutPresent.ifPresentOrElse(value => {
                expect(value).toBe(payload);
                called = true;
            }, () => {
                calledEmpty = true;
            });
            expect(called).toBe(true);
            expect(calledEmpty).toBe(false);
        });

        it("should call the emptyAction function if it is empty.", () => {
            let called = false;
            let calledEmpty = false;
            sutEmpty.ifPresentOrElse(value => {
                called = true;
            }, () => {
                calledEmpty = true;
            });
            expect(called).toBe(false);
            expect(calledEmpty).toBe(true);
        });
    });

    describe("#filter", () => {
        it("should return a present Optional if it is present and the predicate should return true.", () => {
            const actual = sutPresent.filter(value => value.length > 0);
            expect(actual.get()).toBe(payload);
        });

        it("should return an empty Optional if it is present and the predicate should return false.", () => {
            const actual = sutPresent.filter(value => value.length === 0);
            expect(actual.isEmpty()).toBe(true);
        });

        it("should return an empty Optional if it is empty.", () => {
            const actual = sutEmpty.filter(value => true);
            expect(actual.isEmpty()).toBe(true);
        });
    });

    describe("#map", () => {
        const mapper = (value: string) => value.length;

        it("should return a present Optional whose payload is mapped by the given function "
                + "if it is present and the result is not null.", () => {
            const actual = sutPresent.map(mapper).get();
            const expected = mapper(payload);
            expect(actual).toBe(expected);
        });

        it("should return an empty Optional if it is empty.", () => {
            const actual = sutEmpty.map(mapper);
            expect(actual.isEmpty()).toBe(true);
        });

        it("should handle null/undefined mapper return value properly", () => {
            interface Payload {
                a: string;
            }

            const p: Payload = {
                a: "A",
            };
            expect(p.a).toBe(Optional.ofNonNull(p).map(x => x.a).get());

            const fallback = "B";
            expect(fallback).toBe(Optional.ofNonNull(p as any).map(x => x.b).orElse(fallback));
            expect(fallback).toBe(Optional.ofNonNull(p).map(x => null as any).orElse(fallback));

            const m: (x: boolean) => undefined | Payload = (isNull: boolean) => isNull ? undefined : p;

            const fallbackPayload = {
                a: "B",
            };

            expect(fallbackPayload)
                .toBe(Optional.ofNonNull(p).map(x => m(true)).orElse(fallbackPayload));
            expect(p.a).toBe(Optional.ofNonNull(p).map(x => m(false)).map(x => x.a).get());
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
                expect(actual.get()).toBe(Math.sqrt(nonNegative));
            });

            it("should return the empty Optional which is mapped by the given function "
                    + "if it is present and the function should return empty.", () => {
                const negative = -16;
                const sut = Optional.ofNonNull(negative);
                const actual = sut.flatMap(sqrtIfNonNegative);
                expect(actual.isEmpty()).toBe(true);
            });
            
            it("should return the empty Optional if it is empty.", () => {
                const sut = Optional.empty<number>();
                const actual = sut.flatMap(sqrtIfNonNegative);
                expect(actual.isEmpty()).toBe(true);
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
                expect(actual.get()).toBe(sum);
            });
    
            it("should return empty Optional if the left is present and the right is empty.", () => {
                const actual = left.flatMap(x => empty.map(y => x + y));
                expect(actual.isEmpty()).toBe(true);
            });
    
            it("should return empty Optional if the left is empty and the right is present.", () => {
                const actual = empty.flatMap(x => right.map(y => x + y));
                expect(actual.isEmpty()).toBe(true);
            });
        }
    });

    describe("#or", () => {
        const another = "bar";
        const supplier = () => Optional.ofNonNull(another);

        it("should return the current Optional if it is present.", () => {
            const actual = sutPresent.or(supplier);
            expect(actual === sutPresent).toBe(true);
        });

        it("should return the supplier's value if it is empty.", () => {
            const actual = sutEmpty.or(supplier);
            expect(actual.get()).toBe(another);
        });
    });

    describe("#orElse", () => {
        const another = "bar";

        it("should return the original payload if it is present.", () => {
            const actual = sutPresent.orElse(another);
            expect(actual).toBe(sutPresent.get());
        });

        it("should return the given value if it is empty.", () => {
            const actual = sutEmpty.orElse(another);
            expect(actual).toBe(another);
        });
    });

    describe("#orElseGet", () => {
        const another = "bar";

        it("should return the original payload if it is present.", () => {
            const actual = sutPresent.orElseGet(() => another);
            expect(actual).toBe(sutPresent.get());
        });

        it("should return the value returned by the given function if it is empty.", () => {
            const actual = sutEmpty.orElseGet(() => another);
            expect(actual).toBe(another);
        });
    });

    describe("#orElseThrow", () => {
        it("should return the original payload if it is present.", () => {
            const actual = sutPresent.orElseThrow(TypeError);
            expect(actual).toBe(sutPresent.get());
        });

        it("should throw the exception returned by the given function if it is empty.", () => {
            expect(() => sutEmpty.orElseThrow(TypeError)).toThrow();
        });
    });

    describe("#orNull", () => {
        it("returns the original payload when it is present.", () => {
            const actual = sutPresent.orNull();
            expect(actual).toBe(sutPresent.get());
        });

        it("returns null when it is empty.", () => {
            const actual = sutEmpty.orNull();
            expect(actual).toBe(null);
        }); 
    });

    describe("#orUndefined", () => {
        it("returns the original payload when it is present.", () => {
            const actual = sutPresent.orUndefined();
            expect(actual).toBe(sutPresent.get());
        });

        it("returns null when it is empty.", () => {
            const actual = sutEmpty.orUndefined();
            expect(actual).toBe(undefined);
        }); 
    });

    describe("#toOption", () => {
        it("returns a Some value when it is present.", () => {
            const actual = sutPresent.toOption();
            expect(actual.kind).toBe("present");
        });

        it("returns a None value when it is empty.", () => {
            const actual = sutEmpty.toOption();
            expect(actual.kind).toBe("empty");
        });
    });

    describe("#matches", () => {
        const cases: Cases<string, number> = {
            present: x => x.length,
            empty: () => 0,
        };

        it("returns a value converted from the payload by the given 'present' function when it is present", () => {
            const actual = sutPresent.matches(cases);
            const expected = cases.present(payload);
            expect(actual).toBe(expected);
        });

        it("returns the value returned by the given 'empty' function when it is empty.", () => {
            const actual = sutEmpty.matches(cases);
            const expected = cases.empty();
            expect(actual).toBe(expected);
        });
    });

    describe("#toJSON", () => {
        it("returns a value of payload itself when it is present.", () => {
            const sut = { foo: sutPresent };
            const actual = JSON.parse(JSON.stringify(sut));
            const expected = { foo: sutPresent.get() };
            expect(actual).toStrictEqual(expected);
        });

        it("returns null when it is empty.", () => {
            const sut = { foo: sutEmpty };
            const actual = JSON.parse(JSON.stringify(sut));
            const expected = { foo: null };
            expect(actual).toStrictEqual(expected);
        });
    });
});
