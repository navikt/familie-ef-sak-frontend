import * as React from 'react';
import styled from 'styled-components';
import { ILogiskVedlegg, Journalposttype } from '@navikt/familie-typer';
import { BodyShort, Button, Tag } from '@navikt/ds-react';
import { LogiskeVedlegg } from './LogiskeVedlegg';

const StyledDokumentListe = styled.ul`
    padding: 0;
    margin: 0 1rem;
    list-style-type: none;
    span {
        font-weight: var(--a-font-weight-regular);
    }
`;

const StyledLi = styled.li`
    display: grid;
    grid-template-columns: repeat(2, minmax(2rem, max-content));
    gap: 0.5rem;
    margin: 0.5rem 0;
`;

const StyledButton = styled(Button)`
    margin: 0;
    padding: 0;
    text-align: left;
`;

interface JournalpostTagProps {
    journalposttype: Journalposttype;
}

const JournalpostTag: React.FC<JournalpostTagProps> = ({ journalposttype }) => {
    switch (journalposttype) {
        case 'I':
            return (
                <Tag variant="info-moderate" size="small">
                    I
                </Tag>
            );
        case 'N':
            return (
                <Tag variant="neutral-moderate" size="small">
                    N
                </Tag>
            );
        case 'U':
            return (
                <Tag variant="alt1-moderate" size="small">
                    U
                </Tag>
            );
    }
};

export interface DokumentProps {
    tittel: string;
    dato?: string;
    journalpostId: string;
    journalposttype: Journalposttype;
    dokumentinfoId: string;
    filnavn?: string;
    logiskeVedlegg?: ILogiskVedlegg[];
}

export interface DokumentElementProps {
    dokument: DokumentProps;
    onClick: (dokument: DokumentProps) => void;
}

export interface DokumentlisteProps {
    dokumenter: DokumentProps[];
    onClick: (dokument: DokumentProps) => void;
    className?: string;
}

export const DokumentElement: React.FC<DokumentElementProps> = ({ dokument, onClick }) => {
    return (
        <StyledLi>
            <div>
                <JournalpostTag journalposttype={dokument.journalposttype} />
            </div>
            <div>
                <StyledButton variant="tertiary" size="small" onClick={() => onClick(dokument)}>
                    {dokument.tittel}
                </StyledButton>
                <BodyShort size="small">{dokument.dato}</BodyShort>
                <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
            </div>
        </StyledLi>
    );
};

export const Dokumentliste: React.FC<DokumentlisteProps> = ({ dokumenter, onClick, className }) => {
    return (
        <StyledDokumentListe className={className}>
            {dokumenter.map((dokument: DokumentProps, indeks: number) => {
                return <DokumentElement dokument={dokument} onClick={onClick} key={indeks} />;
            })}
        </StyledDokumentListe>
    );
};

export default Dokumentliste;
