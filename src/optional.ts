import { Cases, Option } from "./types.js";

/**
 * `Optional` (like Java) implementation in TypeScript.
 * 
 * `Optional<T>` is a type which *may* or *may not* contain a *payload* of type `T`.
 * It provides a common interface regardless of whether an instance is *present* or is *empty*. 
 *
 * This module is inspired by
 * [Optional class in Java 8+](https://docs.oracle.com/javase/10/docs/api/java/util/Optional.html).
 * 
 * The following methods are currently not supported:
 * 
 * - `equals`
 * - `toString`
 * - `hashCode`
 * - `stream`
 */
export abstract class Optional<T> {
    /**
     * Returns whether this is present or not.
     * 
     * If a payload is present, be `true` , otherwise be `false`.
     */
    abstract isPresent(): boolean;
    
    /**
     * Returns whether this is empty or not.
     * 
     * If this is empty, be `true`, otherwise  be `false`.
     * This method is negation of `Optional#isPresent`.
     */
    isEmpty(): boolean {
        return !this.isPresent();
    }

    /**
     * Force to retrieve the payload.
     * If a payload is present, returns the payload, otherwise throws `TypeError`.
     * 
     * @throws {TypeError} if this is empty.
     */
    abstract get(): T;
    
    /**
     * If a payload is present, executes the given `consumer`, otherwise does nothing.
     * 
     * @param consumer a consumer of the payload
     */
    abstract ifPresent(consumer: (value: T) => void): void;

    /**
     * If a payload is present, executes the given `consumer`,
     * otherwise executes `emptyAction` instead.
     * 
     * @param consumer a consumer of the payload, if present
     * @param emptyAction an action, if empty
     */
    abstract ifPresentOrElse(consumer: (value: T) => void, emptyAction: () => void): void;

    /**
     * Filters a payload with an additional `predicate`.
     * 
     * If a payload is present and the payload matches the given `predicate`, returns `this`,
     * otherwise returns an empty `Optional` even if this is present.
     * 
     * @param predicate a predicate to test the payload, if present
     */
    abstract filter(predicate: (value: T) => boolean): Optional<T>;
    
    /**
     * Maps a payload with a mapper.
     * 
     * If a payload is present, returns an `Optional` as if applying `Optional.ofNullable` to the result of
     * applying the given `mapper` to the payload,
     * otherwise returns an empty `Optional`.
     * 
     * @param mapper a mapper to apply the payload, if present
     */
    abstract map<U>(mapper: (value: T) => U): Optional<NonNullable<U>>;
    
    /**
     * Maps a payload with a mapper which returns Optional as a result.
     * 
     * If a payload is present, returns the result of applying the given `mapper` to the payload,
     * otherwise returns an empty `Optional`.
     * 
     * @param mapper a mapper to apply the payload, if present
     */
    abstract flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U>;

    /**
     * If a payload is present, returns `this`,
     * otherwise returns an `Optional` provided by the given `supplier`.
     * 
     * @param supplier a supplier
     */
    abstract or(supplier: () => Optional<T>): Optional<T>;

    /**
     * If a payload is present, returns the payload, otherwise returns `another`.
     * 
     * @param another an another value
     */
    abstract orElse(another: T): T;
    
    /**
     * If a payload is present, returns the payload,
     * otherwise returns the result provided by the given `supplier`.
     * 
     * @param supplier a supplier of another value
     */
    abstract orElseGet(supplier: () => T): T;
    
    /**
     * If a payload is present, returns the payload,
     * otherwise throws an error provided by the given `errorSupplier`.
     * 
     * @param errorSupplier a supplier of an error
     * @throws {T} when `this` is empty.
     */
    abstract orElseThrow<U>(errorSupplier: () => U): T;

    /**
     * If a payload is present, returns the payload,
     * otherwise returns `null`.
     */
    abstract orNull(): T | null;
    
    /**
     * If a payload is present, returns the payload,
     * otherwise returns `undefined`.
     */
    abstract orUndefined(): T | undefined;

    /**
     * Converts this to an `Option`.
     */
    abstract toOption(): Option<T>;

    /**
     * Returns an appropriate result by emulating pattern matching with the given `cases`.
     * If a payload is present, returns the result of `present` case,
     * otherwise returns the result of `empty` case.
     * 
     * @param cases cases for this `Optional`
     */
    abstract matches<U>(cases: Cases<T, U>): U;

    /**
     * This method is called by JSON.stringify automatically.
     * When a payload is present, it will be serialized as the payload itself,
     * otherwise, it will be serialized as `null`.
     * 
     * @param key property name
     * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior
     */
    abstract toJSON(key: string): unknown;

    /**
     * Returns an Optional whose payload is the given non-null `value`.
     * 
     * @param value a value 
     * @throws {TypeError} when the given `value` is `null` or `undefined`.
     */
    static of<T>(value: T): Optional<T> {
        if (value !== null && value !== undefined)
            return new PresentOptional<T>(value);
        else
            throw new TypeError("The passed value was null or undefined.");
    }

    /**
     * This method is an alias of `Optional.of`.
     * 
     * @param value a value
     * @throws {TypeError} when the given `value` is `null` or `undefined`.
     */
    static ofNonNull<T>(value: T): Optional<T> {
        return Optional.of(value);
    }

    /**
     * If the given `nullable` value is not `null` or `undefined`,
     * returns an `Optional` whose payload is the given value,
     * otherwise (or when `null` or `undefined`) returns an empty `Optional`.
     * 
     * @param nullable a nullable value
     */
    static ofNullable<T>(nullable: T | null | undefined): Optional<T> {
        if (nullable !== null && nullable !== undefined)
            return new PresentOptional<T>(nullable);
        else
            return new EmptyOptional<T>();
    }

    /**
     * Returns an empty `Optional`.
     */
    static empty<T>(): Optional<T> {
        return new EmptyOptional();
    }

    /**
     * Retrieve the given `option` as an Optional.
     * 
     * @param option an `Option` object to retrieve
     * @throws {TypeError} when the given `option` does not have a valid `kind` attribute.
     */
    static from<T>(option: Option<T>): Optional<T> {
        switch (option.kind) {
            case "present": return Optional.of(option.value);
            case "empty": return Optional.empty();
            default: throw new TypeError("The passed value was not an Option type.");
        }
    }
}

class PresentOptional<T> extends Optional<T> {
    payload: T;

    isPresent(): boolean {
        return true;
    }
    
    constructor(value: T)  {
        super();
        this.payload = value;
    }

    get(): T {
        return this.payload;
    }

    ifPresent(consumer: (value: T) => void): void {
        consumer(this.payload);
    }

    ifPresentOrElse(consumer: (value: T) => void, emptyAction: () => void): void {
        consumer(this.payload);
    }

    filter(predicate: (value: T) => boolean): Optional<T> {
        return (predicate(this.payload)) ? this : Optional.empty();
    }

    map<U>(mapper: (value: T) => U): Optional<NonNullable<U>> {
        const result: U = mapper(this.payload);
        return Optional.ofNullable(result!);
    }
    
    flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        return mapper(this.payload);
    }

    or(supplier: () => Optional<T>): Optional<T> {
        return this;
    }

    orElse(another: T): T {
        return this.payload;
    }

    orElseGet(another: () => T): T {
        return this.payload;
    }

    orElseThrow<U>(exception: () => U): T {
        return this.payload;
    }

    orNull(): T {
        return this.payload;
    }

    orUndefined(): T {
        return this.payload;
    }

    toOption(): Option<T> {
        return { kind: "present", value: this.payload };
    }

    matches<U>(cases: Cases<T, U>): U {
        return cases.present(this.payload);
    }

    toJSON(key: string): unknown {
        return this.payload;
    }
}

class EmptyOptional<T> extends Optional<T> {
    isPresent(): boolean {
        return false;
    }

    constructor() {
        super();
    }

    get(): T {
        throw new TypeError("The optional is not present.");
    }

    ifPresent(consumer: (value: T) => void): void {
    }

    ifPresentOrElse(consumer: (value: T) => void, emptyAction: () => void): void {
        emptyAction();
    }

    filter(predicate: (value: T) => boolean): Optional<T> {
        return this;
    }

    map<U>(mapper: (value: T) => U): Optional<NonNullable<U>> {
        return Optional.empty();
    }

    flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        return Optional.empty();
    }

    or(supplier: () => Optional<T>): Optional<T> {
        return supplier();
    }

    orElse(another: T): T {
        return another;
    }

    orElseGet(another: () => T): T {
        return this.orElse(another());
    }

    orElseThrow<U>(exception: () => U): T {
        throw exception();
    }
    
    orNull(): null {
        return null;
    }

    orUndefined(): undefined {
        return undefined;
    }

    toOption(): Option<T> {
        return { kind: "empty" };
    }

    matches<U>(cases: Cases<T, U>): U {
        return cases.empty();
    }

    toJSON(key: string): unknown {
        return null;
    }
}
