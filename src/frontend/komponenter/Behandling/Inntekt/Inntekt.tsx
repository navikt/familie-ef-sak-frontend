import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../context/AppContext';
import { Input } from 'nav-frontend-skjema';
import DatoPeriode from '../../Oppgavebenk/DatoPeriode';
import { Redirect, useHistory } from 'react-router';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
    behandlingId: string;
}

const StyledInntekt = styled.div`
    padding: 2rem;
`;

const StyledInput = styled(Input)`
    max-width: 200px;
    margin-bottom: 1rem;
`;

const Inntekt: FC<Props> = ({ behandlingId }) => {
    const [startDato, settStartDato] = useState('');
    const [sluttDato, settSluttDato] = useState('');
    const [inntekt, settInntekt] = useState('');

    const { axiosRequest } = useApp();

    const beregn = (): any => {
        const data = {
            startDato,
            sluttDato,
            inntekt,
        };

        axiosRequest<any, any>({
            method: 'POST',
            url: `http://localhost:8000/familie-ef-sak/api/beregning/${behandlingId}/fullfor`,
            data,
        }).then((respons: any) => {
            console.log('respons', respons);
        });
    };

    return (
        <StyledInntekt>
            <StyledInput
                type="number"
                label={'Inntekt'}
                value={inntekt}
                onChange={(e) => settInntekt(e.target.value)}
            />
            <DatoPeriode
                datoFraTekst="Dato fra"
                datoTilTekst="Dato fil"
                settDatoFra={settStartDato}
                settDatoTil={settSluttDato}
                valgtDatoFra={startDato}
                valgtDatoTil={sluttDato}
                datoFeil={undefined}
            />
            <Knapp onClick={beregn}>Beregn</Knapp>
        </StyledInntekt>
    );
};

export default Inntekt;
