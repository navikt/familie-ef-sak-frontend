import * as React from 'react';
import styled from 'styled-components';
import { Dokumentinfo } from '../../../../App/typer/dokument';
import { AFontWeightRegular } from '@navikt/ds-tokens/dist/tokens';
import { DokumentListeElement } from './DokumentListeElement';

const Container = styled.ul`
    padding: 0;
    margin: 0 1rem;
    list-style-type: none;
    span {
        font-weight: ${AFontWeightRegular};
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
