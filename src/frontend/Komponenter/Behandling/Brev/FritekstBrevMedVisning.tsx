import React, { useState } from 'react';
import FritekstBrev from './FritekstBrev';
import styled from 'styled-components';
import { Ressurs, byggTomRessurs } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';

type Props = {
    fagsakId?: string;
};

const BrevMedVisning = styled.div`
    width: 100%;
    padding-left: 2rem;
    padding-right: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
`;

const FritekstBrevMedVisning: React.FC<Props> = ({ fagsakId }: Props) => {
    const [brevRessurs, oppdaterBrevressurs] = useState<Ressurs<string>>(byggTomRessurs());
    return (
        <BrevMedVisning>
            <FritekstBrev oppdaterBrevressurs={oppdaterBrevressurs} fagsakId={fagsakId} />
            <PdfVisning pdfFilInnhold={brevRessurs} />
        </BrevMedVisning>
    );
};

export default FritekstBrevMedVisning;
