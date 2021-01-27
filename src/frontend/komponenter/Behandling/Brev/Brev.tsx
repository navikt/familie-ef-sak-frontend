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

const Brev: React.FC<Props> = () => {
    const { axiosRequest } = useApp();

    const data = { tittel: 'test' };

    const genererBrev = () => {
        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/lag-brev`,
            data: data,
        }).then((respons: Ressurs<any>) => {
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
