import { useState, useEffect } from 'react';
import { useHentSøkPerson } from './useSøkPerson';
import { useHentFagsakPerson } from './useHentFagsakPerson';

export const useHentFagsakIder = (personIdent: string) => {
    const [ider, settIder] = useState({
        fagsakBarnetilsyn: '',
        fagsakOvergangsstønad: '',
        fagsakSkolepenger: '',
    });

    const { hentSøkPerson, søkPersonResponse } = useHentSøkPerson();
    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPerson();

    useEffect(() => {
        hentSøkPerson(personIdent);
    }, [hentSøkPerson, personIdent]);

    useEffect(() => {
        if (søkPersonResponse.status === 'SUKSESS' && søkPersonResponse.data.fagsakPersonId) {
            hentFagsakPerson(søkPersonResponse.data.fagsakPersonId);
        }
    }, [hentFagsakPerson, søkPersonResponse]);

    useEffect(() => {
        if (fagsakPerson.status === 'SUKSESS') {
            settIder({
                fagsakBarnetilsyn: fagsakPerson.data.barnetilsyn ?? '',
                fagsakOvergangsstønad: fagsakPerson.data.overgangsstønad ?? '',
                fagsakSkolepenger: fagsakPerson.data.skolepenger ?? '',
            });
        }
    }, [fagsakPerson]);

    return ider;
};
