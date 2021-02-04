import React, { FC } from 'react';
import {
    borAnnenForelderISammeHusTilTekst,
    harSamværMedBarnTilTekst,
    harSkriftligSamværsavtaleTilTekst,
    hvorMyeSammenTilTekst,
    IBarnMedSamværSøknadsgrunnlag,
} from './typer';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';

interface Props {
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

const Samvær: FC<Props> = ({ søknadsgrunnlag }) => {
    return (
        <StyledTabell>
            {søknadsgrunnlag.spørsmålAvtaleOmDeltBosted !== undefined && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Skriftlig avtale om delt fast bosted</Normaltekst>
                    <BooleanTekst value={søknadsgrunnlag.spørsmålAvtaleOmDeltBosted} />
                </>
            )}
            {søknadsgrunnlag.skalAnnenForelderHaSamvær && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Annen forelders samvær</Normaltekst>
                    <Normaltekst>
                        {harSamværMedBarnTilTekst[søknadsgrunnlag.skalAnnenForelderHaSamvær]}
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.harDereSkriftligAvtaleOmSamvær && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Skriftlig samværsavtale</Normaltekst>
                    <Normaltekst>
                        {
                            harSkriftligSamværsavtaleTilTekst[
                                søknadsgrunnlag.harDereSkriftligAvtaleOmSamvær
                            ]
                        }
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.hvordanPraktiseresSamværet && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Praktisering av samværet</Normaltekst>
                    <Normaltekst>{søknadsgrunnlag.hvordanPraktiseresSamværet}</Normaltekst>
                </>
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHus && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Foreldre har nære boforhold</Normaltekst>
                    <Normaltekst>
                        {
                            borAnnenForelderISammeHusTilTekst[
                                søknadsgrunnlag.borAnnenForelderISammeHus
                            ]
                        }
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Bo begrunnelse</Normaltekst>
                    <Normaltekst>
                        {søknadsgrunnlag.borAnnenForelderISammeHusBeskrivelse}
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.harDereTidligereBoddSammen && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Foreldre har bodd sammen</Normaltekst>
                    <BooleanTekst value={søknadsgrunnlag.harDereTidligereBoddSammen} />
                </>
            )}
            {søknadsgrunnlag.nårFlyttetDereFraHverandre && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Fraflyttingsdato</Normaltekst>
                    <Normaltekst>
                        {formaterNullableIsoDato(søknadsgrunnlag.nårFlyttetDereFraHverandre)}
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Foreldres kontakt</Normaltekst>
                    <Normaltekst>
                        {hvorMyeSammenTilTekst[søknadsgrunnlag.hvorMyeErDuSammenMedAnnenForelder]}
                    </Normaltekst>
                </>
            )}
            {søknadsgrunnlag.beskrivSamværUtenBarn && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Kontakt begrunnelse</Normaltekst>
                    <Normaltekst>{søknadsgrunnlag.beskrivSamværUtenBarn}</Normaltekst>
                </>
            )}
        </StyledTabell>
    );
};

export default Samvær;
