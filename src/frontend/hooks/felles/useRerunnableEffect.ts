import { DependencyList, EffectCallback, useEffect, useMemo, useState } from 'react';

export function useRerunnableEffect(
    effect: EffectCallback,
    deps?: DependencyList
): { rerun: () => void } {
    const [rerun, setRerun] = useState<number>(0);
    const allDeps = useMemo(() => [rerun, ...(deps ?? [])], [rerun, deps]);
    // eslint-disable-next-line
    useEffect(effect, allDeps);
    return useMemo(
        () => ({
            rerun: () => setRerun((prev) => prev + 1),
        }),
        // eslint-disable-next-line
        [setRerun]
    );
}
