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
import { IFagsaksøk, ISakSøkPersonIdent } from '../../typer/fagsaksøk';
import { useApp } from '../../context/AppContext';
import { kjønnType } from '@navikt/familie-typer';
import { KvinneIkon, MannIkon } from '@navikt/familie-ikoner';

const tilSøkeresultatListe = (resultat: IFagsaksøk): ISøkeresultat[] => {
    return resultat.fagsaker.map((fagsak) => ({
        harTilgang: true, //Alltid true hvis har status RessursStatus.SUKSESS
        ident: resultat.personIdent,
        fagsakId: fagsak.fagsakId,
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
        if (!personIdent) return;
        settResultat(byggHenterRessurs());
        axiosRequest<IFagsaksøk, ISakSøkPersonIdent>({
            method: 'POST',
            url: `/familie-ef-sak/api/sok/`,
            data: { personIdent: personIdent },
        }).then((response: RessursSuksess<IFagsaksøk> | RessursFeilet) => {
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
