import { useApp } from '../context/AppContext';
import { useEffect } from 'react';

export const useSetPersonIdent = (personIdent: string) => {
    const { settPersonIdent } = useApp();

    useEffect(() => {
        settPersonIdent(personIdent);
        return () => settPersonIdent(undefined);
    }, [settPersonIdent, personIdent]);

    return {};
};
