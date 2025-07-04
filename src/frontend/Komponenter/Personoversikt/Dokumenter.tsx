import React, { useEffect, useState } from 'react';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { Dokumentinfo, erFeilregistrertEllerAvbrutt } from '../../App/typer/dokument';
import { groupBy } from '../../App/utils/utils';
import {
    gyldigeJournalstatuserTilTekst,
    journalposttypeTilTekst,
} from '../../App/typer/journalføring';
import { VedleggRequest } from './vedleggRequest';
import { Arkivtema, arkivtemaerMedENFFørst, arkivtemaerTilTekst } from '../../App/typer/arkivtema';
import CustomSelect from '../Oppgavebenk/CustomSelect';
import { FamilieReactSelect, MultiValue, SingleValue } from '@navikt/familie-form-elements';
import { oppdaterVedleggFilter } from './utils';
import { Checkbox, Label, Table } from '@navikt/ds-react';
import { HovedTabellrad } from './Dokumentoversikt/Hovedtabellrad';
import { Tabellrad } from './Dokumentoversikt/Tabellrad';
import { KolonneTitler } from '../../Felles/Personopplysninger/TabellWrapper';
import { EndreDokumenttittelModal } from './Dokumentoversikt/EndreDokumenttittelModal';
import { useHentDokumenter } from '../../App/hooks/useHentDokumenter';
import {
    hentBesøkteLenkerFraLocalStorage,
    lagreBesøkteLenkerTilLocalStorage,
    slettForeldedeInnslagFraLocalStorage,
} from './Dokumentoversikt/utils';

const FiltreringGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content) auto;
    row-gap: 0.5rem;
    column-gap: 3rem;
    align-items: start;

    .checkboks {
        justify-self: end;
    }

    .ny-rad {
        grid-column: 1;
    }
`;

const ArkivtemaVelger = styled(FamilieReactSelect)`
    width: 25rem;

    .react-select__control {
        min-height: 3rem;
    }
`;

const Container = styled.div`
    gap: 1rem;
    display: flex;
    flex-direction: column;

    .tabell {
        .columnHeader {
            font-weight: bold;
        }

        th,
        td {
            padding: 0.35rem;
        }

        table-layout: fixed;
    }
`;

export const Dokumenter: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const [vedleggRequest, settVedleggRequest] = useState<VedleggRequest>({
        fagsakPersonId: fagsakPersonId,
    });
    const { dokumenter, hentDokumenterCallback } = useHentDokumenter();
    const [valgtDokumentId, settValgtDokumentId] = useState<string>('');
    const [besøkteDokumentLenker, settbesøkteDokumentLenker] = useState<string[]>(
        hentBesøkteLenkerFraLocalStorage(fagsakPersonId)
    );

    useEffect(() => {
        slettForeldedeInnslagFraLocalStorage();
        hentDokumenterCallback(vedleggRequest);
    }, [hentDokumenterCallback, vedleggRequest]);

    const oppdaterBesøkteDokumentLenker = (journalpostId: string) => {
        if (besøkteDokumentLenker.includes(journalpostId)) {
            return;
        }

        lagreBesøkteLenkerTilLocalStorage(fagsakPersonId, [
            ...besøkteDokumentLenker,
            journalpostId,
        ]);
        settbesøkteDokumentLenker(hentBesøkteLenkerFraLocalStorage(fagsakPersonId));
    };

    const settVedlegg = (key: keyof VedleggRequest) => {
        return (val?: string | number) =>
            settVedleggRequest((prevState: VedleggRequest) =>
                oppdaterVedleggFilter(prevState, key, val)
            );
    };

    const reHentDokumenter = () => {
        hentDokumenterCallback(vedleggRequest);
    };

    const [visFeilregistrerteOgAvbruttValgt, setVisFeilregistrerteOgAvbruttValgt] =
        React.useState(false);

    const toggleVisFeilregistrerteOgAvbrutt = () => {
        setVisFeilregistrerteOgAvbruttValgt(!visFeilregistrerteOgAvbruttValgt);
        settVedlegg('journalpostStatus')('');
    };

    const skalViseDokumentGruppe = (dokumenter: Dokumentinfo[]): boolean => {
        const harFeilregistrerteEllerAvbrutte = dokumenter.some((dokument) =>
            erFeilregistrertEllerAvbrutt(dokument)
        );

        return visFeilregistrerteOgAvbruttValgt
            ? harFeilregistrerteEllerAvbrutte
            : !harFeilregistrerteEllerAvbrutte;
    };

    const håndterOppdaterJournalpoststatus = (verdi: string) => {
        setVisFeilregistrerteOgAvbruttValgt(false);
        settVedlegg('journalpostStatus')(verdi);
    };

    const titler = [
        'Dato',
        'Inn/ut',
        'Tema',
        'Avsender/mottaker',
        'Tittel',
        'Status',
        'Distribusjon',
    ];

    return (
        <Container>
            <FiltreringGrid>
                <Label>Velg tema(er)</Label>
                <Label>Velg dokumenttype</Label>
                <Label>Velg journalpoststatus</Label>
                <div className={'ny-rad'}>
                    <ArkivtemaVelger
                        placeholder={'Alle'}
                        label={''}
                        options={arkivtemaerMedENFFørst}
                        creatable={false}
                        isMulti={true}
                        classNamePrefix={'react-select'}
                        value={
                            vedleggRequest.tema?.map((tema) => ({
                                value: tema,
                                label: arkivtemaerTilTekst[tema],
                            })) || []
                        }
                        onChange={(valgteTemaer) => {
                            const erMultiValue = <T,>(
                                verdi: MultiValue<T> | SingleValue<T> | null
                            ): verdi is MultiValue<T> => Array.isArray(verdi);

                            const temaer = erMultiValue(valgteTemaer)
                                ? valgteTemaer.map((tema) => tema.value as Arkivtema)
                                : [valgteTemaer?.value as Arkivtema];

                            settVedleggRequest((prevState) => ({
                                ...prevState,
                                tema: temaer,
                            }));
                        }}
                    />
                </div>
                <CustomSelect
                    onChange={settVedlegg('dokumenttype')}
                    options={journalposttypeTilTekst}
                    label={'Velg dokumenttyope'}
                    hideLabel={true}
                    value={vedleggRequest.dokumenttype}
                    size={'medium'}
                />
                <CustomSelect
                    onChange={håndterOppdaterJournalpoststatus}
                    options={gyldigeJournalstatuserTilTekst}
                    label={'Velg journalpoststatus'}
                    hideLabel={true}
                    value={vedleggRequest.journalpostStatus}
                    size={'medium'}
                />
                <Checkbox
                    className={'checkboks'}
                    onChange={toggleVisFeilregistrerteOgAvbrutt}
                    checked={visFeilregistrerteOgAvbruttValgt}
                >
                    Vis feilregistrerte/avbrutte
                </Checkbox>
            </FiltreringGrid>

            <DataViewer response={{ dokumenter }}>
                {({ dokumenter }) => {
                    const grupperteDokumenter = groupBy(dokumenter, (i) => i.journalpostId);
                    const valgtDokument = dokumenter.find(
                        (dokument) => dokument.dokumentinfoId === valgtDokumentId
                    );
                    return (
                        <>
                            <Table size="small">
                                <KolonneTitler
                                    titler={titler}
                                    skalHaMinimumBreddePåKolonne={true}
                                />
                                <Table.Body>
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
                                        .filter((journalPostId: string) =>
                                            skalViseDokumentGruppe(
                                                grupperteDokumenter[journalPostId]
                                            )
                                        )
                                        .map((journalpostId: string) => {
                                            return grupperteDokumenter[journalpostId].map(
                                                (dokument: Dokumentinfo, indeks: number) => {
                                                    const dokumentHarBlittBesøkt =
                                                        besøkteDokumentLenker.includes(
                                                            dokument.dokumentinfoId
                                                        );

                                                    if (indeks === 0) {
                                                        return (
                                                            <HovedTabellrad
                                                                key={`${journalpostId}-${dokument.dokumentinfoId}`}
                                                                dokument={dokument}
                                                                settValgtDokumentId={
                                                                    settValgtDokumentId
                                                                }
                                                                dokumentHarBlittBesøkt={
                                                                    dokumentHarBlittBesøkt
                                                                }
                                                                oppdaterBesøkteDokumentLenker={() =>
                                                                    oppdaterBesøkteDokumentLenker(
                                                                        dokument.dokumentinfoId
                                                                    )
                                                                }
                                                            />
                                                        );
                                                    } else
                                                        return (
                                                            <Tabellrad
                                                                key={`${journalpostId}-${dokument.dokumentinfoId}`}
                                                                dokument={dokument}
                                                                settValgtDokumentId={
                                                                    settValgtDokumentId
                                                                }
                                                                dokumentHarBlittBesøkt={
                                                                    dokumentHarBlittBesøkt
                                                                }
                                                                oppdaterBesøkteDokumentLenker={() =>
                                                                    oppdaterBesøkteDokumentLenker(
                                                                        dokument.dokumentinfoId
                                                                    )
                                                                }
                                                            />
                                                        );
                                                }
                                            );
                                        })}
                                </Table.Body>
                            </Table>
                            {valgtDokument && (
                                <EndreDokumenttittelModal
                                    dokument={valgtDokument}
                                    settValgtDokumentId={settValgtDokumentId}
                                    hentDokumenter={reHentDokumenter}
                                />
                            )}
                        </>
                    );
                }}
            </DataViewer>
        </Container>
    );
};
