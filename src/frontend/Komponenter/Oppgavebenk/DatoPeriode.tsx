import { Datepicker } from 'nav-datovelger';
import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from './OppgaveFiltrering';
import { OrNothing } from '../../App/hooks/felles/useSorteringState';
import { EnsligErrorMessage } from '../../Felles/ErrorMessage/EnsligErrorMessage';
import { NavdsSpacing12 } from '@navikt/ds-tokens/dist/tokens';

const DatolabelStyle = styled.label`
    padding-bottom: 0.5rem;
`;

const DatepickerWrapper = styled.div`
    margin-top: 0.5rem;

    .nav-datovelger__input {
        height: ${NavdsSpacing12};
    }
`;

interface Props {
    datoFraTekst: string;
    datoTilTekst: string;
    valgtDatoFra?: string;
    valgtDatoTil?: string;
    settDatoFra: (dato?: string) => void;
    settDatoTil: (dato?: string) => void;
    datoFeil: OrNothing<string>;
}

const DatoPeriode: React.FC<Props> = ({
    datoFraTekst,
    datoTilTekst,
    valgtDatoFra,
    valgtDatoTil,
    settDatoFra,
    settDatoTil,
    datoFeil,
}) => {
    return (
        <FlexDiv>
            <div className="skjemaelement flex-item">
                <DatolabelStyle className="skjemaelement__label" htmlFor="regdatoFra">
                    {datoFraTekst}
                </DatolabelStyle>

                <DatepickerWrapper>
                    <Datepicker onChange={settDatoFra} value={valgtDatoFra} />
                </DatepickerWrapper>
            </div>
            <div className="skjemaelement flex-item">
                <DatolabelStyle className="skjemaelement__label" htmlFor="regdatoTil">
                    {datoTilTekst}
                </DatolabelStyle>
                <DatepickerWrapper>
                    <Datepicker onChange={settDatoTil} value={valgtDatoTil} />
                </DatepickerWrapper>
                <EnsligErrorMessage>{datoFeil}</EnsligErrorMessage>
            </div>
        </FlexDiv>
    );
};

export default DatoPeriode;
