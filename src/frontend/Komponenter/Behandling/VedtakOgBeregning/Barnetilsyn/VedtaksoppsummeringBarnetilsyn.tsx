import React from 'react';
import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    IVilkår,
    Vilkårsresultat,
} from '../../Inngangsvilkår/vilkår';
import { Behandling } from '../../../../App/typer/fagsak';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import { Behandlingsårsak } from '../../../../App/typer/behandlingsårsak';
import { Søknadsinformasjon } from '../Felles/Søknadsinformasjon';
import { OppsummeringAvBarn } from './OppsummeringAvBarn';
import { BreakWordBodyLongSmall } from '../../../../Felles/Visningskomponenter/BreakWordBodyLongSmall';
import { Vilkårsvurdering } from '../Felles/Vilkårsvurdering';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

const OppsummeringContainer = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

const VurderingTilsynsutgifter = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const lagVilkåresresultatPerBarn = (
    vilkår: IVilkår,
    vilkårType: InngangsvilkårType.ALENEOMSORG | AktivitetsvilkårType.ALDER_PÅ_BARN
): Record<string, Vilkårsresultat> =>
    vilkår.vurderinger
        .filter((vurdering) => vurdering.vilkårType === vilkårType)
        .reduce(
            (acc, vurdering) => {
                if (vurdering.barnId) {
                    acc[vurdering.barnId] = vurdering.resultat;
                }
                return acc;
            },
            {} as Record<string, Vilkårsresultat>
        );

export const VedtaksoppsummeringBarnetilsyn: React.FC<{
    vilkår: IVilkår;
    behandling: Behandling;
}> = ({ vilkår, behandling }) => {
    const skalViseSøknadsdata = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    const barnPåBehandling = vilkår.grunnlag.barnMedSamvær;
    const finnesBarnPåBehandling = vilkår.grunnlag.barnMedSamvær.length > 0;

    const vilkårsresultatAleneomsorgPerBarn = lagVilkåresresultatPerBarn(
        vilkår,
        InngangsvilkårType.ALENEOMSORG
    );
    const vilkårsresultatAlderPåBarnPerBarn = lagVilkåresresultatPerBarn(
        vilkår,
        AktivitetsvilkårType.ALDER_PÅ_BARN
    );
    const begrunnelseForTilsynsutgiftVilkår = vilkår.vurderinger.find(
        (vurdering) => vurdering.vilkårType === AktivitetsvilkårType.DOKUMENTASJON_TILSYNSUTGIFTER
    )?.delvilkårsvurderinger[0].vurderinger[0].begrunnelse;

    return (
        <Container>
            <OppsummeringContainer>
                <Vilkårsvurdering vilkår={vilkår} />
                {skalViseSøknadsdata && <Søknadsinformasjon behandlingId={behandling.id} />}
            </OppsummeringContainer>
            {finnesBarnPåBehandling && (
                <OppsummeringContainer>
                    {barnPåBehandling.map((barn) => (
                        <OppsummeringAvBarn
                            key={barn.barnId}
                            barn={barn}
                            vilkårsresultatAleneomsorg={
                                vilkårsresultatAleneomsorgPerBarn[barn.barnId]
                            }
                            vilkårsresultatAlderPåBarn={
                                vilkårsresultatAlderPåBarnPerBarn[barn.barnId]
                            }
                        />
                    ))}
                </OppsummeringContainer>
            )}
            {begrunnelseForTilsynsutgiftVilkår && (
                <VurderingTilsynsutgifter>
                    <Heading spacing size="small" level="5">
                        Vurdering tilsynsutgifter
                    </Heading>
                    <BreakWordBodyLongSmall>
                        {begrunnelseForTilsynsutgiftVilkår}
                    </BreakWordBodyLongSmall>
                </VurderingTilsynsutgifter>
            )}
        </Container>
    );
};
