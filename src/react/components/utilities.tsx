export function orDefault<T>(value: T, base: NonNullable<T>): NonNullable<T> {
    return (value) ? value as NonNullable<T> : base
}
