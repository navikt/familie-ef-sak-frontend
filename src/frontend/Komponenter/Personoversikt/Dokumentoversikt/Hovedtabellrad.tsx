import React from 'react';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { Td } from '../../../Felles/Personopplysninger/TabellWrapper';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { Arkivtema, arkivtemaerTilTekst } from '../../../App/typer/arkivtema';
import { tekstMapping } from '../../../App/utils/tekstmapping';
import {
    avsenderMottakerIdTypeTilTekst,
    journalstatusTilTekst,
} from '../../../App/typer/journalføring';
import { Utsendingsinfo } from '../Utsendingsinfo';
import styled from 'styled-components';
import { Journalposttype } from '@navikt/familie-typer';
import { DownFilled, LeftFilled, RightFilled } from '@navikt/ds-icons';
import { skalViseLenke } from '../utils';
import { PadlockLockedIcon } from '@navikt/aksel-icons';

const TrHoveddokument = styled.tr`
    background-color: #f7f7f7;
`;

const HovedLenke = styled.a`
    &:visited {
        color: purple;
    }
`;

const InnUt = styled.div`
    svg {
        vertical-align: -0.2em;
        margin-right: 0.5rem;
    }
`;

export const IkkeTilgang = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const ikonForJournalposttype: Record<Journalposttype, React.ReactElement> = {
    I: <LeftFilled />,
    N: <DownFilled />,
    U: <RightFilled />,
};

export const HovedTabellrad: React.FC<{ dokument: Dokumentinfo; erKlikketId: string }> = ({
    dokument,
}) => {
    return (
        <TrHoveddokument>
            <Td>{formaterNullableIsoDatoTid(dokument.dato)}</Td>
            <Td>
                <InnUt>
                    {ikonForJournalposttype[dokument.journalposttype]}
                    <strong>{dokument.journalposttype}</strong>
                </InnUt>
            </Td>
            <Td>
                {skalViseLenke(dokument) ? (
                    <>
                        <HovedLenke
                            key={dokument.journalpostId}
                            href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}`}
                            target={'_blank'}
                            rel={'noreferrer'}
                        >
                            {dokument.tittel}
                        </HovedLenke>
                        <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
                    </>
                ) : (
                    <IkkeTilgang>
                        <PadlockLockedIcon title="Mangler tilgang til dokument" />
                        <BodyShortSmall>{dokument.tittel}</BodyShortSmall>
                    </IkkeTilgang>
                )}
            </Td>
            <Td>{utledAvsenderMottakerDetaljer(dokument)}</Td>
            <Td>{arkivtemaerTilTekst[dokument.tema as Arkivtema]}</Td>
            <Td>
                <BodyShortSmall>
                    {tekstMapping(dokument.journalstatus, journalstatusTilTekst)}
                </BodyShortSmall>
            </Td>
            <Td>
                <Utsendingsinfo utsendingsinfo={dokument.utsendingsinfo} />
            </Td>
        </TrHoveddokument>
    );
};

const utledAvsenderMottakerDetaljer = (dokument: Dokumentinfo): string => {
    let avsender = '';
    const avsenderMottaker = dokument.avsenderMottaker;
    if (!avsenderMottaker) {
        return avsender;
    }
    if (avsenderMottaker.navn) {
        avsender += avsenderMottaker.navn;
    }
    const type = avsenderMottaker.type;
    const id = avsenderMottaker.id;
    if (!avsenderMottaker.erLikBruker && (type || id)) {
        avsender += ' (';
        if (type && avsenderMottakerIdTypeTilTekst[type]) {
            avsender += avsenderMottakerIdTypeTilTekst[type];
            if (id) {
                avsender += ': ';
            }
        }
        if (id) {
            avsender += id;
        }
        avsender += ')';
    }
    return avsender;
};
