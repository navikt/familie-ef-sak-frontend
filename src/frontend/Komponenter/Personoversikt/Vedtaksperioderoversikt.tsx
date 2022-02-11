import React, { useMemo, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
    AndelEndringType,
    AndelHistorikk,
    AndelHistorikkEndring,
    AndelHistorikkTypeTilTekst,
} from '../../App/typer/tilkjentytelse';
import {
    formaterIsoDatoTid,
    formaterNullableIsoDatoTid,
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../App/utils/formatter';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import EtikettBase from 'nav-frontend-etiketter';
import { aktivitetTilTekst, EPeriodetype, periodetypeTilTekst } from '../../App/typer/vedtak';
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

const StyledTabell = styled.table`
    margin-top: 2rem;
`;

const StønadSelect = styled(Select)`
    width: 12rem;
`;

const BehandlingSelect = styled(Select)`
    width: 22rem;
`;

const Rad = styled.tr<{ type?: AndelEndringType }>`
    opacity: ${(props) => (skalMarkeresSomFjernet(props.type) ? '50%' : '100%')};
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

const endring = (endring?: AndelHistorikkEndring) =>
    endring && (
        <Link
            className="lenke"
            to={{
                pathname: `/behandling/${endring.behandlingId}`,
            }}
        >
            {AndelHistorikkTypeTilTekst[endring.type]} (
            {formaterIsoDatoTid(endring.vedtakstidspunkt)})
        </Link>
    );

const etikettType = (periodeType: EPeriodetype) => {
    switch (periodeType) {
        case EPeriodetype.HOVEDPERIODE:
            return 'suksess';
        case EPeriodetype.PERIODE_FØR_FØDSEL:
            return 'info';
        case EPeriodetype.UTVIDELSE:
            return 'fokus';
        case EPeriodetype.MIGRERING:
        case EPeriodetype.FORLENGELSE:
            return 'advarsel';
        default:
            return 'info';
    }
};

const historikkRad = (andel: AndelHistorikk) => {
    const erMigrering = andel.periodeType === EPeriodetype.MIGRERING;
    return (
        <Rad type={andel.endring?.type}>
            <td>
                {formaterNullableMånedÅr(andel.andel.stønadFra)}
                {' - '}
                {formaterNullableMånedÅr(andel.andel.stønadTil)}
            </td>
            <td>
                <EtikettBase mini type={etikettType(andel.periodeType)}>
                    {periodetypeTilTekst[andel.periodeType]}
                </EtikettBase>
            </td>
            <td>{aktivitetTilTekst[andel.aktivitet]}</td>
            <td>{formaterTallMedTusenSkille(andel.andel.inntekt)}</td>
            <td>{formaterTallMedTusenSkille(andel.andel.samordningsfradrag)}</td>
            <td>{formaterTallMedTusenSkille(andel.andel.beløp)}</td>
            <td>{formaterIsoDatoTid(andel.vedtakstidspunkt)}</td>
            <td>{andel.saksbehandler}</td>
            <td>
                <Link className="lenke" to={{ pathname: `/behandling/${andel.behandlingId}` }}>
                    {erMigrering ? 'Migrering' : behandlingstypeTilTekst[andel.behandlingType]}
                </Link>
            </td>
            <td>{endring(andel.endring)}</td>
        </Rad>
    );
};

const VedtaksperioderTabell: React.FC<{ andeler: AndelHistorikk[] }> = ({ andeler }) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Periodetype</th>
                    <th>Aktivitet</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Samordningsfradrag</th>
                    <th>Stønadsbeløp</th>
                    <th>Vedtakstidspunkt</th>
                    <th>Saksbehandler</th>
                    <th>Behandlingstype</th>
                    <th>Endring</th>
                </tr>
            </thead>
            <tbody>{andeler.map((periode) => historikkRad(periode))}</tbody>
        </StyledTabell>
    );
};

const Vedtaksperioder: React.FC<{
    fagsakId: string;
    perioderTilOgMedBehandlingId?: string;
    visUaktuelle: boolean;
}> = ({ fagsakId, perioderTilOgMedBehandlingId, visUaktuelle }) => {
    const periodeHistorikkConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/perioder/fagsak/${fagsakId}/historikk`,
            params: perioderTilOgMedBehandlingId && {
                tilOgMedBehandlingId: perioderTilOgMedBehandlingId,
            },
        }),
        [fagsakId, perioderTilOgMedBehandlingId]
    );
    const perioder = useDataHenter<AndelHistorikk[], null>(periodeHistorikkConfig);
    return (
        <DataViewer response={{ perioder }}>
            {({ perioder }) => {
                const filtrertePerioder = visUaktuelle ? perioder : perioder.filter(erAktuell);
                return <VedtaksperioderTabell andeler={filtrertePerioder} />;
            }}
        </DataViewer>
    );
};

const VedtaksperioderForFagsakPerson: React.FC<{ fagsakPerson: IFagsakPersonMedBehandlinger }> = ({
    fagsakPerson,
}) => {
    const [valgtFagsak, settValgtFagsak] = useState<Fagsak | undefined>(
        fagsakPerson.overgangsstønad || fagsakPerson.barnetilsyn || fagsakPerson.barnetilsyn
    );
    const [valgtBehandlingId, settValgtBehandlingId] = useState<string>();
    const [visUaktuelle, settVisUaktuelle] = useState<boolean>(true);

    const behandlinger = valgtFagsak ? filtrerOgSorterBehandlinger(valgtFagsak) : [];

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
                        const nyesteBehandling = behandlinger[0].id;
                        const nyBehandlingId = event.target.value;
                        const skalNullstille = nyBehandlingId === nyesteBehandling;
                        settValgtBehandlingId(skalNullstille ? undefined : nyBehandlingId);
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
                <Checkbox
                    label={'Vis uaktuelle perioder'}
                    onClick={() => {
                        settVisUaktuelle((prevState) => !prevState);
                    }}
                    checked={visUaktuelle}
                />
            </StyledInputs>
            {valgtFagsak && behandlinger.length > 0 && (
                <Vedtaksperioder
                    fagsakId={valgtFagsak.id}
                    perioderTilOgMedBehandlingId={valgtBehandlingId}
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
