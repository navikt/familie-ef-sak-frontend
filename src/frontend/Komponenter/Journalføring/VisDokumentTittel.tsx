import React from 'react';
import Rediger from '../../Felles/Ikoner/Rediger';
import VisPdf from '../../Felles/Ikoner/VisPdf';
import styled from 'styled-components';
import { Flatknapp } from 'nav-frontend-knapper';
import { ILogiskVedlegg } from '../../App/typer/dokumentliste';
import { BodyShort } from '@navikt/ds-react';

const StyledFlatKnapp = styled(Flatknapp)`
    margin-right: 0.25rem;
`;

const StyledDokumentRad = styled.div`
    display: flex;
    justify-content: space-between;
`;

const LogiskeVedlegg = styled.div`
    padding-left: 0.5rem;
`;

interface VisDokumentTittelProps {
    settDokumentForRedigering: () => void;
    hentDokument: () => void;
    dokumentTittel?: string;
    logiskeVedlegg: ILogiskVedlegg[];
}

const VisDokumentTittel: React.FC<VisDokumentTittelProps> = ({
    dokumentTittel,
    hentDokument,
    settDokumentForRedigering,
    logiskeVedlegg,
}) => {
    return (
        <>
            <StyledDokumentRad>
                <span>{dokumentTittel}</span>
                <div>
                    <StyledFlatKnapp kompakt={true} onClick={settDokumentForRedigering}>
                        <Rediger />
                    </StyledFlatKnapp>
                    <StyledFlatKnapp kompakt onClick={hentDokument}>
                        <VisPdf />
                    </StyledFlatKnapp>
                </div>
            </StyledDokumentRad>
            {logiskeVedlegg.length > 0 && (
                <LogiskeVedlegg>
                    {logiskeVedlegg.map((vedlegg) => (
                        <BodyShort size="small">{vedlegg.tittel}</BodyShort>
                    ))}
                </LogiskeVedlegg>
            )}
        </>
    );
};

export default VisDokumentTittel;
