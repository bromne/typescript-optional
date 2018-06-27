/**
 * An interface that represents respective cases of pattern matching of `Optional`.
 */
export interface Cases<T, U> {
    /**
     * A mapper that maps a payload for case of an `Optional` is present.
     */
    present: (value: T) => U;

    /**
     * A supplier that provides a value for case  of  an `Optional` is empty.
     */
    empty: () => U;
}

/**
 * An alias of algebraic, prototype-free JavaScript object which represents `Optional`.
 * Objects of this type are provided by `Optional.toOption`
 * and they can be retrieved as `Optional` by `Optional.from`.
 */
export type Option<T> = Present<T> | Empty<T>

export interface Present<T> {
    kind: "present";
    value: T;
}

export interface Empty<T> {
    kind: "empty";
}
