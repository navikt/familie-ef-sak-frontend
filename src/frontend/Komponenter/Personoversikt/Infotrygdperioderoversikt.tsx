import React, { useMemo, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import {
    formaterNullableIsoDato,
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../App/utils/formatter';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Checkbox } from 'nav-frontend-skjema';
import {
    aktivitetstypeTilTekst,
    InfotrygdPeriode,
    InfotrygdPerioderResponse,
    kodeTilTekst,
    overgangsstønadKodeTilTekst,
    Perioder,
    sakstypeTilTekst,
    SummertPeriode,
} from '../../App/typer/infotrygd';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { byggTomRessurs, Ressurs } from '../../App/typer/ressurs';
import { MigreringInfo } from '../../App/typer/migrering';
import { useApp } from '../../App/context/AppContext';

const StyledTabell = styled.table`
    margin-top: 2rem;
`;

const Rad = styled.tr``;

const StyledAlertStripe = styled(AlertStripeInfo)`
    margin: 1rem 0;
    max-width: 51rem;
    .alertstripe__tekst {
        max-width: 51rem;
    }
`;

const SummertePerioder: React.FC<{ perioder: SummertPeriode[] }> = ({ perioder }) => {
    if (perioder.length === 0) {
        return <>Ingen vedtaksperioder i Infotrygd</>;
    }
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Samordningsfradrag</th>
                    <th>Stønadsbeløp</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formaterNullableMånedÅr(periode.stønadTom)}
                        </td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsreduksjon)}</td>
                        <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.beløp)}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const InfotrygdPerioder: React.FC<{ perioder: InfotrygdPeriode[] }> = ({ perioder }) => {
    if (perioder.length === 0) {
        return <>Ingen vedtaksperioder i Infotrygd</>;
    }
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>VedtakId</th>
                    <th>Periode (fom-tom)</th>
                    <th>Opphørsdato</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Samordningsfradrag</th>
                    <th>Stønadsbeløp</th>
                    <th>Vedtakstidspunkt</th>
                    <th>Kode</th>
                    <th>Sakstype</th>
                    <th>Aktivitet</th>
                    <th>Periodetype</th>
                    <th>Saksbehandler</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad>
                        <td>{periode.vedtakId}</td>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formaterNullableMånedÅr(periode.stønadTom)}
                        </td>
                        <td>{formaterNullableMånedÅr(periode.opphørsdato)}</td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsgrunnlag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.beløp)}</td>
                        <td>{formaterNullableIsoDato(periode.vedtakstidspunkt)}</td>
                        <td>{kodeTilTekst[periode.kode]}</td>
                        <td>{sakstypeTilTekst[periode.sakstype]}</td>
                        <td>
                            {periode.aktivitetstype &&
                                aktivitetstypeTilTekst[periode.aktivitetstype]}
                        </td>
                        <td>
                            {periode.kodeOvergangsstønad &&
                                overgangsstønadKodeTilTekst[periode.kodeOvergangsstønad]}
                        </td>
                        <td>{periode.brukerId}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const InfotrygdEllerSummertePerioder: React.FC<{ perioder: InfotrygdPerioderResponse }> = ({
    perioder,
}) => {
    const [visSummert, settVisSummert] = useState<boolean>(false);

    const visPerioder = (visSummert: boolean, perioder: Perioder) => {
        return visSummert ? (
            <SummertePerioder perioder={perioder.summert} />
        ) : (
            <InfotrygdPerioder perioder={perioder.perioder} />
        );
    };

    const skalViseCheckbox =
        perioder.overgangsstønad.perioder.length > 0 ||
        perioder.barnetilsyn.perioder.length > 0 ||
        perioder.skolepenger.perioder.length > 0;

    return (
        <>
            <StyledAlertStripe>
                Denne siden viser vedtakshistorikk fra EV VP. (Saker før desember 2008 - PE PP må
                sjekkes manuelt i Infotrygd)
            </StyledAlertStripe>
            {skalViseCheckbox && (
                <Checkbox
                    label={'Vis summerte perioder'}
                    onClick={() => {
                        settVisSummert((prevState) => !prevState);
                    }}
                    checked={visSummert}
                />
            )}
            <h1>Overgangsstønad</h1>
            {visPerioder(visSummert, perioder.overgangsstønad)}

            <h1>Barnetilsyn</h1>
            {visPerioder(visSummert, perioder.barnetilsyn)}

            <h1>Skolepenger</h1>
            {visPerioder(visSummert, perioder.skolepenger)}
        </>
    );
};

const MigrerFagsak: React.FC<{ fagsakId: string }> = ({ fagsakId }) => {
    const { axiosRequest } = useApp();
    const [migreringInfo, settMigreringInfo] = useState<Ressurs<MigreringInfo>>(byggTomRessurs());

    const hentMigreringConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/migrering/${fagsakId}`,
        }),
        [fagsakId]
    );

    const migrerFagsakConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/migrering/${fagsakId}`,
        }),
        [fagsakId]
    );

    const hentMigreringInfo = () =>
        axiosRequest<MigreringInfo, null>(hentMigreringConfig).then((res: Ressurs<MigreringInfo>) =>
            settMigreringInfo(res)
        );

    const migrerFagsak = () => axiosRequest<null, void>(migrerFagsakConfig);

    return (
        <>
            <Knapp onClick={hentMigreringInfo}>Hent info</Knapp>
            <DataViewer response={{ migreringInfo }}>
                {({ migreringInfo }) => (
                    <>
                        {migreringInfo.stønadFom && (
                            <div>
                                Stønad fom: {formaterNullableMånedÅr(migreringInfo.stønadFom)}
                            </div>
                        )}
                        {migreringInfo.stønadTom && (
                            <div>
                                Stønad tom: {formaterNullableMånedÅr(migreringInfo.stønadTom)}
                            </div>
                        )}
                        {migreringInfo.beløp && (
                            <div>
                                Stønadsbeløp: {formaterTallMedTusenSkille(migreringInfo.beløp)}
                            </div>
                        )}
                        {migreringInfo.inntektsgrunnlag && (
                            <div>
                                Inntektsgrunnlag:{' '}
                                {formaterTallMedTusenSkille(migreringInfo.inntektsgrunnlag)}
                            </div>
                        )}
                        <div>Kan migreres: {migreringInfo.kanMigreres}</div>
                        <div>Årsak: {migreringInfo.årsak}</div>
                        <Knapp onClick={migrerFagsak} disabled={!migreringInfo.kanMigreres}>
                            Migrer fagsak
                        </Knapp>
                    </>
                )}
            </DataViewer>
        </>
    );
};

const Infotrygdperioderoversikt: React.FC<{
    fagsakId: string;
    personIdent: string;
}> = ({ fagsakId, personIdent }) => {
    const infotrygdPerioderConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/infotrygd/perioder`,
            data: {
                personIdent,
            },
        }),
        [personIdent]
    );
    const infotrygdPerioder = useDataHenter<InfotrygdPerioderResponse, null>(
        infotrygdPerioderConfig
    );
    return (
        <DataViewer response={{ infotrygdPerioder }}>
            {({ infotrygdPerioder }) => (
                <>
                    <MigrerFagsak fagsakId={fagsakId} />
                    <InfotrygdEllerSummertePerioder perioder={infotrygdPerioder} />
                </>
            )}
        </DataViewer>
    );
};

export default Infotrygdperioderoversikt;
