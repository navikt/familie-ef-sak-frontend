import { useState, useEffect, useLayoutEffect } from 'react';

import useEventListener from './useEventListener';
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface WindowSize {
    width: number;
    height: number;
}

export const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    });

    const handleSize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    useEventListener('resize', handleSize);

    useIsomorphicLayoutEffect(() => {
        handleSize();
        // eslint-disable-next-line
    }, []);

    return windowSize;
};
