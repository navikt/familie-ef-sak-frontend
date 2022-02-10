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
import { IFagsakPerson } from '../../App/typer/fagsak';

const MigrerFagsak: React.FC<{
    fagsakPerson: IFagsakPerson;
    onMigrert?: (behandlingId: string) => void;
}> = ({ fagsakPerson, onMigrert }) => {
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const [migreringInfo, settMigreringInfo] = useState<Ressurs<MigreringInfoResponse>>(
        byggTomRessurs()
    );
    const [migrertStatus, settMigrertStatus] = useState<Ressurs<string>>(byggTomRessurs());

    const { overgangsstønad: fagsakId } = fagsakPerson;

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
        axiosRequest<string, void>(migrerFagsakConfig).then((res: Ressurs<string>) => {
            settMigrertStatus(res);
            if (res.status === RessursStatus.SUKSESS && onMigrert) {
                onMigrert(res.data);
            }
        });

    return (
        <div style={{ marginTop: '1rem' }}>
            <h1>Migrering - Overgangsstønad</h1>
            <Knapp onClick={hentMigreringInfo}>Hent migreringinfo</Knapp>
            <DataViewer response={{ migreringInfo }}>
                {({ migreringInfo }) => (
                    <>
                        {migreringInfo.kanMigreres && (
                            <>
                                <div>
                                    Stønad fom: {formaterNullableMånedÅr(migreringInfo.stønadFom)}
                                </div>
                                <div>
                                    Stønad tom: {formaterNullableMånedÅr(migreringInfo.stønadTom)}
                                </div>
                                <div>
                                    Inntektsgrunnlag:{' '}
                                    {formaterTallMedTusenSkille(migreringInfo.inntektsgrunnlag)}
                                </div>
                                <div>
                                    Samordningsfradrag:{' '}
                                    {formaterTallMedTusenSkille(migreringInfo.samordningsfradrag)}
                                </div>
                                <Utregningstabell
                                    beregnetStønad={byggSuksessRessurs(
                                        migreringInfo.beløpsperioder
                                    )}
                                />
                            </>
                        )}
                        <div>
                            Kan migreres: {nullableBooleanTilTekst(migreringInfo.kanMigreres)}
                        </div>
                        {!migreringInfo.kanMigreres && <div>Årsak: {migreringInfo.årsak}</div>}

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
