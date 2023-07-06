import React from 'react';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { Td } from '../../../Felles/Personopplysninger/TabellWrapper';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import { useToggles } from '../../../App/context/TogglesContext';
import { skalViseLenke } from '../utils';
import { IkkeTilgang } from './Hovedtabellrad';
import { PadlockLockedIcon } from '@navikt/aksel-icons';

const LenkeVenstreMargin = styled.a`
    margin-left: 2rem;

    &:visited {
        color: purple;
    }
`;

export const Tabellrad: React.FC<{ dokument: Dokumentinfo; erKlikketId: string }> = ({
    dokument,
}) => {
    const { toggles } = useToggles();
    return (
        <tr>
            <Td></Td>
            <Td></Td>
            <Td>
                {skalViseLenke(dokument, toggles) ? (
                    <>
                        <LenkeVenstreMargin
                            href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}`}
                            target={'_blank'}
                            rel={'noreferrer'}
                        >
                            {dokument.tittel}
                        </LenkeVenstreMargin>
                        <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
                    </>
                ) : (
                    <IkkeTilgang>
                        <PadlockLockedIcon title="Mangler tilgang til dokument" />
                        <BodyShortSmall>{dokument.tittel}</BodyShortSmall>
                    </IkkeTilgang>
                )}
            </Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
        </tr>
    );
};
