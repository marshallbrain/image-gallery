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
    deps: DependencyList|undefined,
    args: any[]|{[p: string]: any}|undefined,
    search?: string
): [T[], () => void] => {
    const fullQuery: string = query.query + "\n" + ((search)? search: query.order)

    const [value, setValue] = useState<T[]>([])
    const triggerUpdate = () => {
        window.api.db.getQuery(fullQuery, (data) => {
            setValue(data)
        }, (args)? args: [])
    }

    useEffect(() => {
        triggerUpdate()
    }, [])

    if (deps && deps.length > 0) {
        useEffect(() => {
            triggerUpdate()
        }, deps)
    }

    return [value, triggerUpdate]
}

export const setQuery = (
    query: GetQuery,
    args: any[]|{[p: string]: any}|undefined,
): Promise<number|bigint> => {
    const fullQuery: string = query.query + "\n" + query.order

    return new Promise<number|bigint>((resolve, reject) =>
        window.api.db.runQuery(fullQuery, (response) => {
            if ("name" in response) {
                reject(response)
                return
            }
            resolve((response as RunResult).lastInsertRowid)
        }, args)
    )
}

export interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
}

export interface SqliteError extends Error {
    name: string
    message: string
    code: string
}
