import { Søk } from '@navikt/familie-header';
import React from 'react';
import { useHistory } from 'react-router';
import {
    byggFeiletRessurs,
    byggHenterRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../typer/ressurs';
import Søkeresultat from './Søkeresultat';
import styled from 'styled-components';
import IkkeOppfylt from '../../ikoner/IkkeOppfylt';
import { ISaksøk, ISakSøkPersonIdent } from '../../typer/saksøk';
import { useApp } from '../../context/AppContext';
import { styles } from '../../typer/styles';

// eslint-disable-next-line
const validator = require('@navikt/fnrvalidator');

const FunksjonellFeilmelding = styled.div`
    padding-left: 0.5rem;
`;

const StyledResultat = styled.div`
    background-color: ${styles.farger.navMorkGra};
    color: ${styles.farger.hvit};
    padding: 0.8rem;
    display: flex;
`;

const PersonSøk: React.FC = () => {
    const history = useHistory();
    const { axiosRequest } = useApp();
    const [resultat, settResultat] = React.useState<Ressurs<ISaksøk>>(byggTomRessurs());
    const nullstillResultat = (): void => {
        settResultat(byggTomRessurs());
    };

    const søk = (personIdent: string): void => {
        settResultat(byggHenterRessurs());
        axiosRequest<ISaksøk, ISakSøkPersonIdent>({
            method: 'POST',
            url: `/familie-ef-sak/api/saksok/ident`,
            data: { personIdent: personIdent },
        })
            .then((response: Ressurs<ISaksøk>) => {
                settResultat(response);
            })
            .catch((error) => {
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
            onChange={nullstillResultat}
            plassholder={'Fødselsnummer'}
        >
            {resultat.status === RessursStatus.IKKE_TILGANG ||
                (resultat.status === RessursStatus.FEILET && (
                    <StyledResultat>
                        <IkkeOppfylt heigth={20} width={20} />
                        <FunksjonellFeilmelding>
                            {resultat.frontendFeilmelding}
                        </FunksjonellFeilmelding>
                    </StyledResultat>
                ))}
            {resultat.status === RessursStatus.HENTER && <StyledResultat>Søker...</StyledResultat>}
            {resultat.status === RessursStatus.IKKE_HENTET && (
                <StyledResultat>Tast inn fødselsnummer eller d-nummer</StyledResultat>
            )}
            {resultat.status === RessursStatus.SUKSESS && (
                <Søkeresultat
                    alder={20}
                    navn={resultat.data.navn.visningsnavn}
                    ident={resultat.data.personIdent}
                    kjønn={resultat.data.kjønn}
                    onClick={() => {
                        history.push(`/sak/${resultat.data.sakId}`);
                    }}
                />
            )}
        </Søk>
    );
};

export default PersonSøk;
