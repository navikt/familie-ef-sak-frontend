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
    const [brevRessurs, oppdaterBrevressurs] = useState<Ressurs<string>>(byggTomRessurs());

    return (
        <StyledBrev>
            <VenstreKolonne>
                <FrittståendeSanitybrev
                    fagsakId={fagsakId}
                    personopplysninger={personopplysninger}
                    brevRessurs={brevRessurs}
                    oppdaterBrevRessurs={oppdaterBrevressurs}
                />
            </VenstreKolonne>
            <HøyreKolonne>
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </HøyreKolonne>
        </StyledBrev>
    );
};
