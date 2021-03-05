import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import BrevFooter from './BrevFooter';
import PdfVisning from '../../Journalforing/PdfVisning';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';

const GenererBrev = styled(Knapp)`
    display: block;
    margin: 0 auto;
`;

const HentBrev = styled(Knapp)`
    display: block;
    margin: 0 auto;
    margin-top: 2rem;
`;

const StyledBrev = styled.div`
    background-color: #f2f2f2;
    padding: 3rem;
`;

interface Props {
    behandlingId: string;
}

const Brev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const data = { navn: 'test', ident: '123456789' };

    const genererBrev = () => {
        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
            data: data,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    const hentBrev = () => {
        axiosRequest<string, any>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    return (
        <>
            <StyledBrev>
                <GenererBrev onClick={genererBrev}>Generer brev</GenererBrev>
                <HentBrev onClick={hentBrev}>Hent brev</HentBrev>
                <PdfVisning pdfFilInnhold={brevRessurs}></PdfVisning>
            </StyledBrev>
            <BrevFooter behandlingId={behandlingId} />
        </>
    );
};

export default Brev;
