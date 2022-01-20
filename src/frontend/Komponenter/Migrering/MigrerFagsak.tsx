import React, { useMemo, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import {
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../App/typer/ressurs';
import { MigreringInfoResponse } from '../../App/typer/migrering';
import { AxiosRequestConfig } from 'axios';
import { Knapp } from 'nav-frontend-knapper';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
    nullableBooleanTilTekst,
} from '../../App/utils/formatter';
import Utregningstabell from '../Behandling/VedtakOgBeregning/InnvilgeVedtak/Utregningstabell';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

const MigrerFagsak: React.FC<{ fagsakId: string }> = ({ fagsakId }) => {
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const [migreringInfo, settMigreringInfo] = useState<Ressurs<MigreringInfoResponse>>(
        byggTomRessurs()
    );
    const [migrertStatus, settMigrertStatus] = useState<Ressurs<string>>(byggTomRessurs());

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

    if (!toggles[ToggleName.MIGRERING]) {
        return null;
    }

    const hentMigreringInfo = () => {
        settMigrertStatus(byggTomRessurs());
        axiosRequest<MigreringInfoResponse, null>(hentMigreringConfig).then(
            (res: Ressurs<MigreringInfoResponse>) => settMigreringInfo(res)
        );
    };

    const migrerFagsak = () =>
        axiosRequest<string, void>(migrerFagsakConfig).then((res: Ressurs<string>) =>
            settMigrertStatus(res)
        );

    return (
        <div style={{ marginTop: '1rem' }}>
            <h1>Migrering</h1>
            <Knapp onClick={hentMigreringInfo}>Hent migreringinfo</Knapp>
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
                        {migreringInfo.inntektsgrunnlag && (
                            <div>
                                Inntektsgrunnlag:{' '}
                                {formaterTallMedTusenSkille(migreringInfo.inntektsgrunnlag)}
                            </div>
                        )}
                        {migreringInfo.samordningsfradrag && (
                            <div>
                                Samordningsfradrag:{' '}
                                {formaterTallMedTusenSkille(migreringInfo.samordningsfradrag)}
                            </div>
                        )}
                        {migreringInfo.beløpsperioder && (
                            <Utregningstabell
                                beregnetStønad={byggSuksessRessurs(migreringInfo.beløpsperioder)}
                            />
                        )}
                        <div>
                            Kan migreres: {nullableBooleanTilTekst(migreringInfo.kanMigreres)}
                        </div>
                        {migreringInfo.årsak && <div>Årsak: {migreringInfo.årsak}</div>}

                        {migrertStatus.status === RessursStatus.SUKSESS && (
                            <div style={{ color: 'green' }}>Fagsaken er migrert</div>
                        )}
                        {(migrertStatus.status === RessursStatus.FEILET ||
                            migrertStatus.status === RessursStatus.FUNKSJONELL_FEIL ||
                            migrertStatus.status === RessursStatus.IKKE_TILGANG) && (
                            <div style={{ color: 'red' }}>
                                ${migrertStatus.frontendFeilmelding || migrertStatus.melding}
                            </div>
                        )}
                        <Knapp
                            onClick={migrerFagsak}
                            disabled={
                                !migreringInfo.kanMigreres ||
                                migrertStatus.status === RessursStatus.HENTER ||
                                migrertStatus.status === RessursStatus.SUKSESS
                            }
                        >
                            Migrer fagsak
                        </Knapp>
                    </>
                )}
            </DataViewer>
        </div>
    );
};

export default MigrerFagsak;
