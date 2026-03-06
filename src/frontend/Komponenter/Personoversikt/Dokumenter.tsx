import React, { useEffect, useState } from 'react';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Dokumentinfo, erFeilregistrertEllerAvbrutt } from '../../App/typer/dokument';
import { groupBy } from '../../App/utils/utils';
import {
    gyldigeJournalstatuserTilTekst,
    journalposttypeTilTekst,
} from '../../App/typer/journalføring';
import { VedleggRequest } from './vedleggRequest';
import { Arkivtema, arkivtemaerMedENFFørst } from '../../App/typer/arkivtema';
import CustomSelect from '../Oppgavebenk/CustomSelect';
import { oppdaterVedleggFilter } from './utils';
import { Checkbox, HStack, Table, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
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

export const Dokumenter: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const [vedleggRequest, settVedleggRequest] = useState<VedleggRequest>({
        fagsakPersonId: fagsakPersonId,
    });
    const { dokumenter, hentDokumenterCallback } = useHentDokumenter();
    const [valgtDokumentId, settValgtDokumentId] = useState<string>('');
    const [besøkteDokumentLenker, settbesøkteDokumentLenker] = useState<string[]>(
        hentBesøkteLenkerFraLocalStorage(fagsakPersonId)
    );
    const [temaSøk, settTemaSøk] = useState<string>('');

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
        return (val?: string | number | Arkivtema[]) =>
            settVedleggRequest((prevState: VedleggRequest) =>
                oppdaterVedleggFilter(prevState, key, val)
            );
    };

    const håndterOppdaterTema = (option: string, isSelected: boolean) => {
        const eksisterendeTema = vedleggRequest.tema ?? [];
        const oppdaterteTema = isSelected
            ? Array.from(new Set([...eksisterendeTema, option as Arkivtema]))
            : eksisterendeTema.filter((tema) => tema !== option);

        settVedlegg('tema')(oppdaterteTema);
        settTemaSøk('');
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
        <VStack gap="space-32">
            <HStack justify="space-between" style={{ width: '100%' }}>
                <HStack gap="space-32">
                    <div style={{ width: '25rem' }}>
                        <UNSAFE_Combobox
                            label="Velg tema(er)"
                            options={arkivtemaerMedENFFørst}
                            isMultiSelect
                            selectedOptions={vedleggRequest.tema ?? []}
                            onToggleSelected={håndterOppdaterTema}
                            value={temaSøk}
                            onChange={settTemaSøk}
                        />
                    </div>

                    <CustomSelect
                        onChange={settVedlegg('dokumenttype')}
                        options={journalposttypeTilTekst}
                        label={'Velg dokumenttype'}
                        value={vedleggRequest.dokumenttype}
                        size={'medium'}
                    />
                    <CustomSelect
                        onChange={håndterOppdaterJournalpoststatus}
                        options={gyldigeJournalstatuserTilTekst}
                        label={'Velg journalpoststatus'}
                        value={vedleggRequest.journalpostStatus}
                        size={'medium'}
                    />
                </HStack>

                <Checkbox
                    className={'checkboks'}
                    onChange={toggleVisFeilregistrerteOgAvbrutt}
                    checked={visFeilregistrerteOgAvbruttValgt}
                >
                    Vis feilregistrerte/avbrutte
                </Checkbox>
            </HStack>

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
        </VStack>
    );
};
