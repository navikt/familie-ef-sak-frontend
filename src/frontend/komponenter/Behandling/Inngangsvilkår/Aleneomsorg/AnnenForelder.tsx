import React, { FC } from 'react';
import {
    borAnnenForelderISammeHusTilTekst,
    harSamværMedBarnTilTekst,
    harSkriftligSamværsavtaleTilTekst,
    hvorMyeSammenTilTekst,
    IAleneomsorgSøknadsgrunnlag,
    IAnnenForelderAleneomsorg,
} from './typer';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';

interface Props {
    søknadsgrunnlag: IAleneomsorgSøknadsgrunnlag;
    forelderRegister?: IAnnenForelderAleneomsorg;
}

const AnnenForelder: FC<Props> = ({ forelderRegister, søknadsgrunnlag }) => {
    const forelderSøknad = søknadsgrunnlag.forelder;

    const erNavnFnrEllerFødselsdatoUtfylt: boolean =
        forelderSøknad?.navn !== '' ||
        forelderSøknad.fødselsnummer !== '' ||
        forelderSøknad.fødselsdato !== '';

    // TODO: Legg til hvorforIkkeOppgi - Donorbarn, annet
    const annenForelderInfo: string = !erNavnFnrEllerFødselsdatoUtfylt
        ? 'Ikke fylt ut'
        : `${forelderSøknad?.navn}, ${forelderSøknad?.fødselsnummer}`;

    // TODO: legg til samme data, men fra register

    return (
        <>
            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder</Normaltekst>
            <Normaltekst>{annenForelderInfo}</Normaltekst>
            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder bor i</Normaltekst>
            <Normaltekst>
                {forelderSøknad?.bosattINorge ? 'Norge' : forelderSøknad?.land}
            </Normaltekst>
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
                    <Normaltekst>{søknadsgrunnlag.nårFlyttetDereFraHverandre}</Normaltekst>
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

export default AnnenForelder;
