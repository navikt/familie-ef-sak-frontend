import React, { useEffect, useState } from 'react';
import { Radio } from 'nav-frontend-skjema';
import { EnsligTextArea } from '../../../Felles/Input/TekstInput/EnsligTextArea';
import { FamilieRadioGruppe } from '@navikt/familie-form-elements';
import { Hovedknapp } from 'nav-frontend-knapper';
import Søknad from '../../../Felles/Ikoner/Søknad';
import IkonKnapp from '../../../Felles/Knapper/IkonKnapp';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useHistory, useParams } from 'react-router-dom';
import { IBehandlingParams } from '../../../App/typer/routing';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useBehandling } from '../../../App/context/BehandlingContext';

enum ITilbakekrevingsvalg {
    OPPRETT_MED_VARSEL = 'OPPRETT_MED_VARSEL',
    OPPRETT_UTEN_VARSEL = 'OPPRETT_UTEN_VARSEL',
    AVVENT = 'AVVENT',
}

interface ITilbakekreving {
    valg?: ITilbakekrevingsvalg;
    varseltekst?: string;
    begrunnelse: string;
}

const TilbakekrevingsvalgTilTekst: Record<ITilbakekrevingsvalg, string> = {
    OPPRETT_MED_VARSEL: 'Opprett med advarsel',
    OPPRETT_UTEN_VARSEL: 'Opprett uten advarsel',
    AVVENT: 'Avvent',
};

const VarselValg = styled.div`
    margin-bottom: 1rem;
`;

const VisTilbakekreving = styled.div`
    margin-top: 1rem;
`;

const UnderOverskrfit = styled(Element)`
    margin-top: 1rem;
`;

const enum ÅpenTilbakekrevingStatus {
    LASTER = 'LASTER',
    HAR_ÅPEN = 'HAR_ÅPEN',
    HAR_IKKE_ÅPEN = 'HAR_IKKE_ÅPEN',
}

export const Tilbakekreving: React.FC = () => {
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const { behandlingId } = useParams<IBehandlingParams>();
    const history = useHistory();
    const [tilbakekrevingsvalg, settTilbakekrevingsvalg] = useState<ITilbakekrevingsvalg>();
    const [varseltekst, settVarseltekst] = useState<string>('');
    const [begrunnelse, settBegrunnelse] = useState<string>('');
    const [feilmelding, settFeilmelding] = useState<string>();
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);

    const [åpenTilbakekrevingStatus, settÅpenTilbakekrevingStatus] =
        useState<ÅpenTilbakekrevingStatus>(ÅpenTilbakekrevingStatus.LASTER);

    useEffect(() => {
        axiosRequest<boolean, null>({
            method: 'GET',
            url: `familie-ef-sak/api/tilbakekreving/${behandlingId}/er-allerede-opprettet`,
        }).then((respons: Ressurs<boolean>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settÅpenTilbakekrevingStatus(
                    respons.data === true
                        ? ÅpenTilbakekrevingStatus.HAR_ÅPEN
                        : ÅpenTilbakekrevingStatus.HAR_IKKE_ÅPEN
                );
            } else if (
                respons.status === RessursStatus.FEILET ||
                respons.status === RessursStatus.FUNKSJONELL_FEIL ||
                respons.status === RessursStatus.IKKE_TILGANG
            ) {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
        // eslint-disable-next-line
    }, [behandlingId]);

    useEffect(() => {
        axiosRequest<ITilbakekreving, null>({
            method: 'GET',
            url: `familie-ef-sak/api/tilbakekreving/${behandlingId}`,
        }).then((respons: Ressurs<ITilbakekreving>) => {
            if (respons.status === RessursStatus.SUKSESS && respons.data) {
                settBegrunnelse(respons.data.begrunnelse);
                settTilbakekrevingsvalg(respons.data.valg);
                settVarseltekst(respons.data.varseltekst || '');
            } else if (
                respons.status === RessursStatus.FEILET ||
                respons.status === RessursStatus.FUNKSJONELL_FEIL ||
                respons.status === RessursStatus.IKKE_TILGANG
            ) {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
        // eslint-disable-next-line
    }, [behandlingId]);

    const lagreTilbakekrevingsvalg = () => {
        if (låsKnapp) {
            return;
        }
        settFeilmelding('');
        settLåsKnapp(true);
        axiosRequest<string, ITilbakekreving>({
            method: 'POST',
            url: `/familie-ef-sak/api/tilbakekreving/${behandlingId}`,
            data: {
                valg: tilbakekrevingsvalg,
                varseltekst: varseltekst,
                begrunnelse: begrunnelse,
            },
        })
            .then((response: Ressurs<string>) => {
                switch (response.status) {
                    case RessursStatus.SUKSESS:
                        history.push(`/behandling/${behandlingId}/brev`);
                        nullstillIkkePersisterteKomponenter();
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                        settFeilmelding(response.frontendFeilmelding || 'Noe gikk galt');
                }
            })
            .finally(() => settLåsKnapp(false));
    };
    switch (åpenTilbakekrevingStatus) {
        case ÅpenTilbakekrevingStatus.LASTER:
            return <NavFrontendSpinner />;
        case ÅpenTilbakekrevingStatus.HAR_ÅPEN:
            return (
                <div>
                    <h2>Tilbakekreving</h2>
                    <Normaltekst>Det finnes allerede en åpen tilbakekrevingssak.</Normaltekst>
                </div>
            );
        default:
            return (
                <div>
                    <FamilieRadioGruppe
                        erLesevisning={!behandlingErRedigerbar}
                        legend={<h2>Tilbakekreving</h2>}
                    >
                        <Radio
                            checked={
                                tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_MED_VARSEL
                            }
                            label="Opprett tilbakekreving, send varsel"
                            name="tilbakekrevingRadio"
                            onChange={() => {
                                settIkkePersistertKomponent('tilbakekreving');
                                settTilbakekrevingsvalg(ITilbakekrevingsvalg.OPPRETT_MED_VARSEL);
                            }}
                        />
                        {tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_MED_VARSEL && (
                            <VarselValg>
                                <EnsligTextArea
                                    label={'Fritekst i varselet'}
                                    erLesevisning={false}
                                    value={varseltekst}
                                    maxLength={0}
                                    onChange={(e) => {
                                        settIkkePersistertKomponent('tilbakekreving');
                                        settVarseltekst(e.target.value);
                                    }}
                                />
                                <IkonKnapp
                                    kompakt={true}
                                    mini={true}
                                    erLesevisning={false}
                                    onClick={() => {
                                        console.log('hurra');
                                    }}
                                    knappPosisjon={'venstre'}
                                    ikon={<Søknad />}
                                    label={'Forhåndsvis varsel'}
                                />
                            </VarselValg>
                        )}
                        <Radio
                            checked={
                                tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_UTEN_VARSEL
                            }
                            label="Opprett tilbakekreving, ikke send varsel"
                            name="tilbakekrevingRadio"
                            onChange={() => {
                                settIkkePersistertKomponent('tilbakekreving');
                                settTilbakekrevingsvalg(ITilbakekrevingsvalg.OPPRETT_UTEN_VARSEL);
                            }}
                        />
                        <Radio
                            checked={tilbakekrevingsvalg === ITilbakekrevingsvalg.AVVENT}
                            label="Avvent"
                            name="tilbakekrevingRadio"
                            onChange={() => {
                                settIkkePersistertKomponent('tilbakekreving');
                                settTilbakekrevingsvalg(ITilbakekrevingsvalg.AVVENT);
                            }}
                        />
                        <EnsligTextArea
                            label={'Begrunnelse (internt notat)'}
                            erLesevisning={false}
                            value={begrunnelse}
                            maxLength={0}
                            onChange={(e) => {
                                settIkkePersistertKomponent('tilbakekreving');
                                settBegrunnelse(e.target.value);
                            }}
                        />
                    </FamilieRadioGruppe>
                    {behandlingErRedigerbar && (
                        <Hovedknapp
                            htmlType={'submit'}
                            onClick={lagreTilbakekrevingsvalg}
                            disabled={låsKnapp}
                        >
                            Lagre tilbakekrevingsvalg
                        </Hovedknapp>
                    )}
                    {!behandlingErRedigerbar && (
                        <VisTilbakekreving>
                            <UnderOverskrfit>Valg for tilbakekreving:</UnderOverskrfit>
                            <Normaltekst>
                                {
                                    TilbakekrevingsvalgTilTekst[
                                        tilbakekrevingsvalg as ITilbakekrevingsvalg
                                    ]
                                }
                            </Normaltekst>
                            <UnderOverskrfit>Valg for begrunnelse:</UnderOverskrfit>
                            <Normaltekst>
                                {begrunnelse ? begrunnelse : 'Ingen begrunnelse'}
                            </Normaltekst>
                        </VisTilbakekreving>
                    )}
                    {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
                </div>
            );
    }
};
