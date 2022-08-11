import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

export const useSetPersonIdent = (personIdent: string) => {
    const { settValgtFagsakId } = useApp();
    console.log('setter personIdent');
    console.log(personIdent);
    useEffect(() => {
        settValgtFagsakId(personIdent);
        return () => settValgtFagsakId(undefined);
    }, [settValgtFagsakId, personIdent]);

    return {};
};
