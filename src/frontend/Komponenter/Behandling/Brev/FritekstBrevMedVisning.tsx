import React, { useState } from 'react';
import FritekstBrev from './FritekstBrev';
import styled from 'styled-components';
import { Ressurs, byggTomRessurs } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { FritekstBrevContext } from './BrevTyper';

type Props = {
    fagsakId?: string;
    context: FritekstBrevContext;
};

const BrevMedVisning = styled.div`
    display: flex;
`;

const StyledFritekstBrev = styled(FritekstBrev)`
    margin-right: 10px;
`;

const FritekstBrevMedVisning: React.FC<Props> = ({ fagsakId, context }: Props) => {
    const [brevRessurs, oppdaterBrevressurs] = useState<Ressurs<string>>(byggTomRessurs());

    return (
        <BrevMedVisning>
            <StyledFritekstBrev
                oppdaterBrevressurs={oppdaterBrevressurs}
                fagsakId={fagsakId}
                context={context}
            />
            <PdfVisning pdfFilInnhold={brevRessurs} />
        </BrevMedVisning>
    );
};

export default FritekstBrevMedVisning;
