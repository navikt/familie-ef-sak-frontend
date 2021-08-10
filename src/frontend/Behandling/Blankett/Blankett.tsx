import React, { useEffect, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import PdfVisning from '../../Felles/Pdf/PdfVisning';
import styled from 'styled-components';
import { useBehandling } from '../../App/context/BehandlingContext';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';

interface Props {
    behandlingId: string;
}

const StyledBlankett = styled.div`
    background-color: #f2f2f2;
    padding: 3rem;
`;

const Blankett: React.FC<Props> = ({ behandlingId }) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { axiosRequest } = useApp();
    const [blankettRessurs, settBlankettRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    useEffect(() => {
        hentEllerOpprettBlankett();
        // eslint-disable-next-line
    }, []);

    const hentEllerOpprettBlankett = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/blankett/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBlankettRessurs(respons);
        });
    };

    const harHentetBlankett = (): boolean => blankettRessurs.status === RessursStatus.SUKSESS;

    return (
        <>
            <StyledBlankett>
                <PdfVisning pdfFilInnhold={blankettRessurs} />
            </StyledBlankett>
            {behandlingErRedigerbar && harHentetBlankett() && (
                <SendTilBeslutterFooter behandlingId={behandlingId} />
            )}
        </>
    );
};

export default Blankett;
