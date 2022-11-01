import React, { useMemo } from 'react';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { TabellWrapper, Td } from '../../Felles/Personopplysninger/TabellWrapper';
import Mappe from '../../Felles/Ikoner/Mappe';
import TabellOverskrift from '../../Felles/Personopplysninger/TabellOverskrift';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Dokumentinfo, ILogiskVedlegg } from '../../App/typer/dokumentliste';
import { formaterNullableIsoDatoTid } from '../../App/utils/formatter';
import { groupBy } from '../../App/utils/utils';
import { tekstMapping } from '../../App/utils/tekstmapping';
import { IFagsakPerson } from '../../App/typer/fagsak';
import { Journalposttype, Journalstatus } from '@navikt/familie-typer';
import { DownFilled, LeftFilled, RightFilled } from '@navikt/ds-icons';
import {
    avsenderMottakerIdTypeTilTekst,
    journalstatusTilTekst,
} from '../../App/typer/journalføring';

const DokumenterVisning = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 5rem;
`;

const TrHoveddokument = styled.tr`
    background-color: #f7f7f7;
`;

const LenkeVenstreMargin = styled.a`
    margin-left: 2rem;

    &:visited {
        color: purple;
    }
`;

const HovedLenke = styled.a`
    &:visited {
        color: purple;
    }
`;

const DivMedVenstreMargin = styled.div`
    margin-left: 2rem;
`;

const InnUt = styled.div`
    svg {
        vertical-align: -0.2em;
        margin-right: 0.5rem;
    }
`;

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
                avsender += ' ';
            }
        }
        if (id) {
            avsender += id;
        }
        avsender += ')';
    }
    return avsender;
};

const ikoneForJournalposttype: Record<Journalposttype, React.ReactElement> = {
    I: <LeftFilled />,
    N: <DownFilled />,
    U: <RightFilled />,
};

const Dokumenter: React.FC<{ fagsakPerson: IFagsakPerson }> = ({ fagsakPerson }) => {
    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedlegg/fagsak-person/${fagsakPerson.id}`,
        }),
        [fagsakPerson]
    );

    const dokumentResponse = useDataHenter<Dokumentinfo[], null>(dokumentConfig);

    const dokumentGruppeSkalIkkeVises = (dokumenter: Dokumentinfo[]): boolean => {
        const journalStatuser = [Journalstatus.FEILREGISTRERT, Journalstatus.AVBRUTT];
        return dokumenter.some((dokument) => journalStatuser.includes(dokument.journalstatus));
    };

    const Kolonnetittel: React.FC<{ text: string; width: number }> = ({ text, width }) => (
        <Td width={`${width}%`}>
            <Element>{text}</Element>
        </Td>
    );

    const LogiskeVedlegg: React.FC<{ logiskeVedlegg: ILogiskVedlegg[] }> = ({ logiskeVedlegg }) => (
        <>
            {logiskeVedlegg.map((logiskVedlegg, index) => (
                <DivMedVenstreMargin key={`${logiskVedlegg.tittel}${index}`}>
                    {logiskVedlegg.tittel}
                </DivMedVenstreMargin>
            ))}
        </>
    );

    const Tabellrad: React.FC<{ dokument: Dokumentinfo; erKlikketId: string }> = ({ dokument }) => (
        <tr>
            <Td></Td>
            <Td></Td>
            <Td>
                <LenkeVenstreMargin
                    href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}`}
                    target={'_blank'}
                    rel={'noreferrer'}
                >
                    {dokument.tittel}
                </LenkeVenstreMargin>
                <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
            </Td>
            <Td></Td>
            <Td></Td>
        </tr>
    );

    const HovedTabellrad: React.FC<{ dokument: Dokumentinfo; erKlikketId: string }> = ({
        dokument,
    }) => (
        <TrHoveddokument>
            <Td>{formaterNullableIsoDatoTid(dokument.dato)}</Td>
            <Td>
                <InnUt>
                    {ikoneForJournalposttype[dokument.journalposttype]}
                    <strong>{dokument.journalposttype}</strong>
                </InnUt>
            </Td>
            <Td>
                <HovedLenke
                    key={dokument.journalpostId}
                    href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}`}
                    target={'_blank'}
                    rel={'noreferrer'}
                >
                    {dokument.tittel}
                </HovedLenke>
                <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
            </Td>
            <Td>{utledAvsenderMottakerDetaljer(dokument)}</Td>
            <Td>
                <Normaltekst>
                    {tekstMapping(dokument.journalstatus, journalstatusTilTekst)}
                </Normaltekst>
            </Td>
        </TrHoveddokument>
    );

    return (
        <DataViewer response={{ dokumentResponse }}>
            {({ dokumentResponse }) => {
                const grupperteDokumenter = groupBy(dokumentResponse, (i) => i.journalpostId);

                return (
                    <>
                        <DokumenterVisning>
                            <TabellWrapper>
                                <TabellOverskrift Ikon={Mappe} tittel={'Dokumenter'} />
                                <table className="tabell">
                                    <thead>
                                        <Kolonnetittel text={'Dato'} width={12} />
                                        <Kolonnetittel text={'Inn/ut'} width={5} />
                                        <Kolonnetittel text={'Tittel'} width={43} />
                                        <Kolonnetittel text={'Avsender/mottaker'} width={20} />
                                        <Kolonnetittel text={'Status'} width={10} />
                                    </thead>
                                    <tbody>
                                        {Object.keys(grupperteDokumenter)
                                            .sort(function (a, b) {
                                                const datoA = grupperteDokumenter[a][0].dato;
                                                const datoB = grupperteDokumenter[b][0].dato;
                                                if (!datoA) {
                                                    return -1;
                                                } else if (!datoB) {
                                                    return 1;
                                                }
                                                return datoA > datoB ? -1 : 1;
                                            })
                                            .filter(
                                                (journalPostId: string) =>
                                                    !dokumentGruppeSkalIkkeVises(
                                                        grupperteDokumenter[journalPostId]
                                                    )
                                            )
                                            .map((journalpostId: string) => {
                                                return grupperteDokumenter[journalpostId].map(
                                                    (dokument: Dokumentinfo, indeks: number) => {
                                                        if (indeks === 0) {
                                                            return (
                                                                <HovedTabellrad
                                                                    key={`${journalpostId}-${indeks}`}
                                                                    erKlikketId={`${journalpostId}-${indeks}`}
                                                                    dokument={dokument}
                                                                />
                                                            );
                                                        } else
                                                            return (
                                                                <Tabellrad
                                                                    key={`${journalpostId}-${indeks}`}
                                                                    erKlikketId={`${journalpostId}-${indeks}`}
                                                                    dokument={dokument}
                                                                />
                                                            );
                                                    }
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </TabellWrapper>
                        </DokumenterVisning>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Dokumenter;
