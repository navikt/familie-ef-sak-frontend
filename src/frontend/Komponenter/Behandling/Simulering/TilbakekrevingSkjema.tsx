import React, { useState } from 'react';
import styled from 'styled-components';
import { ITilbakekrevingsvalg, TilbakekrevingsvalgTilTekst } from './Tilbakekreving';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { BodyLong, Button, Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { FileTextIcon } from '@navikt/aksel-icons';
import { ABlue50, ARed500 } from '@navikt/ds-tokens/dist/tokens';
import { HeaderBegrunnelse } from './HeaderBegrunnelse';
import { EnsligTextArea } from '../../../Felles/Input/TekstInput/EnsligTextArea';

const Container = styled(VStack)`
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    padding-left: 1rem;
`;

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

const RadioButton = styled(Radio)`
    padding: 1rem;
    margin-bottom: 1rem;
    width: 100%;
    background-color: ${ABlue50};
`;

const Liste = styled.ul`
    list-style: none;
    margin: 0 0 1rem 0;
    padding: 0;
`;

const BodyLongMarginBottom = styled(BodyLong)`
    margin-bottom: 1rem;
`;

const HovedKnapp = styled(Button)`
    width: fit-content;
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
    skalViseValgForAutomatiskBehandlingUnder4xRettsgebyr: boolean;
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
    skalViseValgForAutomatiskBehandlingUnder4xRettsgebyr,
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
            <Heading size={'medium'} level={'2'}>
                Tilbakekreving
            </Heading>
            <Container gap="8">
                <EnsligTextArea
                    label={<HeaderBegrunnelse />}
                    readOnly={false}
                    value={begrunnelse}
                    maxLength={0}
                    onChange={(e) => {
                        settIkkePersistertKomponent('tilbakekreving');
                        endreBegrunnelse(e.target.value);
                    }}
                />
                <RadioGroup
                    value={tilbakekrevingsvalg}
                    onChange={(tilbakekrevingsvalg: ITilbakekrevingsvalg) => {
                        settIkkePersistertKomponent('tilbakekreving');
                        endreTilbakekrevingsvalg(tilbakekrevingsvalg);
                    }}
                    legend={'Valg for tilbakekreving'}
                >
                    {skalViseValgForAutomatiskBehandlingUnder4xRettsgebyr && (
                        <RadioButton
                            value={ITilbakekrevingsvalg.OPPRETT_AUTOMATISK}
                            name="tilbakekrevingRadio"
                        >
                            <FireGangerRettsgebyr />
                        </RadioButton>
                    )}

                    <RadioButton
                        value={ITilbakekrevingsvalg.OPPRETT_MED_VARSEL}
                        name="tilbakekrevingRadio"
                    >
                        <OpprettMedVarsel />
                    </RadioButton>
                    {tilbakekrevingsvalg === ITilbakekrevingsvalg.OPPRETT_MED_VARSEL && (
                        <VarselValg>
                            <EnsligTextArea
                                label={'Fritekst i varselet'}
                                readOnly={false}
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
                                disabled={henterBrev}
                            >
                                Forhåndsvis varselbrev
                            </Button>
                            {forhåndsvisningsFeil && (
                                <AlertError>{forhåndsvisningsFeil}</AlertError>
                            )}
                        </VarselValg>
                    )}
                    <RadioButton
                        value={ITilbakekrevingsvalg.OPPRETT_UTEN_VARSEL}
                        name="tilbakekrevingRadio"
                    >
                        <OpprettUtenVarsel />
                    </RadioButton>
                    <RadioButton value={ITilbakekrevingsvalg.AVVENT} name="tilbakekrevingRadio">
                        <Avvent />
                    </RadioButton>
                </RadioGroup>
            </Container>
            {valideringsfeil && <ErrorTekst>{valideringsfeil}</ErrorTekst>}
            <HovedKnapp type={'submit'} onClick={lagreTilbakekrevingsValg} disabled={låsKnapp}>
                Lagre tilbakekrevingsvalg
            </HovedKnapp>
        </>
    );
};

const FireGangerRettsgebyr = () => (
    <>
        <BodyLongMarginBottom size="large">
            {TilbakekrevingsvalgTilTekst[ITilbakekrevingsvalg.OPPRETT_AUTOMATISK]}
        </BodyLongMarginBottom>
        <BodyLong size="small">Det er vurdert at</BodyLong>
        <Liste>
            <li>
                <BodyLong size="small">
                    - bruker ikke har handlet forsettlig eller grovt uaktsomt
                </BodyLong>
            </li>
            <li>
                <BodyLong size="small">- beløpet er under 4 rettsgebyr</BodyLong>
            </li>
            <li>
                <BodyLong size="small">- beløpet ikke skal betales tilbake</BodyLong>
            </li>
        </Liste>
        <BodyLong size="small">
            Saken blir automatisk behandlet og bruker får et vedtak om ikke tilbakebetaling. Merk at
            det ikke er mulig å endre brevmottaker på denne typen tilbakekrevingsbehandling. Hvis du
            skal endre brevmottaker, må du velge et annet alternativ.
        </BodyLong>
    </>
);

const OpprettMedVarsel = () => (
    <>
        <BodyLongMarginBottom size="large">
            {TilbakekrevingsvalgTilTekst[ITilbakekrevingsvalg.OPPRETT_MED_VARSEL]}
        </BodyLongMarginBottom>
        <BodyLong size="small">
            Dette valget bruker du når du vet at det blir en feilutbetaling.
        </BodyLong>
    </>
);

const OpprettUtenVarsel = () => (
    <>
        <BodyLongMarginBottom size="large">
            {TilbakekrevingsvalgTilTekst[ITilbakekrevingsvalg.OPPRETT_UTEN_VARSEL]}
        </BodyLongMarginBottom>
        <BodyLong size="small">
            Dette valget bruker du når du vet at det blir feilutbetaling tilbake i tid, men du må
            vente på riktig beløp.
        </BodyLong>
    </>
);

const Avvent = () => (
    <>
        <BodyLongMarginBottom size="large">
            {TilbakekrevingsvalgTilTekst[ITilbakekrevingsvalg.AVVENT]}
        </BodyLongMarginBottom>
        <BodyLong size="small">
            Dette valget bruker du i tilfeller hvor du ikke tror det blir en feilutbetaling i det
            hele tatt.
        </BodyLong>
    </>
);
