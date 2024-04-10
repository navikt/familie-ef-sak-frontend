import React, { useState } from 'react';
import { EnsligTextArea } from '../../../Felles/Input/TekstInput/EnsligTextArea';
import styled from 'styled-components';
import { ITilbakekrevingsvalg } from './Tilbakekreving';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import { FileTextIcon } from '@navikt/aksel-icons';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';
import { InfostripeTilbakekrevingsvalg } from './InfostripeTilbakekrevingsvalg';

const VarselValg = styled.div`
    margin-bottom: 1rem;
`;

const ErrorTekst = styled.div`
    font-family: 'Source Sans Pro', Arial, sans-serif;
    font-size: 1rem;
    line-height: 1.375rem;
    font-weight: 600;
    color: ${ARed500};
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
    erUnder4xRettsgebyr: boolean;
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
    erUnder4xRettsgebyr,
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
            }).then((respons: RessursSuksess<string> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    åpnePdfIEgenTab(
                        base64toBlob(respons.data, 'application/pdf'),
                        'Forhåndsvisning av varselbrev'
                    );
                } else {
                    settForhåndsvisningsFeil(respons.frontendFeilmelding);
                }
                settHenterBrev(false);
            });
        }
    };

    return (
        <>
            <RadioGroup
                value={tilbakekrevingsvalg}
                onChange={(tilbakekrevingsvalg: ITilbakekrevingsvalg) => {
                    settIkkePersistertKomponent('tilbakekreving');
                    endreTilbakekrevingsvalg(tilbakekrevingsvalg);
                }}
                legend={<h2>Tilbakekreving</h2>}
            >
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
                <InfostripeTilbakekrevingsvalg erUnder4xRettsgebyr={erUnder4xRettsgebyr} />
                {erUnder4xRettsgebyr && (
                    <Radio
                        value={ITilbakekrevingsvalg.OPPRETT_AUTOMATISK}
                        name="tilbakekrevingRadio"
                    >
                        Opprett automatisk behandling av tilbakekreving under 4 ganger rettsgebyret
                    </Radio>
                )}

                <Radio value={ITilbakekrevingsvalg.OPPRETT_MED_VARSEL} name="tilbakekrevingRadio">
                    Opprett tilbakekreving, send varsel
                </Radio>
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
                        <Button
                            type={'button'}
                            variant={'tertiary'}
                            icon={<FileTextIcon />}
                            size={'xsmall'}
                            onClick={åpneBrevINyFane}
                        >
                            Forhåndsvis varselbrev
                        </Button>
                        {forhåndsvisningsFeil && <AlertError>{forhåndsvisningsFeil}</AlertError>}
                    </VarselValg>
                )}
                <Radio value={ITilbakekrevingsvalg.OPPRETT_UTEN_VARSEL} name="tilbakekrevingRadio">
                    Opprett tilbakekreving, ikke send varsel
                </Radio>
                <Radio value={ITilbakekrevingsvalg.AVVENT} name="tilbakekrevingRadio">
                    Avvent
                </Radio>
            </RadioGroup>
            {valideringsfeil && <ErrorTekst>{valideringsfeil}</ErrorTekst>}
            <Button type={'submit'} onClick={lagreTilbakekrevingsValg} disabled={låsKnapp}>
                Lagre tilbakekrevingsvalg
            </Button>
        </>
    );
};
