import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { useApp } from '../../../context/AppContext';
import { Ressurs } from '../../../typer/ressurs';

interface Props {
    behandlingId: string;
}

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
`;

const Brev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();

    const data = { tittel: 'test' };

    const genererBrev = () => {
        axiosRequest<any, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/${behandlingId}/lagBrev`,
            data: data,
        }).then((respons: Ressurs<string>) => {
            console.log('respons', respons);
        });
    };

    return (
        <StyledDiv>
            <Knapp onClick={genererBrev}>Generer brev</Knapp>
        </StyledDiv>
    );
};

export default Brev;
