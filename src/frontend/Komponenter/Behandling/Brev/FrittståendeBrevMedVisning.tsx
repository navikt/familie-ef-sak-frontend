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
    display: flex;
    column-gap: 4rem;
    flex-flow: wrap;
`;

const VenstreKolonne = styled.div`
    width: 48rem;
`;

const HøyreKolonne = styled.div`
    flex-shrink: 0;
    flex-grow: 1;
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
                    <VenstreKolonne>
                        <FrittståendeBrev
                            oppdaterBrevressurs={oppdaterBrevressurs}
                            fagsakId={fagsakId}
                            mellomlagretFrittståendeBrev={mellomlagretFrittståendeBrev}
                            personopplysninger={personopplysninger}
                        />
                    </VenstreKolonne>
                )}
            </DataViewer>
            <HøyreKolonne>
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </HøyreKolonne>
        </BrevMedVisning>
    );
};

export default FrittståendeBrevMedVisning;
