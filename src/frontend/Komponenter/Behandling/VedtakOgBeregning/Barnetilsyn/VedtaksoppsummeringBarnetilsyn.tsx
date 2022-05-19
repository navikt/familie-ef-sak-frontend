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
import { ResultatVisning } from '../Felles/ResultatVisning';
import { sorterUtBarnetilsynsvilkår, sorterUtInngangsvilkår } from '../Felles/utils';
import { Behandlingsårsak } from '../../../../App/typer/Behandlingsårsak';
import { Søknadsdatoer } from '../Overgangsstønad/Søknadsdatoer';
import { OppsummeringAvBarn } from './OppsummeringAvBarn';
import { BreakWordNormaltekst } from '../../../../Felles/Visningskomponenter/BreakWordNormaltekst';

const OppsummeringContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-right: 0.5rem;
    flex-wrap: wrap;
`;

const Oppsummeringsboks = styled.div`
    margin: 1rem;
    margin-right: 0.5rem;
    padding: 1rem;
`;

const BegrunnelseTilsynsutgifter = styled.div`
    margin: 1rem;
    padding: 1rem;
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
    const inngangsvilkår = sorterUtInngangsvilkår(vilkår);
    const barnetilsynsvilkår = sorterUtBarnetilsynsvilkår(vilkår);
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
                <Oppsummeringsboks>
                    <Heading spacing size="small" level="5">
                        Vilkårsvurdering
                    </Heading>
                    <ResultatVisning
                        vilkårsvurderinger={inngangsvilkår}
                        tittel="Inngangsvilkår:"
                        stønadstype={behandling.stønadstype}
                    />
                    <ResultatVisning
                        vilkårsvurderinger={barnetilsynsvilkår}
                        tittel="Aktivitetsvilkår:"
                        stønadstype={behandling.stønadstype}
                    />
                </Oppsummeringsboks>
                {skalViseSøknadsdata && (
                    <Oppsummeringsboks>
                        <Søknadsdatoer
                            behandlingId={behandling.id}
                            stønadstype={behandling.stønadstype}
                        />
                    </Oppsummeringsboks>
                )}
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
                <BegrunnelseTilsynsutgifter>
                    <Heading spacing size="small" level="5">
                        Vurdering tilsynsutgifter
                    </Heading>
                    <BreakWordNormaltekst>{begrunnelseForTilsynsutgiftVilkår}</BreakWordNormaltekst>
                </BegrunnelseTilsynsutgifter>
            )}
        </>
    );
};
