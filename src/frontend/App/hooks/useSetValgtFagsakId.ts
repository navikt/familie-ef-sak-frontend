import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

// eslint-disable-next-line
export const useSetValgtFagsakId = (fagsakId: string | undefined) => {
    const { settValgtFagsakId } = useApp();

    useEffect(() => {
        if (fagsakId) {
            settValgtFagsakId(fagsakId);
        }
        return () => settValgtFagsakId(undefined);
    }, [settValgtFagsakId, fagsakId]);

    return {};
};
