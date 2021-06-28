import { Dispatch, SetStateAction, useState } from 'react';

export interface ListState<T> {
    value: Array<T>;
    setValue: Dispatch<SetStateAction<Array<T>>>;
    push(t: T): void;
    remove(index: number): void;
    update(t: T, index: number): void;
}

export default function useListState<T>(initialState: Array<T>): ListState<T> {
    const [value, setValue] = useState(initialState);

    const push = (t: T) => setValue([...value, t]);
    const remove = (index: number) => setValue(value.filter((_, i) => i === index));
    const update = (t: T, index: number) => setValue(value.map((v, i) => (i === index ? t : v)));

    return {
        value,
        setValue,
        push,
        remove,
        update,
    };
}
