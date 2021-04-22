import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import PdfVisning from '../../Felleskomponenter/PdfVisning';
import styled from 'styled-components';
import { useBehandling } from '../../../context/BehandlingContext';
import { erBehandlingRedigerbar } from '../../../typer/behandlingstatus';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';

interface Props {
    behandlingId: string;
}

const StyledBlankett = styled.div`
    background-color: #f2f2f2;
    padding: 3rem;
`;

const Blankett: React.FC<Props> = ({ behandlingId }) => {
    const { behandling } = useBehandling();
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
            <DataViewer response={{ behandling }}>
                {({ behandling }) => (
                    <>
                        <StyledBlankett>
                            <PdfVisning pdfFilInnhold={blankettRessurs}></PdfVisning>
                        </StyledBlankett>
                        {erBehandlingRedigerbar(behandling) && harHentetBlankett() && (
                            <SendTilBeslutterFooter behandlingId={behandlingId} />
                        )}
                    </>
                )}
            </DataViewer>
        </>
    );
};

export default Blankett;
