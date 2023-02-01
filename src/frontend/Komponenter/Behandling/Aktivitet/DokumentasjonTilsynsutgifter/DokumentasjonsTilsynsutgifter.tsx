import React from 'react';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import TilsynsutgifterBarnInfo from './TilsynsutgifterBarnInfo';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';

export const DokumentasjonsTilsynsutgifter: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === AktivitetsvilkårType.DOKUMENTASJON_TILSYNSUTGIFTER
    );

    if (!vurdering) {
        return (
            <AlertError>
                Noe er galt - det finnes ingen vilkår for dokumentasjon av tilsynsutgifter
            </AlertError>
        );
    }

    return (
        <Vilkårpanel
            tittel="Dokumentasjon av tilsynsutgifter"
            vilkårsresultat={vurdering.resultat}
            vilkår={vurdering.vilkårType}
        >
            <VilkårpanelInnhold>
                {{
                    venstre: grunnlag.barnMedSamvær.map((barn, index) => {
                        const erSisteBarn = index === grunnlag.barnMedSamvær.length - 1;
                        return (
                            <React.Fragment key={index}>
                                <TilsynsutgifterBarnInfo
                                    gjeldendeBarn={barn}
                                    skalViseSøknadsdata={skalViseSøknadsdata}
                                />
                                {erSisteBarn && skalViseSøknadsdata && (
                                    <>
                                        <DokumentasjonSendtInn
                                            dokumentasjon={
                                                grunnlag.dokumentasjon?.avtaleBarnepasser
                                            }
                                            tittel={'Avtalen du har med barnepasseren'}
                                        />
                                        <DokumentasjonSendtInn
                                            dokumentasjon={
                                                grunnlag.dokumentasjon?.barnepassordningFaktura
                                            }
                                            tittel={
                                                'Faktura fra barnepassordningen for perioden du søker om nå'
                                            }
                                        />
                                    </>
                                )}
                            </React.Fragment>
                        );
                    }),
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
        </Vilkårpanel>
    );
};
