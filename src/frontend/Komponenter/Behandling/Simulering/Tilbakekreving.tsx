import React, { useState } from 'react';
import { ISimulering } from './SimuleringTyper';
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

enum ITilbakekrevingsvalg {
    OPPRETT_MED_VARSEL = 'OPPRETT_MED_VARSEL',
    OPPRETT_UTEN_VARSEL = 'OPPRETT_UTEN_VARSEL',
    AVVENT = 'AVVENT',
}

interface TilbakekrevingRequest {
    valg?: ITilbakekrevingsvalg;
    varseltekst?: string;
    begrunnelse: string;
}

const VarselValg = styled.div`
    margin-bottom: 1rem;
`;

export const Tilbakekreving: React.FC<{ simuleringsresultat: ISimulering }> = ({
    simuleringsresultat,
}) => {
    const { axiosRequest } = useApp();
    const { behandlingId } = useParams<IBehandlingParams>();
    const history = useHistory();
    const [tilbakekrevingsvalg, settTilbakekrevingsvalg] = useState<ITilbakekrevingsvalg>();
    const [varseltekst, settVarseltekst] = useState<string>('');
    const [begrunnelse, settBegrunnelse] = useState<string>('');
    const [feilmelding, settFeilmelding] = useState<string>();
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    // TODO: Hent eksisterende tilbakekreving
    // TODO: HarÅpenTilbakekreving - vis info om dette istedenfor skjema
    console.log(simuleringsresultat);

    const lagreTilbakekrevingsvalg = () => {
        if (låsKnapp) {
            return;
        }
        settLåsKnapp(true);
        axiosRequest<string, TilbakekrevingRequest>({
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
                        // nullstillIkkePersisterteKomponenter();
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

    return (
        <div>
            <FamilieRadioGruppe erLesevisning={false} legend={'Tilbakekreving'}>
                <Radio
                    checked={tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_MED_VARSEL}
                    label="Opprett tilbakekreving, send varsel"
                    name="tilbakekrevingRadio"
                    onChange={() => {
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
                            onChange={(e) => settVarseltekst(e.target.value)}
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
                    checked={tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_UTEN_VARSEL}
                    label="Opprett tilbakekreving, ikke send varsel"
                    name="tilbakekrevingRadio"
                    onChange={() => {
                        settTilbakekrevingsvalg(ITilbakekrevingsvalg.OPPRETT_UTEN_VARSEL);
                    }}
                />
                <Radio
                    checked={tilbakekrevingsvalg === ITilbakekrevingsvalg.AVVENT}
                    label="Avvent"
                    name="tilbakekrevingRadio"
                    onChange={() => {
                        settTilbakekrevingsvalg(ITilbakekrevingsvalg.AVVENT);
                    }}
                />
                <EnsligTextArea
                    label={'Begrunnelse (internt notat)'}
                    erLesevisning={false}
                    value={begrunnelse}
                    maxLength={0}
                    onChange={(e) => settBegrunnelse(e.target.value)}
                />
            </FamilieRadioGruppe>
            <Hovedknapp htmlType={'submit'} onClick={lagreTilbakekrevingsvalg} disabled={låsKnapp}>
                Lagre tilbakekrevingsvalg
            </Hovedknapp>
            <AlertStripeFeil>{feilmelding}</AlertStripeFeil>
        </div>
    );
};
