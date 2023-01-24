import React, { useEffect, useState } from 'react';
import { vilkårStatusForBarn } from '../../Vurdering/VurderingUtil';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AleneomsorgInfo from './AleneomsorgInfo';
import { VilkårPropsMedStønadstype } from '../vilkårprops';
import { InngangsvilkårType } from '../vilkår';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { useApp } from '../../../../App/context/AppContext';
import { IBarnMedLøpendeStønad } from './typer';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';

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
        <Vilkårpanel
            paragrafTittel="§15-4"
            tittel="Aleneomsorg"
            vilkårsresultat={utleddResultat}
            innhold={
                <>
                    {grunnlag.barnMedSamvær.map((barn, indeks) => {
                        const vurdering = vurderinger.find(
                            (v) =>
                                v.barnId === barn.barnId &&
                                v.vilkårType === InngangsvilkårType.ALENEOMSORG
                        );
                        if (!vurdering) return <></>;

                        return (
                            <VilkårpanelInnhold key={barn.barnId}>
                                {{
                                    venstre: (
                                        <>
                                            <AleneomsorgInfo
                                                gjeldendeBarn={barn}
                                                skalViseSøknadsdata={skalViseSøknadsdata}
                                                barnMedLøpendeStønad={barnMedLøpendeStønad}
                                                stønadstype={stønadstype}
                                            />
                                            {indeks === grunnlag.barnMedSamvær.length - 1 && (
                                                <>
                                                    {skalViseSøknadsdata && (
                                                        <>
                                                            <DokumentasjonSendtInn
                                                                dokumentasjon={
                                                                    grunnlag.dokumentasjon
                                                                        ?.avtaleOmDeltBosted
                                                                }
                                                                tittel={
                                                                    'Avtale om delt fast bosted'
                                                                }
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
                                                                    grunnlag.dokumentasjon
                                                                        ?.samværsavtale
                                                                }
                                                                tittel={'Samværsavtale'}
                                                            />
                                                        </>
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
                            </VilkårpanelInnhold>
                        );
                    })}
                </>
            }
        />
    );
};
