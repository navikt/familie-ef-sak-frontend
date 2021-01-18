import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../context/AppContext';
import { Input } from 'nav-frontend-skjema';
import DatoPeriode from '../../Oppgavebenk/DatoPeriode';
import { useHistory } from 'react-router';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
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
    const history = useHistory();
    const [startDato, settStartDato] = useState('');
    const [sluttDato, settSluttDato] = useState('');
    const [inntekt, settInntekt] = useState('');
    const [suksess, settSuksess] = useState<boolean>(false);
    const [feil, settFeil] = useState<string>('');

    const { axiosRequest } = useApp();

    useEffect(() => {
        suksess && history.push(`/behandling/${behandlingId}/utbetalingsoversikt`);
    }, [suksess]);

    const beregn = (): any => {
        const data = {
            inntektsPerioder: [],
            stønadFom: 'Dato her',
            stønadTom: 'Dato her',
        };

        axiosRequest<any, any>({
            method: 'POST',
            url: `http://localhost:8000/familie-ef-sak/api/beregning/${behandlingId}/fullfor`,
            data,
        }).then((respons: Ressurs<string>) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    settSuksess(true);
                    return respons;
                case RessursStatus.FEILET:
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                    settFeil(respons.frontendFeilmelding);
                    return respons;
                default:
                    return respons;
            }
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
