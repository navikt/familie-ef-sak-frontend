import { useApp } from '../context/AppContext';
import { useEffect } from 'react';
import { IPersonopplysninger } from '../typer/personopplysninger';

// eslint-disable-next-line
export const useSetValgtPersonIdent = (personopplysninger: IPersonopplysninger) => {
    const { settValgtPersonIdent } = useApp();

    useEffect(() => {
        settValgtPersonIdent(personopplysninger.personIdent);
        return () => settValgtPersonIdent(undefined);
    }, [settValgtPersonIdent, personopplysninger]);

    return {};
};
