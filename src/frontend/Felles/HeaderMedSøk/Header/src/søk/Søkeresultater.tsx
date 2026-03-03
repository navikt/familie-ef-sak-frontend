import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { inputId } from '.';
import { ISøkeresultat } from '../types';
import Søkeresultat from './Søkeresultat';
import { Alert, BodyShort } from '@navikt/ds-react';

interface Props {
    formaterResultat?: (
        søkeresultat: ISøkeresultat,
        erSøkeresultatValgt: boolean
    ) => React.ReactNode;
    søkeresultatOnClick: (søkResultat: ISøkeresultat) => void;
    søkeresultater: Ressurs<ISøkeresultat[]>;
    valgtSøkeresultat: number;
    settValgtSøkeresultat: (søkeresultatIndex: number) => void;
    ingenFagsakKomponent?: ReactNode;
}

export const StyledAlertStripe = styled(Alert)`
    width: 20rem;
`;

const Søkeresultater: React.FC<Props> = ({
    formaterResultat,
    settValgtSøkeresultat,
    søkeresultatOnClick,
    søkeresultater,
    valgtSøkeresultat,
    ingenFagsakKomponent,
}) => {
    switch (søkeresultater.status) {
        case RessursStatus.SUKSESS:
            return (
                <Søkeresultat
                    søkeresultater={søkeresultater.data}
                    valgtSøkeresultat={valgtSøkeresultat}
                    settValgtSøkeresultat={settValgtSøkeresultat}
                    formaterResultat={formaterResultat}
                    søkeresultatOnClick={søkeresultatOnClick}
                    ingenFagsakKomponent={ingenFagsakKomponent}
                />
            );
        case RessursStatus.FEILET:
        case RessursStatus.FUNKSJONELL_FEIL:
        case RessursStatus.IKKE_TILGANG:
            return (
                <StyledAlertStripe aria-labelledby={inputId} variant="error">
                    <BodyShort size={'small'}>{søkeresultater.frontendFeilmelding}</BodyShort>
                </StyledAlertStripe>
            );
        case RessursStatus.HENTER:
            return (
                <StyledAlertStripe aria-labelledby={inputId} variant={'info'}>
                    <BodyShort size={'small'}>Søker...</BodyShort>
                </StyledAlertStripe>
            );
        default:
            return (
                <StyledAlertStripe aria-labelledby={inputId} variant={'info'}>
                    <BodyShort size={'small'}>
                        Tast inn fødselsnummer eller d-nummer. Trykk 'enter' for å søke.
                    </BodyShort>
                </StyledAlertStripe>
            );
    }
};

export default Søkeresultater;
