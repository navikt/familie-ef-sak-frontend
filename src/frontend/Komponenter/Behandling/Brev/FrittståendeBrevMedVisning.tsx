import React, { useMemo, useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { IFrittståendeBrev } from './BrevTyper';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import FrittståendeBrev from './FrittståendeBrev';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import { FrittståendeSanitybrev } from './FrittståendeSanitybrev';

import { HøyreKolonne, StyledBrev, VenstreKolonne } from './StyledBrev';

type Props = {
    fagsakId: string;
    personopplysninger: IPersonopplysninger;
};

const FrittståendeBrevMedVisning: React.FC<Props> = ({ fagsakId, personopplysninger }: Props) => {
    const [brevRessurs, oppdaterBrevressurs] = useState<Ressurs<string>>(byggTomRessurs());

    const { toggles } = useToggles();

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
        <StyledBrev>
            <DataViewer response={{ mellomlagretFrittståendeBrev }}>
                {({ mellomlagretFrittståendeBrev }) => {
                    const skalViseFritekstbrev =
                        mellomlagretFrittståendeBrev ||
                        !toggles[ToggleName.sanitybrev_frittstående];
                    return (
                        <VenstreKolonne>
                            {skalViseFritekstbrev ? (
                                <FrittståendeBrev
                                    oppdaterBrevressurs={oppdaterBrevressurs}
                                    fagsakId={fagsakId}
                                    mellomlagretFrittståendeBrev={mellomlagretFrittståendeBrev}
                                    personopplysninger={personopplysninger}
                                />
                            ) : (
                                <FrittståendeSanitybrev
                                    fagsakId={fagsakId}
                                    personopplysninger={personopplysninger}
                                    brevRessurs={brevRessurs}
                                    oppdaterBrevRessurs={oppdaterBrevressurs}
                                />
                            )}
                        </VenstreKolonne>
                    );
                }}
            </DataViewer>
            <HøyreKolonne>
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </HøyreKolonne>
        </StyledBrev>
    );
};

export default FrittståendeBrevMedVisning;
