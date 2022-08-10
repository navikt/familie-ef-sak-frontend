import { useApp } from '../context/AppContext';
import { useEffect } from 'react';
import { IFagsakPersonIdent } from '../typer/felles';

// eslint-disable-next-line
export const useSetValgtFagsakPersonIdent = (fagsakPersonIdent: IFagsakPersonIdent) => {
    const { settValgtFagsakPersonIdent } = useApp();

    useEffect(() => {
        settValgtFagsakPersonIdent(fagsakPersonIdent);
        return () => settValgtFagsakPersonIdent(undefined);
    }, [settValgtFagsakPersonIdent, fagsakPersonIdent]);

    return {};
};
