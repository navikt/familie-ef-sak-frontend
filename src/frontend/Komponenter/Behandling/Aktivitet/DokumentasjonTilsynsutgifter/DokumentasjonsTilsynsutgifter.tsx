import React from 'react';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
import TilsynsutgifterBarnInfo from './TilsynsutgifterBarnInfo';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';

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
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            tittel="Dokumentasjon av tilsynsutgifter"
                            vilkårsresultat={vurdering.resultat}
                        />
                        {grunnlag.barnMedSamvær.map((barn, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <TilsynsutgifterBarnInfo
                                        gjeldendeBarn={barn}
                                        skalViseSøknadsdata={skalViseSøknadsdata}
                                    />
                                    {index === grunnlag.barnMedSamvær.length - 1 && (
                                        <>
                                            {skalViseSøknadsdata && (
                                                <>
                                                    <DokumentasjonSendtInn
                                                        dokumentasjon={
                                                            grunnlag.dokumentasjon
                                                                ?.avtaleBarnepasser
                                                        }
                                                        tittel={'Avtalen du har med barnepasseren'}
                                                    />
                                                    <DokumentasjonSendtInn
                                                        dokumentasjon={
                                                            grunnlag.dokumentasjon
                                                                ?.barnepassordningFaktura
                                                        }
                                                        tittel={
                                                            'Faktura fra barnepassordningen for perioden du søker om nå'
                                                        }
                                                    />
                                                </>
                                            )}
                                        </>
                                    )}
                                </React.Fragment>
                            );
                        })}
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
};
