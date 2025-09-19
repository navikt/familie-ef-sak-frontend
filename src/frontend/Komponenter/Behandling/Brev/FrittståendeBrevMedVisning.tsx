import React, { useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { FrittståendeSanitybrev } from './FrittståendeSanitybrev';
import { HStack, VStack } from '@navikt/ds-react';

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
        <HStack gap="4">
            <div style={{ flex: 1 }}>
                <FrittståendeSanitybrev
                    fagsakId={fagsakId}
                    personopplysninger={personopplysninger}
                    brevRessurs={brevRessurs}
                    oppdaterBrevRessurs={oppdaterBrevRessurs}
                />
            </div>
            <div style={{ flex: 1 }}>
                <VStack gap="2" align="center">
                    <PdfVisning
                        pdfFilInnhold={brevRessurs}
                        erDokumentInnlastet={erDokumentInnlastet}
                        settErDokumentInnlastet={settErDokumentInnlastet}
                    />
                </VStack>
            </div>
        </HStack>
    );
};
