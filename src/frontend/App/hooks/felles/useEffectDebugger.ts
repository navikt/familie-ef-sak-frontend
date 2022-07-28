import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const usePrevious = <T>(value: T, initialValue: T): T => {
    const ref = useRef(initialValue);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
/**
 * Nyttig funksjon for å debugge hvilke dependencies som endrer seg.
 * Særlig kjekt å sjekke ut ved uendelig løkke-issues :)
 *
 * Bare bytt ut useEffect med useEffectDebugger så funker det.
 * Sleng på et string-array som tredje variabel hvor navnet samsvarer med dependencylista for enda enklere oversikt
 */
export const useEffectDebugger = (
    effectHook: EffectCallback,
    dependencies: DependencyList,
    dependencyNames: string[] = []
): void => {
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                // @ts-ignore
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency,
                },
            };
        }

        return accum;
    }, {});

    // @ts-ignore
    if (Object.keys(changedDeps).length) {
        console.log('[use-effect-debugger] ', changedDeps);
    }

    // eslint-disable-next-line
    useEffect(effectHook, dependencies);
};
