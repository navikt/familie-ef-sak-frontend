import React from 'react';
import styled from 'styled-components';
import { ILogiskVedlegg } from '../../App/typer/dokumentliste';
import { BodyShort, Button } from '@navikt/ds-react';
import { EditFilled, FileContent } from '@navikt/ds-icons';

const IkonKnapp = styled(Button)`
    margin-right: 0.5rem;
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
                    <IkonKnapp
                        type="button"
                        variant={'tertiary'}
                        size={'small'}
                        icon={<EditFilled />}
                        onClick={settDokumentForRedigering}
                    />
                    <IkonKnapp
                        type="button"
                        variant={'tertiary'}
                        size={'small'}
                        icon={<FileContent />}
                        onClick={hentDokument}
                    />
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
