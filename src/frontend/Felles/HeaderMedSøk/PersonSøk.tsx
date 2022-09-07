import { ISøkeresultat, Søk } from '@navikt/familie-header';
import React, { useCallback, useState } from 'react';
import {
    byggHenterRessurs,
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { ISøkPerson } from '../../App/typer/personsøk';
import { useApp } from '../../App/context/AppContext';
import { kjønnType } from '@navikt/familie-typer';
import { KvinneIkon, MannIkon } from '@navikt/familie-ikoner';
import { IPersonIdent } from '../../App/typer/felles';
import { v4 as uuidv4 } from 'uuid';

const tilSøkeresultatListe = (resultat: ISøkPerson): ISøkeresultat[] => {
    return resultat.fagsakPersonId
        ? [
              {
                  harTilgang: true, //Alltid true hvis har status RessursStatus.SUKSESS
                  ident: resultat.personIdent,
                  fagsakId: resultat.fagsakPersonId, // hak for å få Søk til å virke riktig med fagsakPersonId
                  navn: resultat.visningsnavn,
                  ikon: resultat.kjønn === kjønnType.MANN ? <MannIkon /> : <KvinneIkon />,
              },
          ]
        : [];
};

const erPositivtTall = (verdi: string) => /^\d+$/.test(verdi) && Number(verdi) !== 0;

const PersonSøk: React.FC = () => {
    const { gåTilUrl, axiosRequest } = useApp();
    const [resultat, settResultat] = useState<Ressurs<ISøkeresultat[]>>(byggTomRessurs());
    const [uuidSøk, settUuidSøk] = useState(uuidv4());

    const nullstillResultat = (): void => {
        settResultat(byggTomRessurs());
    };

    const søkeresultatOnClick = (søkeresultat: ISøkeresultat) => {
        gåTilUrl(`/person/${søkeresultat.fagsakId}`); // fagsakId er mappet fra fagsakPersonId
        settUuidSøk(uuidv4()); // Brukes for å fjerne søkeresultatene ved å rerendre søkekomponenten
        nullstillResultat();
    };

    const oppdaterResultat = (response: RessursSuksess<ISøkPerson> | RessursFeilet): void => {
        if (response.status === RessursStatus.SUKSESS) {
            const søkeresultater: ISøkeresultat[] = tilSøkeresultatListe(response.data);
            settResultat(byggSuksessRessurs(søkeresultater));
        } else {
            settResultat(response);
        }
    };

    const søkPerson = useCallback(
        (personIdent: string) => {
            axiosRequest<ISøkPerson, IPersonIdent>({
                method: 'POST',
                url: `/familie-ef-sak/api/sok/person`,
                data: { personIdent: personIdent },
            }).then(oppdaterResultat);
        },
        [axiosRequest]
    );

    const søkPersonEksternFagsakId = useCallback(
        (eksternFagsakId: string) => {
            axiosRequest<ISøkPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/person/fagsak-ekstern/${eksternFagsakId}`,
            }).then(oppdaterResultat);
        },
        [axiosRequest]
    );

    const søk = (verdi: string): void => {
        if (!verdi || resultat.status === RessursStatus.HENTER) return;
        settResultat(byggHenterRessurs());
        if (erPositivtTall(verdi) && verdi.length !== 11) {
            søkPersonEksternFagsakId(verdi);
        } else {
            søkPerson(verdi);
        }
    };

    return (
        <Søk
            key={uuidSøk}
            søk={søk}
            label="Søk etter fagsak for en person"
            søkeresultater={resultat}
            nullstillSøkeresultater={nullstillResultat}
            søkeresultatOnClick={søkeresultatOnClick}
        />
    );
};

export default PersonSøk;
