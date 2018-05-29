export default abstract class Optional<T> {
    /**
     * Returns true if this is present, otherwise false.
     */
    abstract get isPresent(): boolean;
    
    /**
     * Returns true if this is empty, otherwise false. A negation of isPresent.
     */
    get isEmpty(): boolean {
        return !this.isPresent;
    }

    /**
     * If a payload is present, returns the payload, otherwise throws TypeError.
     * @throws {TypeError} if this is empty.
     */
    abstract get(): T;
    
    abstract ifPresent(consumer: (value: T) => void): void;

    abstract ifPresentOrElse(consumer: (value: T) => void, emptyAction: () => void): void;
    
    abstract filter(predicate: (value: T) => boolean): Optional<T>;
    
    abstract map<U> (mapper: (value: T) => U): Optional<U>;
    
    abstract flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U>;

    abstract or(supplier: () => Optional<T>): Optional<T>;

    abstract orElse(another: T): T;
    
    abstract orElseGet(another: () => T): T;
    
    abstract orElseThrow<U>(exception: () => U): T;

    static ofNullable<T>(nullable: T | null | undefined): Optional<T> {
        if (nullable !== null && nullable !== undefined)
            return new PresentOptional<T>(nullable);
        else
            return new EmptyOptional<T>();
    }

    static ofNonNull<T>(payload: T): Optional<T> {
        return Optional.of(payload);
    }

    static of<T>(payload: T): Optional<T> {
        if (payload !== null && payload !== undefined)
            return new PresentOptional<T>(payload);
        else
            throw new TypeError("The passed value was null or undefined.");
    }

    static empty<T>(): Optional<T> {
        return new EmptyOptional();
    }
}

class PresentOptional<T> extends Optional<T> {
    payload: T;

    get isPresent(): boolean {
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

    map<U>(mapper: (value: T) => U | null | undefined): Optional<U> {
        return Optional.ofNullable(mapper(this.payload));
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
}

class EmptyOptional<T> extends Optional<T> {
    get isPresent(): boolean {
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

    map<U>(mapper: (value: T) => U): Optional<U> {
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
}
