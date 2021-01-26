import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { useApp } from '../../../context/AppContext';
import { Ressurs } from '../../../typer/ressurs';

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
`;
const Brev: React.FC = () => {
    const { axiosRequest } = useApp();

    const genererBrev = () => {
        axiosRequest<any, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/send-til-beslutter`,
        }).then((respons: Ressurs<string>) => {
            console.log('respons', respons);
        });
    };

    return (
        <StyledDiv>
            <Knapp>Generer brev</Knapp>
        </StyledDiv>
    );
};

export default Brev;
