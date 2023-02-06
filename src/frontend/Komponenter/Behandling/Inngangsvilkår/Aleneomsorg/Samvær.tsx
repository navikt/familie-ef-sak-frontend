import React, { FC } from 'react';
import {
    borAnnenForelderISammeHusTilTekst,
    harSamværMedBarnTilTekst,
    harSkriftligSamværsavtaleTilTekst,
    hvorMyeSammenTilTekst,
    IBarnMedSamværSøknadsgrunnlag,
} from './typer';
import { formaterNullableIsoDato, mapTrueFalse } from '../../../../App/utils/formatter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

const Samvær: FC<Props> = ({ søknadsgrunnlag }) => {
    return (
        <>
            {søknadsgrunnlag.spørsmålAvtaleOmDeltBosted !== undefined &&
                søknadsgrunnlag.spørsmålAvtaleOmDeltBosted != null && (
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Skriftlig avtale om delt fast bosted"
                        verdi={mapTrueFalse(søknadsgrunnlag.spørsmålAvtaleOmDeltBosted)}
                    />
                )}
            {søknadsgrunnlag.skalAnnenForelderHaSamvær && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Annen forelders samvær"
                    verdi={harSamværMedBarnTilTekst[søknadsgrunnlag.skalAnnenForelderHaSamvær]}
                />
            )}
            {søknadsgrunnlag.harDereSkriftligAvtaleOmSamvær && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Skriftlig samværsavtale"
                    verdi={
                        harSkriftligSamværsavtaleTilTekst[
                            søknadsgrunnlag.harDereSkriftligAvtaleOmSamvær
                        ]
                    }
                />
            )}
            {søknadsgrunnlag.hvordanPraktiseresSamværet && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Praktisering av samværet"
                    verdi={søknadsgrunnlag.hvordanPraktiseresSamværet}
                />
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHus && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Foreldre har nære boforhold"
                    verdi={
                        borAnnenForelderISammeHusTilTekst[søknadsgrunnlag.borAnnenForelderISammeHus]
                    }
                />
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Beskrivelse av boforhold"
                    verdi={søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse}
                />
            )}
            {søknadsgrunnlag.harDereTidligereBoddSammen !== null &&
                søknadsgrunnlag.harDereTidligereBoddSammen !== undefined && (
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Foreldrene har bodd sammen tidligere"
                        verdi={mapTrueFalse(søknadsgrunnlag.harDereTidligereBoddSammen)}
                    />
                )}
            {søknadsgrunnlag.nårFlyttetDereFraHverandre && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Fraflyttingsdato"
                    verdi={formaterNullableIsoDato(søknadsgrunnlag.nårFlyttetDereFraHverandre)}
                />
            )}
            {søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Kontakt mellom foreldrene"
                    verdi={hvorMyeSammenTilTekst[søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder]}
                />
            )}
            {søknadsgrunnlag.beskrivSamværUtenBarn && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Beskrivelse av kontakt"
                    verdi={søknadsgrunnlag.beskrivSamværUtenBarn}
                />
            )}
        </>
    );
};

export default Samvær;
