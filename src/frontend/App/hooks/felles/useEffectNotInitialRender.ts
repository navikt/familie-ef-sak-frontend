import { useEffect, useRef } from 'react';

export const useEffectNotInitialRender = (func: () => void, deps: never[]): void => {
    const hasRendered = useRef(false);

    useEffect(() => {
        if (hasRendered.current) func();
        else hasRendered.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
