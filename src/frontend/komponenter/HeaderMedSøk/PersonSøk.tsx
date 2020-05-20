import { Søk } from '@navikt/familie-header';
import React from 'react';
import { useHistory } from 'react-router';
import { IPerson } from '../../typer/person';
import { axiosRequest } from '../../api/axios';
import { ISaksbehandler } from '../../typer/saksbehandler';
import { byggFeiletRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../../typer/ressurs';
import Søkeresultat from './Søkeresultat';
import styled from 'styled-components';
import IkkeOppfylt from '../../ikoner/IkkeOppfylt';

// eslint-disable-next-line
const validator = require('@navikt/fnrvalidator');

interface IProps {
    innloggetSaksbehandler: ISaksbehandler;
}

const StyledResultat = styled.div`
    background-color: #3e3832;
    color: #fff;
    padding: 10px;
    font-size: 0.9rem;
    display: flex;
`;

const PersonSøk: React.FC<IProps> = ({ innloggetSaksbehandler }) => {
    const history = useHistory();
    const [resultat, settResultat] = React.useState<Ressurs<IPerson>>(byggTomRessurs);
    const slettResultat = (): void => {
        settResultat(byggTomRessurs);
    };

    const søk = (personIdent: string): void => {
        slettResultat();
        axiosRequest<IPerson, void>(
            {
                method: 'GET',
                url: `/familie-ef-sak/api/personinfo/`,
                headers: { 'Nav-Personident': personIdent },
            },
            innloggetSaksbehandler
        )
            .then((response: Ressurs<IPerson>) => {
                settResultat(response);
            })
            .catch(error => {
                settResultat(
                    byggFeiletRessurs('En ukjent feil oppstod ved henting av person', error)
                );
            });
    };

    const fnrValidator = (verdi: string): boolean => {
        return validator.idnr(verdi).status === 'valid';
    };

    return (
        <Søk
            søk={søk}
            validator={(process.env.NODE_ENV !== 'development' && fnrValidator) || undefined}
            spinner={resultat.status === RessursStatus.HENTER}
            autoSøk={true}
            onChange={slettResultat}
            plassholder={'Fødselsnummer'}
        >
            {resultat.status === RessursStatus.IKKE_TILGANG ||
                (resultat.status === RessursStatus.FEILET && (
                    <StyledResultat>
                        <IkkeOppfylt heigth={20} width={20} />
                        {resultat.melding}
                    </StyledResultat>
                ))}
            {resultat.status === RessursStatus.HENTER && <StyledResultat>Søker...</StyledResultat>}
            {resultat.status === RessursStatus.IKKE_HENTET && (
                <StyledResultat>Tast inn fødselsnummer eller d-nummer</StyledResultat>
            )}
            {resultat.status === RessursStatus.SUKSESS && (
                <Søkeresultat
                    alder={resultat.data.personinfo.alder}
                    navn={resultat.data.personinfo.navn}
                    ident={resultat.data.personinfo.personIdent.id}
                    kjønn={resultat.data.personinfo.kjønn}
                    onClick={() => {
                        history.push(`/soker/finn/${resultat.data.personinfo.personIdent.id}`);
                    }}
                />
            )}
        </Søk>
    );
};

export default PersonSøk;
