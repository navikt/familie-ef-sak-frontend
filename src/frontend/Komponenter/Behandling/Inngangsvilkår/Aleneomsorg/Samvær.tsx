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
import { TabellIkon } from '../../Vilkårpanel/TabellVisning';

interface Props {
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

const Samvær: FC<Props> = ({ søknadsgrunnlag }) => {
    return (
        <>
            {søknadsgrunnlag.spørsmålAvtaleOmDeltBosted !== undefined &&
                søknadsgrunnlag.spørsmålAvtaleOmDeltBosted != null && (
                    <Informasjonsrad
                        ikon={TabellIkon.SØKNAD}
                        label="Skriftlig avtale om delt fast bosted"
                        verdi={mapTrueFalse(søknadsgrunnlag.spørsmålAvtaleOmDeltBosted)}
                    />
                )}
            {søknadsgrunnlag.skalAnnenForelderHaSamvær && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
                    label="Annen forelders samvær"
                    verdi={harSamværMedBarnTilTekst[søknadsgrunnlag.skalAnnenForelderHaSamvær]}
                />
            )}
            {søknadsgrunnlag.harDereSkriftligAvtaleOmSamvær && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
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
                    ikon={TabellIkon.SØKNAD}
                    label="Praktisering av samværet"
                    verdi={søknadsgrunnlag.hvordanPraktiseresSamværet}
                />
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHus && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
                    label="Foreldre har nære boforhold"
                    verdi={
                        borAnnenForelderISammeHusTilTekst[søknadsgrunnlag.borAnnenForelderISammeHus]
                    }
                />
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
                    label="Beskrivelse av boforhold"
                    verdi={søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse}
                />
            )}
            {søknadsgrunnlag.harDereTidligereBoddSammen !== null &&
                søknadsgrunnlag.harDereTidligereBoddSammen !== undefined && (
                    <Informasjonsrad
                        ikon={TabellIkon.SØKNAD}
                        label="Foreldrene har bodd sammen tidligere"
                        verdi={mapTrueFalse(søknadsgrunnlag.harDereTidligereBoddSammen)}
                    />
                )}
            {søknadsgrunnlag.nårFlyttetDereFraHverandre && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
                    label="Fraflyttingsdato"
                    verdi={formaterNullableIsoDato(søknadsgrunnlag.nårFlyttetDereFraHverandre)}
                />
            )}
            {søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
                    label="Kontakt mellom foreldrene"
                    verdi={hvorMyeSammenTilTekst[søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder]}
                />
            )}
            {søknadsgrunnlag.beskrivSamværUtenBarn && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
                    label="Beskrivelse av kontakt"
                    verdi={søknadsgrunnlag.beskrivSamværUtenBarn}
                />
            )}
        </>
    );
};

export default Samvær;
