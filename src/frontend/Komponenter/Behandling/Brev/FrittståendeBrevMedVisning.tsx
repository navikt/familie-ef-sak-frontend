import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { IFrittståendeBrev } from './BrevTyper';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import FrittståendeBrev from './FrittståendeBrev';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';

type Props = {
    fagsakId: string;
    personopplysninger: IPersonopplysninger;
};

const BrevMedVisning = styled.div`
    width: 100%;
    padding-left: 2rem;
    padding-right: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
`;

const FrittståendeBrevMedVisning: React.FC<Props> = ({ fagsakId, personopplysninger }: Props) => {
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
                    <FrittståendeBrev
                        oppdaterBrevressurs={oppdaterBrevressurs}
                        fagsakId={fagsakId}
                        mellomlagretFrittståendeBrev={mellomlagretFrittståendeBrev}
                        personopplysninger={personopplysninger}
                    />
                )}
            </DataViewer>
            <PdfVisning pdfFilInnhold={brevRessurs} />
        </BrevMedVisning>
    );
};

export default FrittståendeBrevMedVisning;
