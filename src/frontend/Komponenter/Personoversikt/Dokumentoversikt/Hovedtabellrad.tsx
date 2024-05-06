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
import { skalViseLenke } from '../utils';
import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { tittelMedUrlGodkjenteTegn } from '../../../App/utils/utils';

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

export const HovedTabellrad: React.FC<{ dokument: Dokumentinfo; erKlikketId: string }> = ({
    dokument,
}) => {
    return (
        <tr>
            <Td>{formaterNullableIsoDatoTid(dokument.dato)}</Td>
            <Td>
                <InnUt>
                    <strong>{dokument.journalposttype}</strong>
                </InnUt>
            </Td>
            <Td>{arkivtemaerTilTekst[dokument.tema as Arkivtema]}</Td>
            <Td>{utledAvsenderMottakerDetaljer(dokument)}</Td>
            <Td>
                {skalViseLenke(dokument) ? (
                    <>
                        <HovedLenke
                            key={dokument.journalpostId}
                            href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}/${tittelMedUrlGodkjenteTegn(dokument.tittel)}`}
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
            <Td>
                <BodyShortSmall>
                    {tekstMapping(dokument.journalstatus, journalstatusTilTekst)}
                </BodyShortSmall>
            </Td>
            <Td>
                <Utsendingsinfo utsendingsinfo={dokument.utsendingsinfo} />
            </Td>
        </tr>
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
    const type = avsenderMottaker.type ? avsenderMottakerIdTypeTilTekst[avsenderMottaker.type] : '';
    const id = avsenderMottaker.id;
    if (!avsenderMottaker.erLikBruker && (type || id)) {
        avsender += ' (';
        if (type) {
            avsender += type;
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
