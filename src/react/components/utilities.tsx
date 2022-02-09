import {GetQuery} from "../queries/getQueries";
import {DependencyList, useEffect, useState} from "react";

export function orDefault<T>(value: T, base: NonNullable<T>): NonNullable<T> {
    return (value) ? value as NonNullable<T> : base
}

export type toAny<T> = {
    [K in keyof T]: T[K] extends object ? toAny<T[K]> : any
}

export const useGetQuery = <T, >(
    query: GetQuery,
    deps: DependencyList,
    args: any[]|{[p: string]: any},
    search?: string
): [T[], () => void] => {

    const fullQuery: string = query.query + "\n" + ((search)? search: query.order)

    const [value, setValue] = useState<T[]>([])
    const triggerUpdate = () => {
        window.api.db.query(fullQuery, (data) => {
            setValue(data)
        }, args)
    }

    useEffect(() => {
        triggerUpdate()
    }, [])

    useEffect(() => {
        triggerUpdate()
    }, deps)

    return [value, triggerUpdate]
}
