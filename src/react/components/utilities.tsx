export function orDefault<T>(value: T, base: NonNullable<T>): NonNullable<T> {
    return (value) ? value as NonNullable<T> : base
}

export type toAny<T> = {
    [K in keyof T]: T[K] extends object ? toAny<T[K]> : any
}
