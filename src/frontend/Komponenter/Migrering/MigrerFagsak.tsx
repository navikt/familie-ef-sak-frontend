import React, { useMemo, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import {
    byggHenterRessurs,
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../App/typer/ressurs';
import { MigreringInfoResponse, Migreringsstatus } from '../../App/typer/migrering';
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
import Info from '../../Felles/Ikoner/Info';
import { Button } from '@navikt/ds-react';

const StyledKnapp = styled(Button)`
    margin: 0.25rem;
`;

const visMigrertStatus = (migrertStatus: Ressurs<string>) => {
    return (
        <>
            {migrertStatus.status === RessursStatus.SUKSESS && (
                <div style={{ color: 'green' }}>Fagsaken er migrert</div>
            )}
            {(migrertStatus.status === RessursStatus.FEILET ||
                migrertStatus.status === RessursStatus.FUNKSJONELL_FEIL ||
                migrertStatus.status === RessursStatus.IKKE_TILGANG) && (
                <div style={{ color: 'red' }}>
                    {migrertStatus.frontendFeilmelding || migrertStatus.melding}
                </div>
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
    onMigrert?: (status: Migreringsstatus) => void;
    fraOppgavebenken?: boolean;
}> = ({ fagsakPerson, onMigrert, fraOppgavebenken }) => {
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const [migreringInfo, settMigreringInfo] = useState<Ressurs<MigreringInfoResponse>>(
        byggTomRessurs()
    );
    const [migrertStatus, settMigrertStatus] = useState<Ressurs<string>>(byggTomRessurs());

    const { id: fagsakPersonId } = fagsakPerson;

    const hentMigreringConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/migrering/${fagsakPersonId}`,
        }),
        [fagsakPersonId]
    );

    const migrerFagsakConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
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
        axiosRequest<string, void>(migrerFagsakConfig).then((res: Ressurs<string>) => {
            settMigrertStatus(res);
            if (res.status === RessursStatus.SUKSESS && onMigrert) {
                onMigrert(Migreringsstatus.ER_MIGRERT);
            }
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
                            {visMigrertStatus(migrertStatus)}

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
                            {migreringInfo.kanMigreres && fraOppgavebenken && (
                                <>
                                    <div>
                                        <Info heigth={24} width={24} /> Etter migrering vil du bli
                                        sendt videre til journalføring.
                                    </div>
                                    <div>
                                        Hvis du ønsker å journalføre på en ny behandling må du
                                        refreshe siden til at behandlingen får statusen "IVERKSATT"
                                    </div>
                                </>
                            )}
                            {fraOppgavebenken &&
                                migreringInfo.kanGåVidereTilJournalføring &&
                                onMigrert && (
                                    <>
                                        <div>
                                            Gå til journalføring om du ønsker å opprette saken i EF
                                            Sak
                                        </div>
                                        <div>
                                            <StyledKnapp
                                                variant={'secondary'}
                                                onClick={() =>
                                                    onMigrert(
                                                        Migreringsstatus.KAN_GÅ_VIDERE_TIL_JOURNALFØRING
                                                    )
                                                }
                                            >
                                                Gå videre til journalføring
                                            </StyledKnapp>
                                        </div>
                                    </>
                                )}
                        </>
                    );
                }}
            </DataViewer>
        </div>
    );
};

export default MigrerFagsak;
