import React, { useMemo, useState } from 'react';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { TabellWrapper, Td, Th } from '../../Felles/Personopplysninger/TabellWrapper';
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
import { Arkivtema, arkivtemaerAsISelectOptions } from '../../App/typer/arkivtema';
import CustomSelect from '../Oppgavebenk/CustomSelect';
import { dokumenttyperTilTekst } from '../../App/typer/dokumenttype';
import { FlexDiv } from '../Oppgavebenk/OppgaveFiltrering';
import { FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';

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

const ArkivtemaVelger = styled(FamilieReactSelect)`
    width: 15rem;
    margin-top: 1rem;
    margin-right: 1rem;
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
            settVedleggRequest((prevState: VedleggRequest) => ({
                ...prevState,
                [key]: val,
            }));
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

    const dokumentGruppeSkalIkkeVises = (dokumenter: Dokumentinfo[]): boolean => {
        const journalStatuser = [Journalstatus.FEILREGISTRERT, Journalstatus.AVBRUTT];
        return dokumenter.some((dokument) => journalStatuser.includes(dokument.journalstatus));
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
                <BodyShortSmall>
                    {tekstMapping(dokument.journalstatus, journalstatusTilTekst)}
                </BodyShortSmall>
            </Td>
        </TrHoveddokument>
    );

    return (
        <DataViewer response={{ dokumentResponse }}>
            {({ dokumentResponse }) => {
                const grupperteDokumenter = groupBy(dokumentResponse, (i) => i.journalpostId);

                return (
                    <>
                        <FlexDiv>
                            <ArkivtemaVelger
                                placeholder={'Alle'}
                                label={'Velg tema(er)'}
                                options={arkivtemaerAsISelectOptions}
                                creatable={false}
                                isMulti={true}
                                value={(vedleggRequest.tema || []) as unknown as ISelectOption[]}
                                onChange={(valgteTemaer) => {
                                    settVedleggRequest((prevState) => ({
                                        ...prevState,
                                        tema:
                                            valgteTemaer === null
                                                ? []
                                                : ((valgteTemaer as ISelectOption[]).map(
                                                      (option) => option.value
                                                  ) as Arkivtema[]),
                                    }));
                                }}
                            />
                            <CustomSelect
                                onChange={settVedlegg('dokumenttype')}
                                label="Velg dokumenttype"
                                options={dokumenttyperTilTekst}
                                value={vedleggRequest.dokumenttype}
                            />
                            <CustomSelect
                                onChange={settVedlegg('journalpostStatus')}
                                label="Velg journalpoststatus"
                                options={journalstatusTilTekst}
                                value={vedleggRequest.journalpostStatus}
                            />
                        </FlexDiv>
                        <DokumenterVisning>
                            <TabellWrapper>
                                <TabellOverskrift Ikon={Mappe} tittel={'Dokumenter'} />
                                <table className="tabell">
                                    <thead>
                                        <tr>
                                            <Kolonnetittel text={'Dato'} width={12} />
                                            <Kolonnetittel text={'Inn/ut'} width={5} />
                                            <Kolonnetittel text={'Tittel'} width={43} />
                                            <Kolonnetittel text={'Avsender/mottaker'} width={20} />
                                            <Kolonnetittel text={'Status'} width={10} />
                                        </tr>
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
