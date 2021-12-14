import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

// eslint-disable-next-line
export const useSetValgtFagsakId = (fagsakId: string) => {
    const { settValgtFagsakId } = useApp();

    useEffect(() => {
        settValgtFagsakId(fagsakId);
        return () => settValgtFagsakId(undefined);
    }, [settValgtFagsakId, fagsakId]);

    return {};
};
