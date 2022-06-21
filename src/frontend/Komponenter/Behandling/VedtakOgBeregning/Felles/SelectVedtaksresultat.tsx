import { behandlingResultatTilTekst, EBehandlingResultat } from '../../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingstype } from '../../../../App/typer/behandlingstype';
import { VEDTAK_OG_BEREGNING } from './konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { Heading, HelpText } from '@navikt/ds-react';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { useToggles } from '../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../App/context/toggles';

interface Props {
    behandling: Behandling;
    resultatType?: EBehandlingResultat;
    settResultatType: (val: EBehandlingResultat | undefined) => void;
    alleVilkårOppfylt: boolean;
}

const StyledSelect = styled(FamilieSelect)`
    width: 200px;
    .skjemaelement__label {
        font-size: 1.25rem;
        line-height: 1.5625rem;
    }
`;

const TekstLinje = styled.div`
    margin-top: 0.5rem;
`;

const FlexDiv = styled.div`
    display: flex;
    align-items: center;
`;

const HjelpeTekst = styled(HelpText)`
    margin-left: 1rem;
`;

const SelectVedtaksresultat = (props: Props): JSX.Element => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const { toggles } = useToggles();
    const { resultatType, settResultatType, alleVilkårOppfylt, behandling } = props;
    const opphørMulig =
        behandling.type === Behandlingstype.REVURDERING && behandling.forrigeBehandlingId;
    const erBlankettBehandling = behandling.type === Behandlingstype.BLANKETT;
    const nullUtbetalingPgaKontantstøtte =
        resultatType === EBehandlingResultat.INNVILGE_UTEN_UTBETALING;
    const tillaterOpphørForSkolepenger =
        behandling.stønadstype !== Stønadstype.SKOLEPENGER || toggles[ToggleName.skolepengerOpphør];

    return (
        <section>
            <Heading spacing size="small" level="5">
                Vedtaksresultat
            </Heading>
            <FlexDiv>
                <StyledSelect
                    value={resultatType}
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
                        disabled={
                            !opphørMulig ||
                            nullUtbetalingPgaKontantstøtte ||
                            !tillaterOpphørForSkolepenger
                        }
                    >
                        Opphørt
                    </option>
                    {erBlankettBehandling && (
                        <option
                            value={EBehandlingResultat.BEHANDLE_I_GOSYS}
                            disabled={nullUtbetalingPgaKontantstøtte}
                        >
                            Behandle i Gosys
                        </option>
                    )}
                </StyledSelect>
                {behandling.stønadstype === Stønadstype.BARNETILSYN && (
                    <HjelpeTekst title="Hvor kommer dette fra?" placement={'right'}>
                        <div>
                            Hvis kontantstøtten overstiger tilsynsutgiftene skal saksbehandler
                            likevel velge "Innvilge" som vedtaksresultat.
                        </div>
                        <TekstLinje>
                            Utgifter og kontantsstøtte fylles inn som normalt og systemet vil
                            beregne at det blir et avslag.
                        </TekstLinje>
                    </HjelpeTekst>
                )}
            </FlexDiv>
        </section>
    );
};

export default SelectVedtaksresultat;
