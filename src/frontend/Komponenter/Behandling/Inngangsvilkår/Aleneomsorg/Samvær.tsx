import React, { FC } from 'react';
import {
    borAnnenForelderISammeHusTilTekst,
    harSamværMedBarnTilTekst,
    harSkriftligSamværsavtaleTilTekst,
    hvorMyeSammenTilTekst,
    IBarnMedSamværSøknadsgrunnlag,
} from './typer';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

const Samvær: FC<Props> = ({ søknadsgrunnlag }) => {
    return (
        <GridTabell>
            {søknadsgrunnlag.spørsmålAvtaleOmDeltBosted !== undefined &&
                søknadsgrunnlag.spørsmålAvtaleOmDeltBosted != null && (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>Skriftlig avtale om delt fast bosted</BodyShortSmall>
                        <BooleanTekst value={søknadsgrunnlag.spørsmålAvtaleOmDeltBosted} />
                    </>
                )}
            {søknadsgrunnlag.skalAnnenForelderHaSamvær && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Annen forelders samvær</BodyShortSmall>
                    <BodyShortSmall>
                        {harSamværMedBarnTilTekst[søknadsgrunnlag.skalAnnenForelderHaSamvær]}
                    </BodyShortSmall>
                </>
            )}
            {søknadsgrunnlag.harDereSkriftligAvtaleOmSamvær && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Skriftlig samværsavtale</BodyShortSmall>
                    <BodyShortSmall>
                        {
                            harSkriftligSamværsavtaleTilTekst[
                                søknadsgrunnlag.harDereSkriftligAvtaleOmSamvær
                            ]
                        }
                    </BodyShortSmall>
                </>
            )}
            {søknadsgrunnlag.hvordanPraktiseresSamværet && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Praktisering av samværet</BodyShortSmall>
                    <BodyShortSmall>{søknadsgrunnlag.hvordanPraktiseresSamværet}</BodyShortSmall>
                </>
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHus && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Foreldre har nære boforhold</BodyShortSmall>
                    <BodyShortSmall>
                        {
                            borAnnenForelderISammeHusTilTekst[
                                søknadsgrunnlag.borAnnenForelderISammeHus
                            ]
                        }
                    </BodyShortSmall>
                </>
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Beskrivelse av boforhold</BodyShortSmall>
                    <BodyShortSmall>
                        {søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse}
                    </BodyShortSmall>
                </>
            )}
            {søknadsgrunnlag.harDereTidligereBoddSammen !== null &&
                søknadsgrunnlag.harDereTidligereBoddSammen !== undefined && (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>Foreldrene har bodd sammen tidligere</BodyShortSmall>
                        <BooleanTekst value={søknadsgrunnlag.harDereTidligereBoddSammen} />
                    </>
                )}
            {søknadsgrunnlag.nårFlyttetDereFraHverandre && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Fraflyttingsdato</BodyShortSmall>
                    <BodyShortSmall>
                        {formaterNullableIsoDato(søknadsgrunnlag.nårFlyttetDereFraHverandre)}
                    </BodyShortSmall>
                </>
            )}
            {søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Kontakt mellom foreldrene</BodyShortSmall>
                    <BodyShortSmall>
                        {hvorMyeSammenTilTekst[søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder]}
                    </BodyShortSmall>
                </>
            )}
            {søknadsgrunnlag.beskrivSamværUtenBarn && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Beskrivelse av kontakt</BodyShortSmall>
                    <BodyShortSmall>{søknadsgrunnlag.beskrivSamværUtenBarn}</BodyShortSmall>
                </>
            )}
        </GridTabell>
    );
};

export default Samvær;
