import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

export const useSetValgtFagsakPersonId = (fagsakPersonId: string) => {
    const { settValgtFagsakPersonId } = useApp();

    useEffect(() => {
        settValgtFagsakPersonId(fagsakPersonId);
        return () => settValgtFagsakPersonId(undefined);
    }, [settValgtFagsakPersonId, fagsakPersonId]);

    return {};
};
