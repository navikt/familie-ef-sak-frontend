import React, { useMemo, useState } from 'react';
import FritekstBrev from './FritekstBrev';
import styled from 'styled-components';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { FritekstBrevContext, IFrittståendeBrev } from './BrevTyper';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../../Felles/DataViewer/DataViewer';

type Props = {
    fagsakId?: string;
    context: FritekstBrevContext;
};

const BrevMedVisning = styled.div`
    width: 100%;
    padding-left: 2rem;
    padding-right: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
`;

const FritekstBrevMedVisning: React.FC<Props> = ({ fagsakId, context }: Props) => {
    const [brevRessurs, oppdaterBrevressurs] = useState<Ressurs<string>>(byggTomRessurs());
    const hentMellomlagretFrittståendeBrev: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/mellomlager/frittstaende/${fagsakId}`,
        }),
        [fagsakId]
    );
    const mellomlagretFrittståendeBrev = useDataHenter<IFrittståendeBrev | undefined, null>(
        hentMellomlagretFrittståendeBrev
    );

    return (
        <BrevMedVisning>
            <DataViewer response={{ mellomlagretFrittståendeBrev }}>
                {({ mellomlagretFrittståendeBrev }) => (
                    <FritekstBrev
                        oppdaterBrevressurs={oppdaterBrevressurs}
                        fagsakId={fagsakId}
                        context={context}
                        mellomlagretFrittståendeBrev={mellomlagretFrittståendeBrev}
                    />
                )}
            </DataViewer>
            <PdfVisning pdfFilInnhold={brevRessurs} />
        </BrevMedVisning>
    );
};

export default FritekstBrevMedVisning;
