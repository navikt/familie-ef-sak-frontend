import { Datovelger } from 'nav-datovelger';
import React from 'react';
import styled from 'styled-components';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import { OrNothing } from '../../hooks/useSorteringState';
import { isBefore } from 'date-fns';
import { FlexDiv } from './OppgaveFiltrering';

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
}

const datoFeil = (valgtDatoFra?: string, valgtDatoTil?: string): OrNothing<string> => {
    if (!valgtDatoFra || !valgtDatoTil) {
        return null;
    }
    if (isBefore(new Date(valgtDatoTil), new Date(valgtDatoFra))) {
        return 'Til dato må vare etter til fra dato';
    }
    return null;
};

const DatoPeriode: React.FC<Props> = ({
    datoFraTekst,
    datoTilTekst,
    valgtDatoFra,
    valgtDatoTil,
    settDatoFra,
    settDatoTil,
}) => {
    const harDatoFeil = datoFeil(valgtDatoFra, valgtDatoTil);
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
                {harDatoFeil && <SkjemaelementFeilmelding>{harDatoFeil}</SkjemaelementFeilmelding>}
            </div>
        </FlexDiv>
    );
};

export default DatoPeriode;
