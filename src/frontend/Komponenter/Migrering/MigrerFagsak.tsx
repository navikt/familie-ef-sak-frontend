import React, { useMemo, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import {
    byggHenterRessurs,
    byggSuksessRessurs,
    byggTomRessurs,
    erAvTypeFeil,
    Ressurs,
    RessursStatus,
} from '../../App/typer/ressurs';
import { MigreringInfoResponse } from '../../App/typer/migrering';
import { AxiosRequestConfig } from 'axios';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
    nullableBooleanTilTekst,
} from '../../App/utils/formatter';
import Utregningstabell from '../Behandling/VedtakOgBeregning/Overgangsstønad/InnvilgeVedtak/Utregningstabell';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { IFagsakPerson } from '../../App/typer/fagsak';
import styled from 'styled-components';
import { Button, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { AlertWarning } from '../../Felles/Visningskomponenter/Alerts';

const StyledKnapp = styled(Button)`
    margin: 0.25rem;
`;

const GodkjennSimuleringsfeil = styled(AlertWarning)`
    margin-top: 1rem;
    max-width: 60rem;
`;

export const visMigrertStatus = (
    migrertStatus: Ressurs<string>,
    settIgnorerFeilISimulering?: (verdi: boolean) => void
) => {
    return (
        <>
            {migrertStatus.status === RessursStatus.SUKSESS && (
                <div style={{ color: 'green' }}>Fagsaken er migrert</div>
            )}
            {erAvTypeFeil(migrertStatus) && (
                <>
                    <div style={{ color: 'red' }}>
                        {migrertStatus.frontendFeilmelding || migrertStatus.melding}
                    </div>
                    {settIgnorerFeilISimulering &&
                        migrertStatus.frontendFeilmelding.startsWith('Etterbetaling er') && (
                            <GodkjennSimuleringsfeil>
                                <CheckboxGroup
                                    legend={
                                        'Det er registrert en etterbetaling. ' +
                                        'NØS må kontaktes hvis bruker ikke skal ha denne utbetalt.'
                                    }
                                    onChange={(values: boolean[]) =>
                                        settIgnorerFeilISimulering(values.some((val) => val))
                                    }
                                >
                                    <Checkbox value={true}>
                                        Jeg tar kontakt med NØS dersom etterbetalingen ikke skal
                                        utbetales
                                    </Checkbox>
                                </CheckboxGroup>
                            </GodkjennSimuleringsfeil>
                        )}
                </>
            )}
        </>
    );
};

const visMigreringInfo = (migreringInfo: MigreringInfoResponse) => {
    return (
        <>
            {migreringInfo.kanMigreres && (
                <>
                    <div>Stønad fom: {formaterNullableMånedÅr(migreringInfo.stønadFom)}</div>
                    <div>Stønad tom: {formaterNullableMånedÅr(migreringInfo.stønadTom)}</div>
                    <div>
                        Inntektsgrunnlag:{' '}
                        {formaterTallMedTusenSkille(migreringInfo.inntektsgrunnlag)}
                    </div>
                    <div>
                        Samordningsfradrag:{' '}
                        {formaterTallMedTusenSkille(migreringInfo.samordningsfradrag)}
                    </div>
                    <Utregningstabell
                        beregnetStønad={byggSuksessRessurs(migreringInfo.beløpsperioder)}
                    />
                </>
            )}
            <div>Kan migreres: {nullableBooleanTilTekst(migreringInfo.kanMigreres)}</div>
            {!migreringInfo.kanMigreres && <div>Årsak: {migreringInfo.årsak}</div>}
        </>
    );
};

const MigrerFagsak: React.FC<{
    fagsakPerson: IFagsakPerson;
}> = ({ fagsakPerson }) => {
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const [migreringInfo, settMigreringInfo] = useState<Ressurs<MigreringInfoResponse>>(
        byggTomRessurs()
    );
    const [migrertStatus, settMigrertStatus] = useState<Ressurs<string>>(byggTomRessurs());
    const [ignorerFeilISimulering, settIgnorerFeilISimulering] = useState<boolean>();

    const { id: fagsakPersonId } = fagsakPerson;

    const hentMigreringConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/migrering/${fagsakPersonId}`,
        }),
        [fagsakPersonId]
    );

    if (!toggles[ToggleName.kanMigrereFagsak]) {
        return null;
    }

    const hentMigreringInfo = () => {
        settMigrertStatus(byggTomRessurs());
        axiosRequest<MigreringInfoResponse, null>(hentMigreringConfig).then(
            (res: Ressurs<MigreringInfoResponse>) => settMigreringInfo(res)
        );
    };

    const migrerFagsak = () => {
        settMigrertStatus(byggHenterRessurs());
        axiosRequest<string, { ignorerFeilISimulering?: boolean }>({
            method: 'POST',
            url: `/familie-ef-sak/api/migrering/${fagsakPersonId}`,
            data: {
                ignorerFeilISimulering,
            },
        }).then((res: Ressurs<string>) => {
            settMigrertStatus(res);
        });
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            <h1>Migrering - Overgangsstønad</h1>
            <StyledKnapp variant={'secondary'} onClick={hentMigreringInfo}>
                Hent migreringinfo
            </StyledKnapp>
            <DataViewer response={{ migreringInfo }}>
                {({ migreringInfo }) => {
                    return (
                        <>
                            {visMigreringInfo(migreringInfo)}
                            {visMigrertStatus(migrertStatus, settIgnorerFeilISimulering)}

                            {migreringInfo.kanMigreres && (
                                <div>
                                    <StyledKnapp
                                        onClick={migrerFagsak}
                                        disabled={
                                            migrertStatus.status === RessursStatus.HENTER ||
                                            migrertStatus.status === RessursStatus.SUKSESS
                                        }
                                    >
                                        Migrer fagsak
                                    </StyledKnapp>
                                </div>
                            )}
                        </>
                    );
                }}
            </DataViewer>
        </div>
    );
};

export default MigrerFagsak;
