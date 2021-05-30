import React, { useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import PdfVisning from '../../Felleskomponenter/PdfVisning';
import styled from 'styled-components';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../context/BehandlingContext';
import Brevmeny from './Brevmeny';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { useApp } from '../../../context/AppContext';

const StyledBrev = styled.div`
    background-color: #f2f2f2;
    padding: 3rem;
    display: grid;
    grid-template-columns: 30% 70%;
`;

interface Props {
    behandlingId: string;
}

const Brev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const { behandlingErRedigerbar, personopplysningerResponse } = useBehandling();

    const hentBrev = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    useEffect(() => {
        if (!behandlingErRedigerbar) {
            hentBrev();
        }
    }, [behandlingErRedigerbar]);

    return (
        <>
            <StyledBrev>
                {behandlingErRedigerbar && (
                    <DataViewer response={{ personopplysningerResponse }}>
                        {({ personopplysningerResponse }) => (
                            <Brevmeny
                                behandlingId={behandlingId}
                                settBrevRessurs={settBrevRessurs}
                                personopplysninger={personopplysningerResponse}
                            />
                        )}
                    </DataViewer>
                )}
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </StyledBrev>
            {behandlingErRedigerbar && <SendTilBeslutterFooter behandlingId={behandlingId} />}
        </>
    );
};

export default Brev;
