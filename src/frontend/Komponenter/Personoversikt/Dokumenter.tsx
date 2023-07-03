import React, { useMemo, useState } from 'react';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { Td, Th } from '../../Felles/Personopplysninger/TabellWrapper';
import Mappe from '../../Felles/Ikoner/Mappe';
import TabellOverskrift from '../../Felles/Personopplysninger/TabellOverskrift';
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
import { BodyShortSmall, SmallTextLabel } from '../../Felles/Visningskomponenter/Tekster';
import { VedleggRequest } from './vedleggRequest';
import {
    Arkivtema,
    arkivtemaerAsISelectOptions,
    arkivtemaerTilTekst,
} from '../../App/typer/arkivtema';
import CustomSelect from '../Oppgavebenk/CustomSelect';
import { dokumenttyperTilTekst } from '../../App/typer/dokumenttype';
import { FlexDiv } from '../Oppgavebenk/OppgaveFiltrering';
import { FamilieReactSelect, MultiValue, SingleValue } from '@navikt/familie-form-elements';
import { oppdaterVedleggFilter } from './utils';
import { Utsendingsinfo } from './Utsendingsinfo';
import { Checkbox } from '@navikt/ds-react';
import { ToggleName } from '../../App/context/toggles';
import { useToggles } from '../../App/context/TogglesContext';

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

const CheckboxHøyre = styled(Checkbox)`
    float: right;
`;

const ArkivtemaVelger = styled(FamilieReactSelect)`
    width: 15rem;
    height: 1.5rem;
    margin-top: 1rem;
    margin-right: 1rem;
`;

const Dokumenttabell = styled.div`
    display: grid;
    padding-top: 1rem;
    grid-template-columns: 32px 40px auto 72px;
    grid-template-rows: repeat(2, max-content);
    grid-template-areas: '. ikon tittel .' '. . select  select' '. . innhold .';
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

/**
 * Genererer en string av typen `<navn> (<type>: <id>)`
 */
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

const ikoneForJournalposttype: Record<Journalposttype, React.ReactElement> = {
    I: <LeftFilled />,
    N: <DownFilled />,
    U: <RightFilled />,
};

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
    const { toggles } = useToggles();
    const [visFeilregistrerteOgAvbruttValgt, setVisFeilregistrerteOgAvbruttValgt] =
        React.useState(false);

    const visFeilregistrerteOgAvbrutt = () => {
        setVisFeilregistrerteOgAvbruttValgt(!visFeilregistrerteOgAvbruttValgt);
    };

    const dokumentGruppeSkalVises = (dokumenter: Dokumentinfo[]): boolean => {
        const journalStatuser = [Journalstatus.FEILREGISTRERT, Journalstatus.AVBRUTT];
        const defaultVisJournalstatuser = [
            Journalstatus.MOTTATT,
            Journalstatus.JOURNALFOERT,
            Journalstatus.FERDIGSTILT,
            Journalstatus.EKSPEDERT,
            Journalstatus.UNDER_ARBEID,
            Journalstatus.UTGAAR,
            Journalstatus.UKJENT_BRUKER,
            Journalstatus.RESERVERT,
            Journalstatus.OPPLASTING_DOKUMENT,
            Journalstatus.UKJENT,
        ];
        if (visFeilregistrerteOgAvbruttValgt) {
            return dokumenter.some((dokument) => journalStatuser.includes(dokument.journalstatus));
        } else {
            return dokumenter.some((dokument) =>
                defaultVisJournalstatuser.includes(dokument.journalstatus)
            );
        }
    };

    const Kolonnetittel: React.FC<{ text: string; width: number }> = ({ text, width }) => (
        <Th width={`${width}%`}>
            <SmallTextLabel>{text}</SmallTextLabel>
        </Th>
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
                {toggles[ToggleName.dokumentoversiktLinkTilDokument] &&
                    dokument.harSaksbehandlerTilgang && (
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
                    )}
                {(!toggles[ToggleName.dokumentoversiktLinkTilDokument] ||
                    !dokument.harSaksbehandlerTilgang) && (
                    <BodyShortSmall>{dokument.tittel}</BodyShortSmall>
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

    return (
        <DokumenterVisning>
            <Dokumenttabell>
                <TabellOverskrift Ikon={Mappe} tittel={'Dokumenter'} />
                <FlexDiv className={'select-area'}>
                    <ArkivtemaVelger
                        placeholder={'Alle'}
                        label={'Velg tema(er)'}
                        options={arkivtemaerAsISelectOptions}
                        creatable={false}
                        isMulti={true}
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
                        options={dokumenttyperTilTekst}
                        value={vedleggRequest.dokumenttype}
                        size={'small'}
                    />
                    <CustomSelect
                        onChange={settVedlegg('journalpostStatus')}
                        label="Velg journalpoststatus"
                        options={journalstatusTilTekst}
                        value={vedleggRequest.journalpostStatus}
                        size={'small'}
                    />
                    <CheckboxHøyre
                        onChange={visFeilregistrerteOgAvbrutt}
                        checked={visFeilregistrerteOgAvbruttValgt}
                    >
                        Vis feilregistrerte/avbrutte
                    </CheckboxHøyre>
                </FlexDiv>
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
