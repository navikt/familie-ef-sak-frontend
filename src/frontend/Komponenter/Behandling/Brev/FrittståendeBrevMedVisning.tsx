import React, { useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { FrittståendeSanitybrev } from './FrittståendeSanitybrev';
import { styled } from 'styled-components';
import { VStack } from '@navikt/ds-react';

const Container = styled.div`
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: #f2f2f2;

    @media (max-width: 1400px) {
        flex-direction: column;
        padding: 3rem;
    }
`;

const LikDelContainer = styled.div`
    flex: 1;
`;

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
        <Container>
            <LikDelContainer>
                <FrittståendeSanitybrev
                    fagsakId={fagsakId}
                    personopplysninger={personopplysninger}
                    brevRessurs={brevRessurs}
                    oppdaterBrevRessurs={oppdaterBrevRessurs}
                />
            </LikDelContainer>
            <LikDelContainer>
                <VStack gap="2" align="center">
                    <PdfVisning
                        pdfFilInnhold={brevRessurs}
                        erDokumentInnlastet={erDokumentInnlastet}
                        settErDokumentInnlastet={settErDokumentInnlastet}
                    />
                </VStack>
            </LikDelContainer>
        </Container>
    );
};
