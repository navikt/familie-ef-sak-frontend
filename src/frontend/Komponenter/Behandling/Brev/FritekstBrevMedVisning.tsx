import React, { useState } from 'react';
import FritekstBrev from './FritekstBrev';
import styled from 'styled-components';
import { Ressurs, byggTomRessurs } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';

type Props = {
    fagsakId?: string;
};

const BrevMedVisning = styled.div`
    display: flex;
`;

const StyledFritekstBrev = styled(FritekstBrev)`
    margin-right: 10px;
`;

const FritekstBrevMedVisning: React.FC<Props> = ({ fagsakId }: Props) => {
    const [brevRessurs, oppdaterBrevressurs] = useState<Ressurs<string>>(byggTomRessurs());

    return (
        <BrevMedVisning>
            <StyledFritekstBrev oppdaterBrevressurs={oppdaterBrevressurs} fagsakId={fagsakId} />
            <PdfVisning pdfFilInnhold={brevRessurs} />
        </BrevMedVisning>
    );
};

export default FritekstBrevMedVisning;
