import { DependencyList, useEffect, useRef } from 'react';

export const useEffectNotInitialRender = (func: () => void, deps?: DependencyList): void => {
    const hasRendered = useRef(false);

    useEffect(() => {
        if (hasRendered.current) func();
        else hasRendered.current = true;
    }, deps);
};
