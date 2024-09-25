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
import { IPersonIdent } from '../../App/typer/felles';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { MannIkon } from '../Ikoner/MannIkon';
import { KvinneIkon } from '../Ikoner/KvinneIkon';
import { Kjønn } from '../../App/typer/personopplysninger';

const tilSøkeresultatListe = (resultat: ISøkPerson): ISøkeresultat[] => [
    {
        harTilgang: true, //Alltid true hvis har status RessursStatus.SUKSESS
        ident: resultat.personIdent,
        fagsakId: resultat.fagsakPersonId, // hak for å få Søk til å virke riktig med fagsakPersonId
        navn: resultat.visningsnavn,
        ikon: resultat.kjønn === Kjønn.MANN ? <MannIkon /> : <KvinneIkon />,
    },
];

const erPositivtTall = (verdi: string) => /^\d+$/.test(verdi) && Number(verdi) !== 0;

const PersonSøk: React.FC = () => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();
    const [resultat, settResultat] = useState<Ressurs<ISøkeresultat[]>>(byggTomRessurs());
    const [uuidSøk, settUuidSøk] = useState(uuidv4());

    const nullstillResultat = (): void => {
        settResultat(byggTomRessurs());
    };

    const søkeresultatOnClick = (søkeresultat: ISøkeresultat) => {
        if (søkeresultat.fagsakId) {
            navigate(`/person/${søkeresultat.fagsakId}`); // fagsakId er mappet fra fagsakPersonId
        } else {
            navigate(`/opprett-fagsak-person`);
        }
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
            placeholder="Fnr/saksnr"
            søkeresultater={resultat}
            nullstillSøkeresultater={nullstillResultat}
            søkeresultatOnClick={søkeresultatOnClick}
        />
    );
};

export default PersonSøk;
