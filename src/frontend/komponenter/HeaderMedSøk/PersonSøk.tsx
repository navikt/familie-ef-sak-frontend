import { ISøkeresultat, Søk } from '@navikt/familie-header';
import React from 'react';
import { useHistory } from 'react-router';
import { byggFeiletRessurs, byggHenterRessurs, byggTomRessurs, Ressurs } from '../../typer/ressurs';
import Søkeresultat from './Søkeresultat';
import { ISakSøkPersonIdent } from '../../typer/saksøk';
import { useApp } from '../../context/AppContext';

const PersonSøk: React.FC = () => {
    const history = useHistory();
    const { axiosRequest } = useApp();
    const [resultat, settResultat] = React.useState<Ressurs<ISøkeresultat[]>>(byggTomRessurs());

    const nullstillResultat = (): void => {
        settResultat(byggTomRessurs());
    };

    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    const søkeresultatOnClick = () => {};

    const søk = (personIdent: string): void => {
        settResultat(byggHenterRessurs());
        axiosRequest<ISøkeresultat[], ISakSøkPersonIdent>({
            method: 'POST',
            url: `/familie-ef-sak/api/fagsak/sok/`,
            data: { personIdent: personIdent },
        })
            .then((response: Ressurs<ISøkeresultat[]>) => {
                settResultat(response);
            })
            .catch((error) => {
                settResultat(
                    byggFeiletRessurs('En ukjent feil oppstod ved henting av person', error)
                );
            });
    };

    return (
        <Søk
            søk={søk}
            label="Søk etter fagsak for en person"
            søkeresultater={resultat}
            nullstillSøkeresultater={nullstillResultat}
            søkeresultatOnClick={søkeresultatOnClick}
            formaterResultat={(søkeresultat) => {
                return (
                    <Søkeresultat
                        alder={20}
                        navn={søkeresultat.navn}
                        ident={søkeresultat.ident}
                        onClick={() => {
                            history.push(`/fagsak/${søkeresultat.fagsakId}`);
                        }}
                    />
                );
            }}
        />
    );
};

export default PersonSøk;
