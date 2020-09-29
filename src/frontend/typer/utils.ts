export interface Dictionary<T> {
    [key: string]: T;
}

export type OrNothing<T> = T | undefined | null;
