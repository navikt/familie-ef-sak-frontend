import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

export const useSetValgtFagsakPersonId = (fagsakPersonId: string | undefined) => {
    const { settValgtFagsakPersonId } = useApp();

    useEffect(() => {
        if (fagsakPersonId) {
            settValgtFagsakPersonId(fagsakPersonId);
        }
    }, [settValgtFagsakPersonId, fagsakPersonId]);

    return {};
};
