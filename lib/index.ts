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

    static of<T>(value: T | null): Optional<T> {
        if (value !== null)
            return new ValueOptional<T>(value);
        else
            return new EmptyOptional<T>();
    }

    static ofValue<T>(value: T): Optional<T> {
        if (value !== null && value !== undefined)
            return new ValueOptional<T>(value);
        else
            throw new TypeError("The passed value was null or undefined.");
    }

    static empty<T>(): Optional<T> {
        return new EmptyOptional();
    }
}

class ValueOptional<T> extends Optional<T> {
    value: T;

    get isPresent(): boolean {
        return true;
    }
    
    constructor(value: T)  {
        super();
        this.value;
    }

    get(): T {
        return this.value;
    }

    ifPresent(consumer: (value: T) => void): void {
        consumer(this.value);
    }

    filter(predicate: (value: T) => boolean): Optional<T> {
        return (predicate(this.value)) ? this : Optional.empty();
    }

    map<U>(mapper: (value: T) => U): Optional<U> {
        return Optional.ofValue(mapper(this.value));
    }
    
    flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        return mapper(this.value);
    }

    orElse(another: T): T {
        return this.value;
    }

    orElseGet(another: () => T): T {
        return this.value;
    }

    orElseThrow<U>(exception: () => U): T {
        return this.value;
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
        return another();
    }

    orElseThrow<U>(exception: () => U): T {
        throw exception();
    }
}
