import React from 'react';
import { Radio } from 'nav-frontend-skjema';
import { EnsligTextArea } from '../../../Felles/Input/TekstInput/EnsligTextArea';
import { FamilieRadioGruppe } from '@navikt/familie-form-elements';
import { Hovedknapp } from 'nav-frontend-knapper';
import Søknad from '../../../Felles/Ikoner/Søknad';
import IkonKnapp from '../../../Felles/Knapper/IkonKnapp';
import styled from 'styled-components';
import { ITilbakekrevingsvalg } from './Tilbakekreving';
import { useApp } from '../../../App/context/AppContext';

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
}) => {
    const { settIkkePersistertKomponent } = useApp();
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
