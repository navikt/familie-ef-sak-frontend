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
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import { Søknadsinformasjon } from '../Felles/Søknadsinformasjon';
import { OppsummeringAvBarn } from './OppsummeringAvBarn';
import { BreakWordNormaltekst } from '../../../../Felles/Visningskomponenter/BreakWordNormaltekst';
import { Vilkårsvurdering } from '../Felles/Vilkårsvurdering';

const OppsummeringContainer = styled.div`
    display: flex;
    margin: 1rem 2rem 1rem 2rem;
    gap: 1rem;
    flex-wrap: wrap;
`;

const Container = styled.div`
    margin: 1rem 1rem 0 1rem;
    padding: 1rem 1rem 1rem 2rem;
`;

const lagVilkåresresultatPerBarn = (
    vilkår: IVilkår,
    vilkårType: InngangsvilkårType.ALENEOMSORG | AktivitetsvilkårType.ALDER_PÅ_BARN
): Record<string, Vilkårsresultat> =>
    vilkår.vurderinger
        .filter((vurdering) => vurdering.vilkårType === vilkårType)
        .reduce((acc, vurdering) => {
            if (vurdering.barnId) {
                acc[vurdering.barnId] = vurdering.resultat;
            }
            return acc;
        }, {} as Record<string, Vilkårsresultat>);

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
        <>
            <OppsummeringContainer>
                <Vilkårsvurdering vilkår={vilkår} />
                {skalViseSøknadsdata && <Søknadsinformasjon behandlingId={behandling.id} />}
            </OppsummeringContainer>
            {finnesBarnPåBehandling && (
                <OppsummeringContainer>
                    {barnPåBehandling.map((barn) => {
                        return (
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
                        );
                    })}
                </OppsummeringContainer>
            )}
            {begrunnelseForTilsynsutgiftVilkår && (
                <Container>
                    <Heading spacing size="small" level="5">
                        Vurdering tilsynsutgifter
                    </Heading>
                    <BreakWordNormaltekst>{begrunnelseForTilsynsutgiftVilkår}</BreakWordNormaltekst>
                </Container>
            )}
        </>
    );
};
