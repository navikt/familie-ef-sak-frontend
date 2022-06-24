import React, { useEffect, useMemo, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import { AndelEndringType, AndelHistorikk } from '../../App/typer/tilkjentytelse';
import { formaterNullableIsoDatoTid } from '../../App/utils/formatter';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Behandlingstype, behandlingstypeTilTekst } from '../../App/typer/behandlingstype';
import {
    Behandling,
    BehandlingResultat,
    Fagsak,
    IFagsakPerson,
    IFagsakPersonMedBehandlinger,
} from '../../App/typer/fagsak';
import { Checkbox, Select } from 'nav-frontend-skjema';
import { compareDesc } from 'date-fns';
import { Stønadstype } from '../../App/typer/behandlingstema';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import VedtaksperioderBarnetilsyn from './HistorikkVedtaksperioder/VedtaksperioderBarnetilsyn';
import VedtaksperioderOvergangsstønad from './HistorikkVedtaksperioder/VedtaksperioderOvergangsstønad';
import { IVedtakForSkolepenger } from '../../App/typer/vedtak';
import VedtaksperioderSkolepenger from './HistorikkVedtaksperioder/VedtaksperioderSkolepeger';

const StyledInputs = styled.div`
    display: flex;
    justify-content: space-between;

    > div {
        padding: 0.25rem;
    }

    > div:last-child {
        margin-left: auto;
    }
`;

const StønadSelect = styled(Select)`
    width: 12rem;
`;

const BehandlingSelect = styled(Select)`
    width: 22rem;
`;

const erAktuell = (periode: AndelHistorikk) => !skalMarkeresSomFjernet(periode.endring?.type);

const skalMarkeresSomFjernet = (type?: AndelEndringType) =>
    type === AndelEndringType.FJERNET || type === AndelEndringType.ERSTATTET;

const innvilgetEllerOpphørt = (b: Behandling) =>
    b.resultat === BehandlingResultat.INNVILGET || b.resultat === BehandlingResultat.OPPHØRT;

const filtrerBehandlinger = (fagsak: Fagsak): Behandling[] =>
    fagsak.behandlinger.filter(
        (b) =>
            b.type !== Behandlingstype.BLANKETT &&
            innvilgetEllerOpphørt(b) &&
            b.status === BehandlingStatus.FERDIGSTILT
    );

const filtrerOgSorterBehandlinger = (fagsak: Fagsak): Behandling[] =>
    filtrerBehandlinger(fagsak).sort((a, b) =>
        compareDesc(new Date(a.opprettet), new Date(b.opprettet))
    );

interface VedtaksperioderProps {
    fagsak: Fagsak;
    valgtBehandling?: string;
    visUaktuelle: boolean;
}

const VedtaksperioderOSBT: React.FC<VedtaksperioderProps> = ({
    fagsak,
    valgtBehandling,
    visUaktuelle,
}) => {
    const { id: fagsakId } = fagsak;
    const periodeHistorikkConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/perioder/fagsak/${fagsakId}/historikk`,
            params: valgtBehandling && {
                tilOgMedBehandlingId: valgtBehandling,
            },
        }),
        [fagsakId, valgtBehandling]
    );
    const perioder = useDataHenter<AndelHistorikk[], null>(periodeHistorikkConfig);
    return (
        <DataViewer response={{ perioder }}>
            {({ perioder }) => {
                const filtrertePerioder = visUaktuelle ? perioder : perioder.filter(erAktuell);
                switch (fagsak.stønadstype) {
                    case Stønadstype.OVERGANGSSTØNAD:
                        return <VedtaksperioderOvergangsstønad andeler={filtrertePerioder} />;
                    case Stønadstype.BARNETILSYN:
                        return <VedtaksperioderBarnetilsyn andeler={filtrertePerioder} />;
                    default:
                        return <div>Har ikke støtte for {fagsak.stønadstype}</div>;
                }
            }}
        </DataViewer>
    );
};

const VedtaksperioderSP: React.FC<{ valgtBehandling: string }> = ({ valgtBehandling }) => {
    const requestConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedtak/${valgtBehandling}`,
        }),
        [valgtBehandling]
    );
    const vedtak = useDataHenter<IVedtakForSkolepenger, null>(requestConfig);
    return (
        <DataViewer response={{ vedtak }}>
            {({ vedtak }) => <VedtaksperioderSkolepenger vedtak={vedtak} />}
        </DataViewer>
    );
};

const Vedtaksperioder: React.FC<VedtaksperioderProps> = (props) => {
    switch (props.fagsak.stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
        case Stønadstype.BARNETILSYN:
            return <VedtaksperioderOSBT {...props} />;
        case Stønadstype.SKOLEPENGER:
            if (!props.valgtBehandling) {
                return <>Har ikke valgt behandling</>;
            }
            return <VedtaksperioderSP valgtBehandling={props.valgtBehandling} />;
        default:
            return <>Har ikke støtte for {props.fagsak.stønadstype}</>;
    }
};

const VedtaksperioderForFagsakPerson: React.FC<{ fagsakPerson: IFagsakPersonMedBehandlinger }> = ({
    fagsakPerson,
}) => {
    const [valgtFagsak, settValgtFagsak] = useState<Fagsak | undefined>(
        fagsakPerson.overgangsstønad || fagsakPerson.barnetilsyn || fagsakPerson.skolepenger
    );
    const [valgtBehandlingId, settValgtBehandlingId] = useState<string>();
    const [visUaktuelle, settVisUaktuelle] = useState<boolean>(true);

    const behandlinger = useMemo(
        () => (valgtFagsak ? filtrerOgSorterBehandlinger(valgtFagsak) : []),
        [valgtFagsak]
    );

    useEffect(() => {
        settValgtBehandlingId(behandlinger && behandlinger.length ? behandlinger[0].id : undefined);
    }, [behandlinger, valgtFagsak]);

    return (
        <>
            <StyledInputs>
                <StønadSelect
                    label="Stønad"
                    className="flex-item"
                    defaultValue={valgtFagsak?.stønadstype}
                    onChange={(event) => {
                        const valgtStønad = event.target.value as Stønadstype;
                        switch (valgtStønad) {
                            case Stønadstype.OVERGANGSSTØNAD:
                                settValgtFagsak(fagsakPerson.overgangsstønad);
                                return;
                            case Stønadstype.BARNETILSYN:
                                settValgtFagsak(fagsakPerson.barnetilsyn);
                                return;
                            case Stønadstype.SKOLEPENGER:
                                settValgtFagsak(fagsakPerson.skolepenger);
                                return;
                        }
                        settValgtBehandlingId(undefined);
                    }}
                >
                    {!valgtFagsak && <option value={undefined}>Har ingen stønader</option>}
                    <option
                        value={Stønadstype.OVERGANGSSTØNAD}
                        disabled={!fagsakPerson.overgangsstønad?.behandlinger}
                    >
                        Overgangsstønad
                    </option>
                    <option
                        value={Stønadstype.BARNETILSYN}
                        disabled={!fagsakPerson.barnetilsyn?.behandlinger}
                    >
                        Barnetilsyn
                    </option>
                    <option
                        value={Stønadstype.SKOLEPENGER}
                        disabled={!fagsakPerson.skolepenger?.behandlinger}
                    >
                        Skolepenger
                    </option>
                </StønadSelect>
                <BehandlingSelect
                    label="Behandling"
                    className="flex-item"
                    onChange={(event) => {
                        settValgtBehandlingId(event.target.value);
                    }}
                    disabled={!behandlinger.length}
                >
                    {behandlinger.map((b) => (
                        <option key={b.id} value={b.id}>
                            {behandlingstypeTilTekst[b.type]}{' '}
                            {formaterNullableIsoDatoTid(b.opprettet)}
                        </option>
                    ))}
                </BehandlingSelect>
                {valgtFagsak && valgtFagsak.stønadstype !== Stønadstype.SKOLEPENGER ? (
                    <Checkbox
                        label={'Vis uaktuelle perioder'}
                        onChange={() => {
                            settVisUaktuelle((prevState) => !prevState);
                        }}
                        checked={visUaktuelle}
                    />
                ) : (
                    <div />
                )}
            </StyledInputs>
            {valgtFagsak && behandlinger.length > 0 && (
                <Vedtaksperioder
                    fagsak={valgtFagsak}
                    valgtBehandling={valgtBehandlingId}
                    visUaktuelle={visUaktuelle}
                />
            )}
            {valgtFagsak && behandlinger.length === 0 && (
                <div>Har ikke noen innvilgede behandlinger på valgt stønad</div>
            )}
        </>
    );
};

const Vedtaksperioderoversikt: React.FC<{ fagsakPerson: IFagsakPerson }> = ({ fagsakPerson }) => {
    const fagsakPersonConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak-person/${fagsakPerson.id}/utvidet`,
        }),
        [fagsakPerson]
    );
    const fagsakPersonMedBehandlinger = useDataHenter<IFagsakPersonMedBehandlinger, null>(
        fagsakPersonConfig
    );

    return (
        <DataViewer response={{ fagsakPersonMedBehandlinger }}>
            {({ fagsakPersonMedBehandlinger }) => (
                <VedtaksperioderForFagsakPerson fagsakPerson={fagsakPersonMedBehandlinger} />
            )}
        </DataViewer>
    );
};
export default Vedtaksperioderoversikt;
