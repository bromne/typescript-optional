export default abstract class Optional<T> {
    abstract get isPresent(): boolean;
    
    get isEmpty(): boolean {
        return !this.isPresent;
    }
    
    abstract get(): T;
    
    abstract ifPresent(consumer: (value: T) => void): void;
    
    abstract filter(predicate: (value: T) => boolean): Optional<T>;
    
    abstract map<U> (mapper: (value: T) => U): Optional<U>;
    
    abstract flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U>;
    
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

    filter(predicate: (value: T) => boolean): Optional<T> {
        return (predicate(this.payload)) ? this : Optional.empty();
    }

    map<U>(mapper: (value: T) => U): Optional<U> {
        return Optional.ofNonNull(mapper(this.payload));
    }
    
    flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        return mapper(this.payload);
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
    
    filter(predicate: (value: T) => boolean): Optional<T> {
        return this;
    }

    map<U>(mapper: (value: T) => U): Optional<U> {
        return Optional.empty();
    }

    flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        return Optional.empty();
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
