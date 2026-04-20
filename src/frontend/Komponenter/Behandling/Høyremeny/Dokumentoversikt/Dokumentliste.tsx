import * as React from 'react';
import styled from 'styled-components';
import { Dokumentinfo } from '../../../../App/typer/dokument';
import { DokumentListeElement } from './DokumentListeElement';
import { FontWeightRegular } from '@navikt/ds-tokens/js';

const Container = styled.ul`
    padding: 0;
    margin: 0 1rem;
    list-style-type: none;
    span {
        font-weight: ${FontWeightRegular};
    }
`;

export interface Props {
    dokumenter: Dokumentinfo[];
    onClick: (dokument: Dokumentinfo) => void;
    className?: string;
}

export const Dokumentliste: React.FC<Props> = ({ dokumenter, onClick, className }) => (
    <Container className={className}>
        {dokumenter.map((dokument: Dokumentinfo, indeks: number) => {
            return <DokumentListeElement dokument={dokument} onClick={onClick} key={indeks} />;
        })}
    </Container>
);
