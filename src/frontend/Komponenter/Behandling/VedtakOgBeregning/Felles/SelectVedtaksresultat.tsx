import { behandlingResultatTilTekst, EBehandlingResultat } from '../../../../App/typer/vedtak';
import React, { ReactNode, useContext } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingstype } from '../../../../App/typer/behandlingstype';
import { VEDTAK_OG_BEREGNING } from './konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { Button, Heading, HelpText } from '@navikt/ds-react';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { NullstillVedtakModalContext } from './NullstillVedtakModalContext';
import { EnsligFamilieSelect } from '../../../../Felles/Input/EnsligFamilieSelect';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { ToggleName } from '../../../../App/context/toggles';
import { useToggles } from '../../../../App/context/TogglesContext';

interface Props {
    behandling: Behandling;
    resultatType?: EBehandlingResultat;
    settResultatType: (val: EBehandlingResultat | undefined) => void;
    alleVilkårOppfylt: boolean;
    skalViseNullstillVedtakKnapp: boolean;
}

const StyledSelect = styled(EnsligFamilieSelect)`
    width: 10rem;
`;

const TekstLinje = styled.div`
    margin-top: 0.5rem;
`;

const FlexCenter = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const Container = styled.section`
    padding: 1rem;
    background-color: ${AGray50};
`;

const SelectVedtaksresultat = (props: Props): ReactNode => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const { resultatType, settResultatType, alleVilkårOppfylt, behandling } = props;
    const { toggles } = useToggles();
    const finnesForrigeBehandling =
        behandling.type === Behandlingstype.REVURDERING && behandling.forrigeBehandlingId != null;
    const opphørMulig = toggles[ToggleName.visBeregningsskjema] ? true : finnesForrigeBehandling;
    const nullUtbetalingPgaKontantstøtte =
        resultatType === EBehandlingResultat.INNVILGE_UTEN_UTBETALING;

    const { settVisNullstillVedtakModal } = useContext(NullstillVedtakModalContext);

    return (
        <Container>
            <Heading spacing size="small">
                Vedtaksresultat
            </Heading>
            <FlexCenter>
                <StyledSelect
                    label={'Vedtaksresultat'}
                    hideLabel
                    value={resultatType || ''}
                    erLesevisning={!behandlingErRedigerbar}
                    onChange={(e) => {
                        const vedtaksresultat =
                            e.target.value === ''
                                ? undefined
                                : (e.target.value as EBehandlingResultat);
                        settResultatType(vedtaksresultat);
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                    }}
                    lesevisningVerdi={resultatType && behandlingResultatTilTekst[resultatType]}
                >
                    <option value="" disabled={nullUtbetalingPgaKontantstøtte}>
                        Velg
                    </option>
                    {nullUtbetalingPgaKontantstøtte && (
                        <option value={EBehandlingResultat.INNVILGE_UTEN_UTBETALING}>
                            Avslag/opphør pga kontantstøtte
                        </option>
                    )}
                    <option
                        value={EBehandlingResultat.INNVILGE}
                        disabled={!alleVilkårOppfylt || nullUtbetalingPgaKontantstøtte}
                    >
                        Innvilge
                    </option>

                    <option
                        value={EBehandlingResultat.AVSLÅ}
                        disabled={nullUtbetalingPgaKontantstøtte}
                    >
                        Avslå
                    </option>
                    <option
                        value={EBehandlingResultat.OPPHØRT}
                        disabled={!opphørMulig || nullUtbetalingPgaKontantstøtte}
                    >
                        Opphør
                    </option>
                </StyledSelect>
                {behandling.stønadstype === Stønadstype.BARNETILSYN && behandlingErRedigerbar && (
                    <HelpText title="Hvor kommer dette fra?" placement={'right'}>
                        <div>
                            Hvis kontantstøtten overstiger tilsynsutgiftene skal saksbehandler
                            likevel velge "Innvilge" som vedtaksresultat.
                        </div>
                        <TekstLinje>
                            Utgifter og kontantsstøtte fylles inn som normalt og systemet vil
                            beregne at det blir et avslag.
                        </TekstLinje>
                    </HelpText>
                )}
                {props.skalViseNullstillVedtakKnapp && behandlingErRedigerbar && (
                    <Button
                        variant="tertiary"
                        size={'small'}
                        onClick={() => settVisNullstillVedtakModal(true)}
                    >
                        Nullstill vedtaksside
                    </Button>
                )}
            </FlexCenter>
        </Container>
    );
};

export default SelectVedtaksresultat;
