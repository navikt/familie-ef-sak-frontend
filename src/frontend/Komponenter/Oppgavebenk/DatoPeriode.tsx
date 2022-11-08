import { Datepicker } from 'nav-datovelger';
import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from './OppgaveFiltrering';
import { OrNothing } from '../../App/hooks/felles/useSorteringState';
import { ErrorMessage } from '@navikt/ds-react';

const DatolabelStyle = styled.label`
    margin-bottom: 0.5em;
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

                <Datepicker onChange={settDatoFra} value={valgtDatoFra} />
            </div>
            <div className="skjemaelement flex-item">
                <DatolabelStyle className="skjemaelement__label" htmlFor="regdatoTil">
                    {datoTilTekst}
                </DatolabelStyle>
                <Datepicker onChange={settDatoTil} value={valgtDatoTil} />
                {datoFeil && <ErrorMessage>{datoFeil}</ErrorMessage>}
            </div>
        </FlexDiv>
    );
};

export default DatoPeriode;
