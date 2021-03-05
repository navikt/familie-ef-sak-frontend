import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import BlankettFooter from './BlankettFooter';
import PdfVisning from '../../Journalforing/PdfVisning';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
    behandlingId: string;
}

const GenererBlankett = styled(Knapp)`
    display: block;
    margin: 0 auto;
`;

const HentBlankett = styled(Knapp)`
    display: block;
    margin: 0 auto;
    margin-top: 2rem;
`;

const StyledBlankett = styled.div`
    background-color: #f2f2f2;
    padding: 3rem;
`;

const Blankett: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const [blankettRessurs, settBlankettRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const data = { navn: 'test', ident: '123456789' };

    const genererBlankett = () => {
        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/blankett/${behandlingId}`,
            data: data,
        }).then((respons: Ressurs<string>) => {
            settBlankettRessurs(respons);
        });
    };

    const hentBlankett = () => {
        axiosRequest<string, any>({
            method: 'GET',
            url: `/familie-ef-sak/api/blankett/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBlankettRessurs(respons);
        });
    };

    return (
        <>
            <StyledBlankett>
                <GenererBlankett onClick={genererBlankett}>Generer blankett</GenererBlankett>
                <HentBlankett onClick={hentBlankett}>Hent blankett</HentBlankett>
                <PdfVisning pdfFilInnhold={blankettRessurs}></PdfVisning>
            </StyledBlankett>
            <BlankettFooter behandlingId={behandlingId} />
        </>
    );
};

export default Blankett;
