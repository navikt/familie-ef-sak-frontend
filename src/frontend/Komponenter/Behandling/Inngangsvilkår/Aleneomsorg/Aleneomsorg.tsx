import React, { useEffect, useState } from 'react';
import { vilkårStatusAleneomsorg } from '../../Vurdering/VurderingUtil';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AleneomsorgInfo from './AleneomsorgInfo';
import { VilkårPropsMedStønadstype } from '../vilkårprops';
import { Vilkårstittel } from '../Vilkårstittel';
import { InngangsvilkårType } from '../vilkår';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { useApp } from '../../../../App/context/AppContext';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';

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
    const [barnMedLøpendeStønad, settBarnMedLøpendeStønad] = useState<Ressurs<string[]>>(
        byggTomRessurs()
    );
    const { axiosRequest } = useApp();

    useEffect(() => {
        if (stønadstype === Stønadstype.BARNETILSYN) {
            axiosRequest<string[], null>({
                method: 'GET',
                url: `/familie-ef-sak/api/tilkjentytelse/barn/${behandlingId}`,
            }).then((respons: Ressurs<string[]>) => {
                settBarnMedLøpendeStønad(respons);
            });
        }
    }, [axiosRequest, behandlingId, stønadstype, settBarnMedLøpendeStønad]);

    const vilkårsresultatAleneomsorg = vurderinger
        .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
        .map((v) => v.resultat);
    const utleddResultat = vilkårStatusAleneomsorg(vilkårsresultatAleneomsorg);
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
                                    <DataViewer response={{ barnMedLøpendeStønad }}>
                                        {({ barnMedLøpendeStønad }) => {
                                            return (
                                                <AleneomsorgInfo
                                                    gjeldendeBarn={barn}
                                                    skalViseSøknadsdata={skalViseSøknadsdata}
                                                    stønadstype={stønadstype}
                                                    barnMedLøpendeStønad={barnMedLøpendeStønad}
                                                />
                                            );
                                        }}
                                    </DataViewer>
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
