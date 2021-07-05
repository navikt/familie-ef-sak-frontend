import React, { FC } from 'react';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';
import { Knapp } from 'nav-frontend-knapper';
import { Ressurs } from '../../typer/ressurs';

interface Props {
    behandlingId: string;
}

const StyledUtbetalingsoversikt = styled.div`
    display: flex;
    flex-direction: column;

    padding: 2rem;
`;

const StyledKnapp = styled(Knapp)`
    margin-top: 1rem;
    max-width: 300px;
`;

const Utbetalingsoversikt: FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();

    const sendTilBeslutter = () => {
        // eslint-disable-next-line
        axiosRequest<any, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter`,
        }).then((respons: Ressurs<string>) => {
            console.log('respons', respons);
        });
    };

    const beslutteVedtak = () => {
        // eslint-disable-next-line
        axiosRequest<any, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/beslutte-vedtak`,
        }).then((respons: Ressurs<string>) => {
            console.log('respons', respons);
        });
    };

    return (
        <StyledUtbetalingsoversikt>
            <StyledKnapp onClick={sendTilBeslutter}>Send til beslutter</StyledKnapp>
            <StyledKnapp onClick={beslutteVedtak}>Beslutte vedtak</StyledKnapp>
        </StyledUtbetalingsoversikt>
    );
};

export default Utbetalingsoversikt;
