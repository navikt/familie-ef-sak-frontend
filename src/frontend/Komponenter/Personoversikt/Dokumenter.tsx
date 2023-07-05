import React, { useMemo, useState } from 'react';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import Mappe from '../../Felles/Ikoner/Mappe';
import TabellOverskrift from '../../Felles/Personopplysninger/TabellOverskrift';
import { Dokumentinfo } from '../../App/typer/dokumentliste';
import { groupBy } from '../../App/utils/utils';
import { IFagsakPerson } from '../../App/typer/fagsak';
import { Journalstatus } from '@navikt/familie-typer';

import {
    gyldigeJournalstatuserTilTekst,
    journalposttypeTilTekst,
} from '../../App/typer/journalføring';
import { VedleggRequest } from './vedleggRequest';
import {
    Arkivtema,
    arkivtemaerAsISelectOptions,
    arkivtemaerTilTekst,
} from '../../App/typer/arkivtema';
import CustomSelect from '../Oppgavebenk/CustomSelect';
import { FlexDiv } from '../Oppgavebenk/OppgaveFiltrering';
import { FamilieReactSelect, MultiValue, SingleValue } from '@navikt/familie-form-elements';
import { oppdaterVedleggFilter } from './utils';
import { Checkbox } from '@navikt/ds-react';
import { Kolonnetittel } from './Dokumentoversikt/Kolonnetittel';
import { HovedTabellrad } from './Dokumentoversikt/Hovedtabellrad';
import { Tabellrad } from './Dokumentoversikt/Tabellrad';

const DokumenterVisning = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 5rem;
`;

const ArkivtemaVelger = styled(FamilieReactSelect)`
    width: 25rem;
    margin: 0.5rem 1rem 0 0;

    .react-select__control {
        min-height: 3rem;
    }
`;

const Dokumenttabell = styled.div`
    display: grid;
    padding-top: 1rem;
    grid-template-columns: 32px 40px auto 72px;
    grid-template-rows: repeat(2, max-content);
    grid-template-areas: '. ikon tittel .' '. . select  .' '. . innhold .';
    gap: 1.5rem;

    .tabell {
        .columnHeader {
            font-weight: bold;
        }
        grid-area: innhold;
        th,
        td {
            padding: 0.25rem;
            padding-left: 0;
        }
        table-layout: fixed;
    }
    .første-tabell {
        grid-area: første-tabell;
    }

    .select-area {
        grid-area: select;
    }
`;

const FilterRad = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: end;
`;

/**
 * Genererer en string av typen `<navn> (<type>: <id>)`
 */

const Dokumenter: React.FC<{ fagsakPerson: IFagsakPerson }> = ({ fagsakPerson }) => {
    const [vedleggRequest, settVedleggRequest] = useState<VedleggRequest>({
        fagsakPersonId: fagsakPerson.id,
    });

    const settVedlegg = (key: keyof VedleggRequest) => {
        return (val?: string | number) =>
            settVedleggRequest((prevState: VedleggRequest) =>
                oppdaterVedleggFilter(prevState, key, val)
            );
    };

    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/vedlegg/fagsak-person`,
            data: vedleggRequest,
        }),
        [vedleggRequest]
    );

    const dokumentResponse = useDataHenter<Dokumentinfo[], null>(dokumentConfig);
    const [visFeilregistrerteOgAvbruttValgt, setVisFeilregistrerteOgAvbruttValgt] =
        React.useState(false);

    const toggleVisFeilregistrerteOgAvbrutt = () => {
        setVisFeilregistrerteOgAvbruttValgt(!visFeilregistrerteOgAvbruttValgt);
    };

    const dokumentGruppeSkalVises = (dokumenter: Dokumentinfo[]): boolean => {
        const harFeilregistrerteEllerAvbrutte = dokumenter.some((dokument) =>
            [Journalstatus.FEILREGISTRERT, Journalstatus.AVBRUTT].includes(dokument.journalstatus)
        );

        return visFeilregistrerteOgAvbruttValgt
            ? harFeilregistrerteEllerAvbrutte
            : !harFeilregistrerteEllerAvbrutte;
    };

    return (
        <DokumenterVisning>
            <Dokumenttabell>
                <TabellOverskrift Ikon={Mappe} tittel={'Dokumenter'} />
                <FilterRad className={'select-area'}>
                    <FlexDiv>
                        <ArkivtemaVelger
                            placeholder={'Alle'}
                            label={'Velg tema(er)'}
                            options={arkivtemaerAsISelectOptions}
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
                        <CustomSelect
                            onChange={settVedlegg('dokumenttype')}
                            label="Velg dokumenttype"
                            options={journalposttypeTilTekst}
                            value={vedleggRequest.dokumenttype}
                            size={'medium'}
                        />
                        <CustomSelect
                            onChange={settVedlegg('journalpostStatus')}
                            label="Velg journalpoststatus"
                            options={gyldigeJournalstatuserTilTekst}
                            value={vedleggRequest.journalpostStatus}
                            size={'medium'}
                        />
                    </FlexDiv>
                    <Checkbox
                        onChange={toggleVisFeilregistrerteOgAvbrutt}
                        checked={visFeilregistrerteOgAvbruttValgt}
                    >
                        Vis feilregistrerte/avbrutte
                    </Checkbox>
                </FilterRad>
                <table className="tabell">
                    <thead>
                        <tr>
                            <Kolonnetittel text={'Dato'} width={12} />
                            <Kolonnetittel text={'Inn/ut'} width={5} />
                            <Kolonnetittel text={'Tittel'} width={43} />
                            <Kolonnetittel text={'Avsender/mottaker'} width={20} />
                            <Kolonnetittel text={'Tema'} width={20} />
                            <Kolonnetittel text={'Status'} width={10} />
                            <Kolonnetittel text={'Distribusjon'} width={10} />
                        </tr>
                    </thead>
                    <DataViewer response={{ dokumentResponse }}>
                        {({ dokumentResponse }) => {
                            const grupperteDokumenter = groupBy(
                                dokumentResponse,
                                (i) => i.journalpostId
                            );
                            return (
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
                                        .filter((journalPostId: string) =>
                                            dokumentGruppeSkalVises(
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
                            );
                        }}
                    </DataViewer>
                </table>
            </Dokumenttabell>
        </DokumenterVisning>
    );
};

export default Dokumenter;
