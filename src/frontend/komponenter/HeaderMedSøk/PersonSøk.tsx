import { ISøkeresultat, Søk } from '@navikt/familie-header';
import React from 'react';
import { useHistory } from 'react-router';
import {
    byggHenterRessurs,
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../typer/ressurs';
import { ISaksøk, ISakSøkPersonIdent } from '../../typer/saksøk';
import { useApp } from '../../context/AppContext';
import { kjønnType } from '@navikt/familie-typer';
import { KvinneIkon, MannIkon } from '@navikt/familie-ikoner';

const tilSøkeresultatListe = (resultat: ISaksøk): ISøkeresultat[] => {
    return resultat.fagsaker.map((fagsakId) => ({
        harTilgang: true, //Hvis ikke tilgang så RessursFeilet.IkkeTilgang
        ident: resultat.personIdent,
        fagsakId,
        navn: resultat.visningsnavn,
        ikon: resultat.kjønn === kjønnType.MANN ? <MannIkon /> : <KvinneIkon />,
    }));
};

const PersonSøk: React.FC = () => {
    const history = useHistory();
    const { axiosRequest } = useApp();
    const [resultat, settResultat] = React.useState<Ressurs<ISøkeresultat[]>>(byggTomRessurs());

    const nullstillResultat = (): void => {
        settResultat(byggTomRessurs());
    };

    const søkeresultatOnClick = (søkeresultat: ISøkeresultat) => {
        history.push(`/fagsak/${søkeresultat.fagsakId}`);
    };

    const søk = (personIdent: string): void => {
        settResultat(byggHenterRessurs());
        axiosRequest<ISaksøk, ISakSøkPersonIdent>({
            method: 'POST',
            url: `/familie-ef-sak/api/fagsak/sok/`,
            data: { personIdent: personIdent },
        }).then((response: RessursSuksess<ISaksøk> | RessursFeilet) => {
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
            søk={søk}
            label="Søk etter fagsak for en person"
            søkeresultater={resultat}
            nullstillSøkeresultater={nullstillResultat}
            søkeresultatOnClick={søkeresultatOnClick}
        />
    );
};

export default PersonSøk;
