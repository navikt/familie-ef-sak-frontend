import React, { useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { FrittståendeSanitybrev } from './FrittståendeSanitybrev';

import { HøyreKolonne, StyledBrev, VenstreKolonne } from './StyledBrev';

type Props = {
    fagsakId: string;
    personopplysninger: IPersonopplysninger;
};

export const FrittståendeBrevMedVisning: React.FC<Props> = ({
    fagsakId,
    personopplysninger,
}: Props) => {
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const [erDokumentInnlastet, settErDokumentInnlastet] = useState(false);

    const oppdaterBrevRessurs = (brevRessurs: Ressurs<string>) => {
        settBrevRessurs(brevRessurs);
        settErDokumentInnlastet(false);
    };

    return (
        <StyledBrev>
            <VenstreKolonne>
                <FrittståendeSanitybrev
                    fagsakId={fagsakId}
                    personopplysninger={personopplysninger}
                    brevRessurs={brevRessurs}
                    oppdaterBrevRessurs={oppdaterBrevRessurs}
                />
            </VenstreKolonne>
            <HøyreKolonne>
                <PdfVisning
                    pdfFilInnhold={brevRessurs}
                    erDokumentInnlastet={erDokumentInnlastet}
                    settErDokumentInnlastet={settErDokumentInnlastet}
                />
            </HøyreKolonne>
        </StyledBrev>
    );
};
