import React from 'react';
import { vilkårStatusForBarn } from '../../Vurdering/VurderingUtil';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import AlderPåBarnInfo from './AlderPåBarnInfo';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { EAktivitetsvilkår } from '../../../../App/context/EkspanderbareVilkårpanelContext';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';

export const AlderPåBarn: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
}) => {
    const vilkårsresultatAlderPåBarn = vurderinger
        .filter((vurdering) => vurdering.vilkårType === AktivitetsvilkårType.ALDER_PÅ_BARN)
        .map((v) => v.resultat);
    const utleddResultat = vilkårStatusForBarn(vilkårsresultatAlderPåBarn);

    return (
        <Vilkårpanel
            paragrafTittel="§15-10"
            tittel="Alder på barn"
            vilkårsresultat={utleddResultat}
            vilkår={EAktivitetsvilkår.ALDER_PÅ_BARN}
            innhold={
                <>
                    {grunnlag.barnMedSamvær.map((barn, idx) => {
                        const vurdering = vurderinger.find(
                            (v) =>
                                v.barnId === barn.barnId &&
                                v.vilkårType === AktivitetsvilkårType.ALDER_PÅ_BARN
                        );

                        if (!vurdering && barn.barnepass?.skalHaBarnepass) {
                            return (
                                <AlertError>
                                    Noe er galt - det finnes ingen vilkår for dette barnets alder
                                </AlertError>
                            );
                        } else if (!vurdering) return null;

                        return (
                            <VilkårpanelInnhold
                                key={barn.barnId}
                                borderBottom={
                                    idx !== grunnlag.barnMedSamvær.length - 1 &&
                                    grunnlag.barnMedSamvær.length > 1
                                }
                            >
                                {{
                                    venstre: (
                                        <>
                                            <AlderPåBarnInfo
                                                gjeldendeBarn={barn}
                                                skalViseSøknadsdata={skalViseSøknadsdata}
                                            />
                                            {idx === grunnlag.barnMedSamvær.length - 1 && (
                                                <>
                                                    {skalViseSøknadsdata && (
                                                        <>
                                                            <DokumentasjonSendtInn
                                                                dokumentasjon={
                                                                    grunnlag.dokumentasjon
                                                                        ?.spesielleBehov
                                                                }
                                                                tittel={
                                                                    'Dokumentasjon som viser at barnet ditt har behov for vesentlig mer pass enn det som er vanlig for jevnaldrende'
                                                                }
                                                            />
                                                            <DokumentasjonSendtInn
                                                                dokumentasjon={
                                                                    grunnlag.dokumentasjon
                                                                        ?.roterendeArbeidstid
                                                                }
                                                                tittel={
                                                                    'Dokumentasjon som viser at du jobber turnus eller skift, og jobber på tider utenom vanlig arbeidstid'
                                                                }
                                                            />
                                                            <DokumentasjonSendtInn
                                                                dokumentasjon={
                                                                    grunnlag.dokumentasjon
                                                                        ?.arbeidstid
                                                                }
                                                                tittel={
                                                                    'Dokumentasjon som viser at du må være borte fra hjemmet i lengre perioder på grunn av jobb'
                                                                }
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
