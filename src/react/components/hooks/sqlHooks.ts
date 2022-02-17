import {Image, SearchPropsType} from "../../pages/App";
import {DependencyList, useEffect, useState} from "react";
import {GetQuery} from "../../queries/getQueries";
import {RunQuery} from "../../queries/runQueries";
import {toAny} from "../../utilities";

export const useGetQuery = <T, >(
    query: GetQuery,
    deps: DependencyList | undefined,
    args: any[] | { [p: string]: any } | undefined,
    search?: string
): [T[], () => void] => {
    const fullQuery: string = query.query + "\n" + ((search) ? search : query.order)

    const [value, setValue] = useState<T[]>([])
    const triggerUpdate = () => {
        window.api.db.getQuery(fullQuery, (data) => {
            setValue(data)
        }, (args) ? args : [])
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
export const setQuery = (
    query: RunQuery,
    args: any[] | { [p: string]: any } | undefined,
): Promise<number | bigint> => {

    return new Promise<number | bigint>((resolve, reject) =>
        window.api.db.runQuery(query.query, (response) => {
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
