import { Datovelger } from 'nav-datovelger';
import React from 'react';
import styled from 'styled-components';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import { FlexDiv } from './OppgaveFiltrering';
import { OrNothing } from '../../hooks/felles/useSorteringState';

const DatolabelStyle = styled.label`
    margin-bottom: 0.5em;
`;

interface Props {
    datoFraTekst: string;
    datoTilTekst: string;
    valgtDatoFra?: string;
    valgtDatoTil?: string;
    settDatoFra: (datoFra?: string) => void;
    settDatoTil: (datoTil?: string) => void;
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
                <Datovelger onChange={settDatoFra} valgtDato={valgtDatoFra} />
            </div>
            <div className="skjemaelement flex-item">
                <DatolabelStyle className="skjemaelement__label" htmlFor="regdatoTil">
                    {datoTilTekst}
                </DatolabelStyle>
                <Datovelger onChange={settDatoTil} valgtDato={valgtDatoTil} />
                {datoFeil && <SkjemaelementFeilmelding>{datoFeil}</SkjemaelementFeilmelding>}
            </div>
        </FlexDiv>
    );
};

export default DatoPeriode;
