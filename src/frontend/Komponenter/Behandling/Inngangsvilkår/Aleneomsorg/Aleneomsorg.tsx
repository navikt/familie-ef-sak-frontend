import React, { useEffect, useState } from 'react';
import { vilkårStatusForBarn } from '../../Vurdering/VurderingUtil';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AleneomsorgInfo from './AleneomsorgInfo';
import { VilkårPropsMedStønadstype } from '../vilkårprops';
import { Vilkårstittel } from '../Vilkårstittel';
import { InngangsvilkårType } from '../vilkår';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { useApp } from '../../../../App/context/AppContext';
import { IBarnMedLøpendeStønad } from './typer';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';

export const Aleneomsorg: React.FC<VilkårPropsMedStønadstype> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
    stønadstype,
    behandlingId,
}) => {
    const [barnMedLøpendeStønad, settBarnMedLøpendeStønad] = useState<
        Ressurs<IBarnMedLøpendeStønad>
    >(byggTomRessurs());
    const { axiosRequest } = useApp();

    useEffect(() => {
        if (stønadstype === Stønadstype.BARNETILSYN) {
            axiosRequest<IBarnMedLøpendeStønad, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/tilkjentytelse/barn/${behandlingId}`,
            }).then((respons: Ressurs<IBarnMedLøpendeStønad>) => {
                settBarnMedLøpendeStønad(respons);
            });
        }
    }, [axiosRequest, behandlingId, stønadstype, settBarnMedLøpendeStønad]);

    const vilkårsresultatAleneomsorg = vurderinger
        .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
        .map((v) => v.resultat);
    const utleddResultat = vilkårStatusForBarn(vilkårsresultatAleneomsorg);
    return (
        <>
            {grunnlag.barnMedSamvær.map((barn, idx) => {
                const vurdering = vurderinger.find(
                    (v) =>
                        v.barnId === barn.barnId && v.vilkårType === InngangsvilkårType.ALENEOMSORG
                );
                if (!vurdering) return null;
                return (
                    <ToKolonnerLayout key={barn.barnId}>
                        {{
                            venstre: (
                                <>
                                    {idx === 0 && (
                                        <Vilkårstittel
                                            paragrafTittel="§15-4"
                                            tittel="Aleneomsorg"
                                            vilkårsresultat={utleddResultat}
                                        />
                                    )}
                                    <AleneomsorgInfo
                                        gjeldendeBarn={barn}
                                        skalViseSøknadsdata={skalViseSøknadsdata}
                                        barnMedLøpendeStønad={barnMedLøpendeStønad}
                                        stønadstype={stønadstype}
                                    />
                                    {idx === grunnlag.barnMedSamvær.length - 1 && (
                                        <>
                                            {skalViseSøknadsdata && (
                                                <GridTabell underTabellMargin={0}>
                                                    <DokumentasjonSendtInn
                                                        dokumentasjon={
                                                            grunnlag.dokumentasjon
                                                                ?.avtaleOmDeltBosted
                                                        }
                                                        tittel={'Avtale om delt fast bosted'}
                                                    />
                                                    <DokumentasjonSendtInn
                                                        dokumentasjon={
                                                            grunnlag.dokumentasjon
                                                                ?.skalBarnetBoHosSøkerMenAnnenForelderSamarbeiderIkke
                                                        }
                                                        tittel={
                                                            'Dokumentasjon som viser at barnet bor hos deg'
                                                        }
                                                    />
                                                    <DokumentasjonSendtInn
                                                        dokumentasjon={
                                                            grunnlag.dokumentasjon?.samværsavtale
                                                        }
                                                        tittel={'Samværsavtale'}
                                                    />
                                                </GridTabell>
                                            )}
                                        </>
                                    )}
                                </>
                            ),
                            høyre: (
                                <VisEllerEndreVurdering
                                    key={vurdering.id}
                                    ikkeVurderVilkår={ikkeVurderVilkår}
                                    vurdering={vurdering}
                                    feilmelding={feilmeldinger[vurdering.id]}
                                    lagreVurdering={lagreVurdering}
                                    nullstillVurdering={nullstillVurdering}
                                />
                            ),
                        }}
                    </ToKolonnerLayout>
                );
            })}
        </>
    );
};
