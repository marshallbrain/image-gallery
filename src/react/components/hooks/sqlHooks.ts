import {Image, SearchPropsType} from "../../pages/App";
import {DependencyList, useEffect, useState} from "react";
import {GetQuery} from "../../queries/getQueries";
import {RunQuery} from "../../queries/runQueries";
import {toAny} from "../../utilities";

export const useQuery = <T>(
    query: GetQuery,
    deps?: DependencyList | undefined,
    args?: any[] | { [p: string]: any } | undefined,
    search?: string
): [T[], () => void] => {
    const fullQuery: string = query.query + "\n" + ((search) ? search : (query.order || ""))

    const [value, setValue] = useState<T[]>([])
    const triggerUpdate = () => {
        window.api.db.getQuery(fullQuery, (data) => {
            setValue(data)
        }, (args) ? args : [], !!(query.pluck))
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

export const getQuery = (
    query: GetQuery,
    args?: any[] | { [p: string]: any } | undefined,
    search?: string
): Promise<any[]> => new Promise<any[]>((resolve) => {
    const fullQuery: string = query.query + "\n" + ((search) ? search : (query.order || ""))

    window.api.db.getQuery(fullQuery, (data) => {
        resolve(data)
    }, (args) ? args : [], !!(query.pluck))
})

export const runQuery = (
    query: RunQuery,
    args?: any[] | { [p: string]: any } | undefined,
): Promise<number | bigint> => new Promise<number | bigint>((resolve, reject) =>
    window.api.db.runQuery(query.query, (response) => {
        if ("name" in response) {
            reject(response)
            return
        }
        resolve((response as RunResult).lastInsertRowid)
    }, args)
)

export const useSearch = (
    query: toAny<SearchPropsType>,
    deps: DependencyList | undefined,
): [Image[], () => void] => {
    const [value, setValue] = useState<Image[]>([])
    const triggerUpdate = () => {
        window.api.db.search((data) => {
            setValue(data)
        }, query)
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

export interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
}

export interface SqliteError extends Error {
    name: string
    message: string
    code: string
}
