import { ISøkeresultat, Søk } from '@navikt/familie-header';
import React, { useState } from 'react';
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

    const søk = (personIdent: string): void => {
        if (!personIdent || resultat.status === RessursStatus.HENTER) return;
        settResultat(byggHenterRessurs());
        axiosRequest<ISøkPerson, IPersonIdent>({
            method: 'POST',
            url: `/familie-ef-sak/api/sok/`,
            data: { personIdent: personIdent },
        }).then((response: RessursSuksess<ISøkPerson> | RessursFeilet) => {
            if (response.status === RessursStatus.SUKSESS) {
                const søkeresultater: ISøkeresultat[] = tilSøkeresultatListe(response.data);
                settResultat(byggSuksessRessurs(søkeresultater));
            } else {
                settResultat(response);
            }
        });
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
