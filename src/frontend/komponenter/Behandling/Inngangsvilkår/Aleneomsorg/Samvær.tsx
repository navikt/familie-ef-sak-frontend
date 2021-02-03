import React, { FC } from 'react';
import {
    borAnnenForelderISammeHusTilTekst,
    harSamværMedBarnTilTekst,
    harSkriftligSamværsavtaleTilTekst,
    hvorMyeSammenTilTekst,
    IBarnMedSamværSøknadsgrunnlag,
    IAnnenForelder,
} from './typer';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import { hentAnnenForelderInfo } from './utils';
import { formaterNullableFødsesnummer, formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
    forelderRegister?: IAnnenForelder;
}

const Samvær: FC<Props> = ({ forelderRegister, søknadsgrunnlag }) => {
    const annenForelderInfo = hentAnnenForelderInfo(
        søknadsgrunnlag.forelder,
        søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse
    );
    const forelderSøknad = søknadsgrunnlag.forelder;
    return (
        <>
            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder</Normaltekst>
            <Normaltekst>{annenForelderInfo}</Normaltekst>

            <Registergrunnlag />
            <Normaltekst>Annen forelder</Normaltekst>
            <Normaltekst>
                {forelderRegister
                    ? `${forelderRegister.navn} - ${formaterNullableFødsesnummer(
                          forelderRegister.fødselsnummer
                      )}`
                    : '-'}
            </Normaltekst>

            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder bor i</Normaltekst>
            <Normaltekst>
                {forelderSøknad?.bosattINorge ? 'Norge' : forelderSøknad?.land}
            </Normaltekst>

            <Registergrunnlag />
            <Normaltekst>Annen forelder bor i</Normaltekst>
            <Normaltekst>{forelderRegister?.bosattINorge ? 'Norge' : '-'}</Normaltekst>

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
        </>
    );
};

export default Samvær;
