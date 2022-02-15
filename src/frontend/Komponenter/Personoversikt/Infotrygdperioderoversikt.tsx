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
    Kode,
    kodeTilTekst,
    overgangsstønadKodeTilTekst,
    Perioder,
    sakstypeTilTekst,
    SummertPeriode,
} from '../../App/typer/infotrygd';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import MigrerFagsak from '../Migrering/MigrerFagsak';
import InfotrygdSaker from '../Migrering/InfotrygdSaker';
import { IFagsakPerson } from '../../App/typer/fagsak';
import { InfotrygdPeriodeMedFlereEndringer } from '../Infotrygd/typer';
import { slåSammenOgSorterPerioder } from '../Infotrygd/grupperInfotrygdperiode';

const StyledTabell = styled.table``;

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
                    <th>Inntektsreduksjon</th>
                    <th>Samordningsfradrag</th>
                    <th>Stønadsbeløp</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad key={periode.stønadFom}>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formaterNullableMånedÅr(periode.stønadTom)}
                        </td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsgrunnlag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsreduksjon)}</td>
                        <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.beløp)}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const formatStønadTom = (periode: InfotrygdPeriodeMedFlereEndringer): string => {
    const stønadTom = formaterNullableMånedÅr(periode.stønadTom) as string;
    if (periode.kode === Kode.OPPHØRT || periode.kode === Kode.OVERTFØRT_NY_LØSNING) {
        return `${formaterNullableMånedÅr(periode.opphørsdato)} (${stønadTom})`;
    } else {
        return stønadTom;
    }
};

const InfotrygdPerioder: React.FC<{ perioder: InfotrygdPeriode[] }> = ({ perioder }) => {
    if (perioder.length === 0) {
        return <>Ingen vedtaksperioder i Infotrygd</>;
    }
    const sammenslåttePerioder = slåSammenOgSorterPerioder(perioder);
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>VedtakId</th>
                    <th>Periode (fom-tom)</th>
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
                {sammenslåttePerioder.map((periode) => (
                    <Rad key={`${periode.stønadId}-${periode.vedtakId}`}>
                        <td>{periode.vedtakId}</td>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formatStønadTom(periode)}
                        </td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsgrunnlag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.beløp)}</td>
                        <td>{formaterNullableIsoDato(periode.vedtakstidspunkt)}</td>
                        <td>
                            {kodeTilTekst[periode.kode]}{' '}
                            {periode.initiellKode && `(${kodeTilTekst[periode.initiellKode]})`}
                        </td>
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
                    onChange={() => {
                        settVisSummert((prevState) => !prevState);
                    }}
                    checked={visSummert}
                />
            )}
            <h2>Overgangsstønad</h2>
            {visPerioder(visSummert, perioder.overgangsstønad)}

            <h2>Barnetilsyn</h2>
            {visPerioder(visSummert, perioder.barnetilsyn)}

            <h2>Skolepenger</h2>
            {visPerioder(visSummert, perioder.skolepenger)}
        </>
    );
};

const Infotrygdperioderoversikt: React.FC<{
    fagsakPerson: IFagsakPerson;
    personIdent: string;
    onMigrert?: (behandlingId: string) => void;
}> = ({ fagsakPerson, personIdent, onMigrert }) => {
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
                    <InfotrygdEllerSummertePerioder perioder={infotrygdPerioder} />
                    <InfotrygdSaker personIdent={personIdent} />
                    <MigrerFagsak fagsakPerson={fagsakPerson} onMigrert={onMigrert} />
                </>
            )}
        </DataViewer>
    );
};

export default Infotrygdperioderoversikt;
