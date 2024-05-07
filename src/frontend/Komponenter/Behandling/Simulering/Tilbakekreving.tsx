import React, { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { VisTilbakekreving } from './VisTilbakekreving';
import { TilbakekrevingSkjema } from './TilbakekrevingSkjema';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { Loader } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { useRedirectEtterLagring } from '../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';
import { harVerdi } from '../../../App/utils/utils';

export enum ITilbakekrevingsvalg {
    OPPRETT_MED_VARSEL = 'OPPRETT_MED_VARSEL',
    OPPRETT_UTEN_VARSEL = 'OPPRETT_UTEN_VARSEL',
    OPPRETT_AUTOMATISK = 'OPPRETT_AUTOMATISK',
    AVVENT = 'AVVENT',
}

export interface ITilbakekreving {
    valg?: ITilbakekrevingsvalg;
    varseltekst?: string;
    begrunnelse: string;
}

export const TilbakekrevingsvalgTilTekst: Record<ITilbakekrevingsvalg, string> = {
    OPPRETT_MED_VARSEL: 'Opprett tilbakekreving, send varsel',
    OPPRETT_UTEN_VARSEL: 'Opprett tilbakekreving, ikke send varsel',
    OPPRETT_AUTOMATISK:
        'Opprett automatisk behandling av tilbakekreving under 4 ganger rettsgebyret',
    AVVENT: 'Avvent',
};

const enum ÅpenTilbakekrevingStatus {
    LASTER = 'LASTER',
    HAR_ÅPEN = 'HAR_ÅPEN',
    HAR_IKKE_ÅPEN = 'HAR_IKKE_ÅPEN',
}

export interface TilbakekrevingProps {
    behandlingId: string;
    erUnder4xRettsgebyr: boolean;
}

export const Tilbakekreving: React.FC<TilbakekrevingProps> = ({
    behandlingId,
    erUnder4xRettsgebyr,
}) => {
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const { behandlingErRedigerbar, behandling } = useBehandling();
    const [tilbakekrevingsvalg, settTilbakekrevingsvalg] = useState<ITilbakekrevingsvalg>();
    const [varseltekst, settVarseltekst] = useState<string>('');
    const [begrunnelse, settBegrunnelse] = useState<string>('');
    const [feilmelding, settFeilmelding] = useState<string>();
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [kanForhåndsvise, settKanForhåndsvise] = useState<boolean>(false);
    const [valideringsfeil, settValideringsfeil] = useState<string>('');

    const [åpenTilbakekrevingStatus, settÅpenTilbakekrevingStatus] =
        useState<ÅpenTilbakekrevingStatus>(ÅpenTilbakekrevingStatus.LASTER);

    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandlingId}/brev`);

    useEffect(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            settKanForhåndsvise(behandling.data.status !== BehandlingStatus.FERDIGSTILT);
        }
    }, [behandling]);

    useEffect(() => {
        axiosRequest<boolean, null>({
            method: 'GET',
            url: `familie-ef-sak/api/tilbakekreving/${behandlingId}/er-allerede-opprettet`,
        }).then((respons: RessursSuksess<boolean> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settÅpenTilbakekrevingStatus(
                    respons.data
                        ? ÅpenTilbakekrevingStatus.HAR_ÅPEN
                        : ÅpenTilbakekrevingStatus.HAR_IKKE_ÅPEN
                );
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
        // eslint-disable-next-line
    }, [behandlingId]);

    useEffect(() => {
        axiosRequest<ITilbakekreving, null>({
            method: 'GET',
            url: `familie-ef-sak/api/tilbakekreving/${behandlingId}`,
        }).then((respons: RessursSuksess<ITilbakekreving> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                if (respons.data) {
                    settBegrunnelse(respons.data.begrunnelse);
                    settTilbakekrevingsvalg(respons.data.valg);
                    settVarseltekst(respons.data.varseltekst || '');
                }
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
        // eslint-disable-next-line
    }, [behandlingId]);

    const endreTilbakekrevingsvalg = (nyttValg: ITilbakekrevingsvalg) => {
        settTilbakekrevingsvalg(nyttValg);
    };

    const endreVarseltekst = (nyTekst: string) => {
        settVarseltekst(nyTekst);
    };

    const endreBegrunnelse = (nyBegrunnelse: string) => {
        settBegrunnelse(nyBegrunnelse);
    };

    const inkluderVarseltekst = (tilbakekrevingsvalg: ITilbakekrevingsvalg) => {
        return tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_MED_VARSEL;
    };

    const lagreTilbakekrevingsvalg = () => {
        settValideringsfeil('');
        if (låsKnapp) {
            return;
        }
        if (!tilbakekrevingsvalg) {
            settValideringsfeil('Mangelfull utfylling av tilbakekrevingsvalg');
            return;
        }

        if (!harVerdi(begrunnelse)) {
            settValideringsfeil('Begrunnelse for tilbakekreving må fylles ut');
            return;
        }

        settFeilmelding('');
        settLåsKnapp(true);
        nullstillIkkePersisterteKomponenter();
        axiosRequest<string, ITilbakekreving>({
            method: 'POST',
            url: `/familie-ef-sak/api/tilbakekreving/${behandlingId}`,
            data: {
                valg: tilbakekrevingsvalg,
                varseltekst: inkluderVarseltekst(tilbakekrevingsvalg) ? varseltekst : '',
                begrunnelse: begrunnelse,
            },
        })
            .then((response: Ressurs<string>) => {
                switch (response.status) {
                    case RessursStatus.SUKSESS:
                        utførRedirect();
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                        settIkkePersistertKomponent(uuidv4());
                        settFeilmelding(response.frontendFeilmelding || 'Noe gikk galt');
                }
            })
            .finally(() => settLåsKnapp(false));
    };
    switch (åpenTilbakekrevingStatus) {
        case ÅpenTilbakekrevingStatus.LASTER:
            return <Loader size={'xlarge'} variant="interaction" transparent={true} />;
        case ÅpenTilbakekrevingStatus.HAR_ÅPEN:
            return (
                <div>
                    {(behandlingErRedigerbar || !tilbakekrevingsvalg) && (
                        <>
                            <h2>Tilbakekreving</h2>
                            <BodyShortSmall>
                                Det finnes allerede en åpen tilbakekrevingssak.
                            </BodyShortSmall>
                        </>
                    )}
                    {!behandlingErRedigerbar && tilbakekrevingsvalg && (
                        <VisTilbakekreving
                            tilbakekrevingsvalg={tilbakekrevingsvalg as ITilbakekrevingsvalg}
                            begrunnelse={begrunnelse}
                            varseltekst={varseltekst}
                            kanForhåndsvise={kanForhåndsvise}
                            behandlingId={behandlingId}
                        />
                    )}
                </div>
            );
        default:
            return (
                <div>
                    {behandlingErRedigerbar && (
                        <TilbakekrevingSkjema
                            tilbakekrevingsvalg={tilbakekrevingsvalg}
                            varseltekst={varseltekst}
                            begrunnelse={begrunnelse}
                            endreTilbakekrevingsvalg={endreTilbakekrevingsvalg}
                            endreVarseltekst={endreVarseltekst}
                            endreBegrunnelse={endreBegrunnelse}
                            lagreTilbakekrevingsValg={lagreTilbakekrevingsvalg}
                            låsKnapp={låsKnapp}
                            behandlingId={behandlingId}
                            valideringsfeil={valideringsfeil}
                            erUnder4xRettsgebyr={erUnder4xRettsgebyr}
                        />
                    )}
                    {!behandlingErRedigerbar && (
                        <VisTilbakekreving
                            tilbakekrevingsvalg={tilbakekrevingsvalg as ITilbakekrevingsvalg}
                            begrunnelse={begrunnelse}
                            varseltekst={varseltekst}
                            kanForhåndsvise={kanForhåndsvise}
                            behandlingId={behandlingId}
                        />
                    )}
                    {feilmelding && <AlertError>{feilmelding}</AlertError>}
                </div>
            );
    }
};
