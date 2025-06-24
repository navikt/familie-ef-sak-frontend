import React, { useEffect, useState } from 'react';
import { vilkårStatusForBarn } from '../../Vurdering/VurderingUtil';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AleneomsorgInfo from './AleneomsorgInfo';
import { VilkårPropsAleneomsorg } from '../vilkårprops';
import { InngangsvilkårType } from '../vilkår';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { useApp } from '../../../../App/context/AppContext';
import { IBarnMedLøpendeStønad } from './typer';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { SamværskalkulatorAleneomsorg } from './SamværskalkulatorAleneomsorg';
import { useBehandling } from '../../../../App/context/BehandlingContext';

export const Aleneomsorg: React.FC<VilkårPropsAleneomsorg> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
    behandling,
    lagredeSamværsavtaler,
    lagreSamværsavtale,
    slettSamværsavtale,
}) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const [barnMedLøpendeStønad, settBarnMedLøpendeStønad] =
        useState<Ressurs<IBarnMedLøpendeStønad>>(byggTomRessurs());

    useEffect(() => {
        if (behandling.stønadstype === Stønadstype.BARNETILSYN) {
            axiosRequest<IBarnMedLøpendeStønad, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/tilkjentytelse/barn/${behandling.id}`,
            }).then((respons: Ressurs<IBarnMedLøpendeStønad>) => {
                settBarnMedLøpendeStønad(respons);
            });
        }
    }, [axiosRequest, behandling.stønadstype, behandling.id, settBarnMedLøpendeStønad]);

    const inngangsvilkårAleneomsorg = vurderinger.filter(
        (vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG
    );

    const vilkårsresultatAleneomsorg = inngangsvilkårAleneomsorg.map((v) => v.resultat);

    const utleddResultat = vilkårStatusForBarn(vilkårsresultatAleneomsorg);

    return (
        <Vilkårpanel
            paragrafTittel="§15-4"
            tittel="Aleneomsorg"
            vilkårsresultat={utleddResultat}
            vilkår={InngangsvilkårType.ALENEOMSORG}
        >
            {grunnlag.barnMedSamvær.map((barn, indeks) => {
                const vurdering = vurderinger.find(
                    (v) =>
                        v.barnId === barn.barnId && v.vilkårType === InngangsvilkårType.ALENEOMSORG
                );
                if (!vurdering) return null;

                const erSisteBarn = indeks === grunnlag.barnMedSamvær.length - 1;

                const skalViseBorderBottom =
                    indeks !== grunnlag.barnMedSamvær.length - 1 &&
                    grunnlag.barnMedSamvær.length > 1;

                const lagretSamværsavtale = lagredeSamværsavtaler.find(
                    (avtale) => avtale.behandlingBarnId === barn.barnId
                );

                const vilkårpanelSkalViseBorderBottom =
                    !behandlingErRedigerbar && !lagretSamværsavtale && skalViseBorderBottom;

                return (
                    <React.Fragment key={barn.barnId}>
                        <VilkårpanelInnhold borderBottom={vilkårpanelSkalViseBorderBottom}>
                            {{
                                venstre: (
                                    <>
                                        <AleneomsorgInfo
                                            gjeldendeBarn={barn}
                                            skalViseSøknadsdata={skalViseSøknadsdata}
                                            barnMedLøpendeStønad={barnMedLøpendeStønad}
                                            stønadstype={behandling.stønadstype}
                                            personalia={grunnlag.personalia}
                                        />
                                        {erSisteBarn && skalViseSøknadsdata && (
                                            <>
                                                <DokumentasjonSendtInn
                                                    dokumentasjon={
                                                        grunnlag.dokumentasjon?.avtaleOmDeltBosted
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
                        <SamværskalkulatorAleneomsorg
                            gjeldendeBehandlingBarnId={barn.barnId}
                            behandlingId={behandling.id}
                            lagredeSamværsavtaler={lagredeSamværsavtaler}
                            lagreSamværsavtale={lagreSamværsavtale}
                            slettSamværsavtale={slettSamværsavtale}
                            alleBehandlingBarn={grunnlag.barnMedSamvær}
                            skalViseBorderBottom={skalViseBorderBottom}
                        />
                    </React.Fragment>
                );
            })}
        </Vilkårpanel>
    );
};
