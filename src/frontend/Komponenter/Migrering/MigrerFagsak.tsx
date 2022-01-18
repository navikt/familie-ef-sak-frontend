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
    const [migreringFeil, settMigreringFeil] = useState<string>();

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
        settMigreringFeil(undefined);
        axiosRequest<MigreringInfoResponse, null>(hentMigreringConfig).then(
            (res: Ressurs<MigreringInfoResponse>) => settMigreringInfo(res)
        );
    };

    const migrerFagsak = () => {
        settMigreringFeil(undefined);
        axiosRequest<string, void>(migrerFagsakConfig).then((res: Ressurs<string>) => {
            if (
                res.status === RessursStatus.FEILET ||
                res.status === RessursStatus.FUNKSJONELL_FEIL ||
                res.status === RessursStatus.IKKE_TILGANG
            ) {
                settMigreringFeil(res.frontendFeilmelding || res.melding);
            }
        });
    };

    return (
        <div>
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
                        {migreringInfo.inntektsgrunnlag && (
                            <div>
                                Inntektsgrunnlag:{' '}
                                {formaterTallMedTusenSkille(migreringInfo.inntektsgrunnlag)}
                            </div>
                        )}
                        {migreringInfo.samordningsfradrag && (
                            <div>
                                Inntektsgrunnlag:{' '}
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
                        <div>Årsak: {migreringInfo.årsak}</div>
                        <Knapp onClick={migrerFagsak} disabled={!migreringInfo.kanMigreres}>
                            Migrer fagsak
                        </Knapp>
                        {migreringFeil && <div style={{ color: 'red' }}>${migreringFeil}</div>}
                    </>
                )}
            </DataViewer>
        </div>
    );
};

export default MigrerFagsak;
