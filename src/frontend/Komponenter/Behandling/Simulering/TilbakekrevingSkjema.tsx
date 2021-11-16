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
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const VarselValg = styled.div`
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
}) => {
    const { settIkkePersistertKomponent, axiosRequest } = useApp();

    const [forhåndsvisningsFeil, settForhåndsvisningsFeil] = useState<string>();

    const åpneBrevINyFane = () => {
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
        });
    };

    return (
        <>
            <FamilieRadioGruppe erLesevisning={false} legend={<h2>Tilbakekreving</h2>}>
                <Radio
                    checked={tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_MED_VARSEL}
                    label="Opprett tilbakekreving, send varsel"
                    name="tilbakekrevingRadio"
                    onChange={() => {
                        settIkkePersistertKomponent('tilbakekreving');
                        endreTilbakekrevingsvalg(ITilbakekrevingsvalg.OPPRETT_MED_VARSEL);
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
                        {forhåndsvisningsFeil && (
                            <AlertStripeFeil>{forhåndsvisningsFeil}</AlertStripeFeil>
                        )}
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
                />
                <Radio
                    checked={tilbakekrevingsvalg === ITilbakekrevingsvalg.AVVENT}
                    label="Avvent"
                    name="tilbakekrevingRadio"
                    onChange={() => {
                        settIkkePersistertKomponent('tilbakekreving');
                        endreTilbakekrevingsvalg(ITilbakekrevingsvalg.AVVENT);
                    }}
                />
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
            </FamilieRadioGruppe>
            <Hovedknapp htmlType={'submit'} onClick={lagreTilbakekrevingsValg} disabled={låsKnapp}>
                Lagre tilbakekrevingsvalg
            </Hovedknapp>
        </>
    );
};
