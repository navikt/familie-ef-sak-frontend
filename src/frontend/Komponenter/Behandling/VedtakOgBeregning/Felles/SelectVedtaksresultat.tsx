import { behandlingResultatTilTekst, EBehandlingResultat } from '../../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Behandling } from '../../../../App/typer/fagsak';
import { Behandlingstype } from '../../../../App/typer/behandlingstype';
import { VEDTAK_OG_BEREGNING } from './konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { Heading } from '@navikt/ds-react';
import { Stønadstype } from '../../../../App/typer/behandlingstema';

interface Props {
    behandling: Behandling;
    resultatType?: EBehandlingResultat;
    settResultatType: (val: EBehandlingResultat) => void;
    alleVilkårOppfylt: boolean;
}

const StyledSelect = styled(FamilieSelect)`
    max-width: 200px;
    .skjemaelement__label {
        font-size: 1.25rem;
        line-height: 1.5625rem;
    }
`;

const SelectVedtaksresultat = (props: Props): JSX.Element => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const { resultatType, settResultatType, alleVilkårOppfylt, behandling } = props;
    const opphørMulig = behandling.type === Behandlingstype.REVURDERING;
    const erBlankettBehandling = behandling.type === Behandlingstype.BLANKETT;

    return (
        <section>
            <Heading spacing size="small" level="5">
                Vedtaksresultat
            </Heading>
            <StyledSelect
                value={resultatType}
                erLesevisning={!behandlingErRedigerbar}
                onChange={(e) => {
                    settResultatType(e.target.value as EBehandlingResultat);
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                }}
                lesevisningVerdi={resultatType && behandlingResultatTilTekst[resultatType]}
            >
                <option value="">Velg</option>
                <option value={EBehandlingResultat.INNVILGE} disabled={!alleVilkårOppfylt}>
                    Innvilge
                </option>

                <option
                    value={EBehandlingResultat.AVSLÅ}
                    disabled={behandling.stønadstype === Stønadstype.BARNETILSYN}
                >
                    Avslå
                </option>
                <option value={EBehandlingResultat.OPPHØRT} disabled={!opphørMulig}>
                    Opphørt
                </option>
                {erBlankettBehandling && (
                    <option value={EBehandlingResultat.BEHANDLE_I_GOSYS}>Behandle i Gosys</option>
                )}
            </StyledSelect>
        </section>
    );
};

export default SelectVedtaksresultat;
