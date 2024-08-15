import React from 'react';
import { FlexDiv } from './OppgaveFiltrering';
import { EnsligErrorMessage } from '../../Felles/ErrorMessage/EnsligErrorMessage';
import { Datovelger } from '../../Felles/Datovelger/Datovelger';
import { OrNothing } from '../../App/typer/common';

interface Props {
    datoFraTekst: string;
    datoTilTekst: string;
    valgtDatoFra?: string;
    valgtDatoTil?: string;
    settDatoFra: (dato?: string) => void;
    settDatoTil: (dato?: string) => void;
    datoFeil: OrNothing<string>;
    id: string;
}

const DatoPeriode: React.FC<Props> = ({
    datoFraTekst,
    datoTilTekst,
    valgtDatoFra,
    valgtDatoTil,
    settDatoFra,
    settDatoTil,
    datoFeil,
    id,
}) => {
    return (
        <FlexDiv>
            <Datovelger
                settVerdi={settDatoFra}
                verdi={valgtDatoFra}
                id={'fra-dato-filter' + id}
                label={datoFraTekst}
            />
            <Datovelger
                settVerdi={settDatoTil}
                verdi={valgtDatoTil}
                label={datoTilTekst}
                id={'til-dato-filter' + id}
            />
            <EnsligErrorMessage>{datoFeil}</EnsligErrorMessage>
        </FlexDiv>
    );
};

export default DatoPeriode;
