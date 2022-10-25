import React, { useState } from 'react';
import { Radio } from 'nav-frontend-skjema';
import { EnsligTextArea } from '../../../Felles/Input/TekstInput/EnsligTextArea';
import { FamilieRadioGruppe } from '@navikt/familie-form-elements';
import { Hovedknapp } from 'nav-frontend-knapper';
import Søknad from '../../../Felles/Ikoner/Søknad';
import IkonKnapp from '../../../Felles/Knapper/IkonKnapp';
import styled from 'styled-components';
import { ITilbakekrevingsvalg } from './Tilbakekreving';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import navFarger from 'nav-frontend-core';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';

const VarselValg = styled.div`
    margin-bottom: 1rem;
`;

const ErrorTekst = styled.div`
    font-family: 'Source Sans Pro', Arial, sans-serif;
    font-size: 1rem;
    line-height: 1.375rem;
    font-weight: 600;
    color: ${navFarger.redError};
    margin-bottom: 1rem;
`;

interface Props {
    tilbakekrevingsvalg: ITilbakekrevingsvalg | undefined;
    varseltekst: string;
    begrunnelse: string;
    endreTilbakekrevingsvalg: (nyttValg: ITilbakekrevingsvalg) => void;
    endreVarseltekst: (nyTekst: string) => void;
    endreBegrunnelse: (nyBegrunnelse: string) => void;
    lagreTilbakekrevingsValg: () => void;
    låsKnapp: boolean;
    behandlingId: string;
    valideringsfeil: string;
}

export const TilbakekrevingSkjema: React.FC<Props> = ({
    tilbakekrevingsvalg,
    varseltekst,
    begrunnelse,
    endreTilbakekrevingsvalg,
    endreVarseltekst,
    endreBegrunnelse,
    lagreTilbakekrevingsValg,
    låsKnapp,
    behandlingId,
    valideringsfeil,
}) => {
    const { settIkkePersistertKomponent, axiosRequest } = useApp();

    const [forhåndsvisningsFeil, settForhåndsvisningsFeil] = useState<string>();
    const [henterBrev, settHenterBrev] = useState<boolean>(false);

    const åpneBrevINyFane = () => {
        if (!henterBrev) {
            settHenterBrev(true);
            axiosRequest<string, { varseltekst: string }>({
                method: 'POST',
                url: `familie-ef-sak/api/tilbakekreving/${behandlingId}/brev/generer`,
                data: { varseltekst },
            }).then((respons: Ressurs<string>) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    åpnePdfIEgenTab(
                        base64toBlob(respons.data, 'application/pdf'),
                        'Forhåndsvisning av varselbrev'
                    );
                } else if (
                    respons.status === RessursStatus.IKKE_TILGANG ||
                    respons.status === RessursStatus.FEILET ||
                    respons.status === RessursStatus.FUNKSJONELL_FEIL
                ) {
                    settForhåndsvisningsFeil(respons.frontendFeilmelding);
                }
                settHenterBrev(false);
            });
        }
    };

    return (
        <>
            <FamilieRadioGruppe erLesevisning={false} legend={<h2>Tilbakekreving</h2>}>
                <EnsligTextArea
                    label={'Begrunnelse (internt notat)'}
                    erLesevisning={false}
                    value={begrunnelse}
                    maxLength={0}
                    onChange={(e) => {
                        settIkkePersistertKomponent('tilbakekreving');
                        endreBegrunnelse(e.target.value);
                    }}
                />
                <Radio
                    checked={tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_MED_VARSEL}
                    label="Opprett tilbakekreving, send varsel"
                    name="tilbakekrevingRadio"
                    onChange={() => {
                        settIkkePersistertKomponent('tilbakekreving');
                        endreTilbakekrevingsvalg(ITilbakekrevingsvalg.OPPRETT_MED_VARSEL);
                    }}
                    feil={!!valideringsfeil}
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
                                endreVarseltekst(e.target.value);
                            }}
                        />
                        <IkonKnapp
                            kompakt={true}
                            mini={true}
                            erLesevisning={false}
                            onClick={åpneBrevINyFane}
                            knappPosisjon={'venstre'}
                            ikon={<Søknad />}
                            label={'Forhåndsvis varsel'}
                        />
                        {forhåndsvisningsFeil && <AlertError>{forhåndsvisningsFeil}</AlertError>}
                    </VarselValg>
                )}
                <Radio
                    checked={tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_UTEN_VARSEL}
                    label="Opprett tilbakekreving, ikke send varsel"
                    name="tilbakekrevingRadio"
                    onChange={() => {
                        settIkkePersistertKomponent('tilbakekreving');
                        endreTilbakekrevingsvalg(ITilbakekrevingsvalg.OPPRETT_UTEN_VARSEL);
                    }}
                    feil={!!valideringsfeil}
                />
                <Radio
                    checked={tilbakekrevingsvalg === ITilbakekrevingsvalg.AVVENT}
                    label="Avvent"
                    name="tilbakekrevingRadio"
                    onChange={() => {
                        settIkkePersistertKomponent('tilbakekreving');
                        endreTilbakekrevingsvalg(ITilbakekrevingsvalg.AVVENT);
                    }}
                    feil={!!valideringsfeil}
                />
            </FamilieRadioGruppe>
            {valideringsfeil && <ErrorTekst>{valideringsfeil}</ErrorTekst>}
            <Hovedknapp htmlType={'submit'} onClick={lagreTilbakekrevingsValg} disabled={låsKnapp}>
                Lagre tilbakekrevingsvalg
            </Hovedknapp>
        </>
    );
};
