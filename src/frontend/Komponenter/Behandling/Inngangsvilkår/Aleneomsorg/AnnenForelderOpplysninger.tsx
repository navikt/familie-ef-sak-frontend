import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import {
    avstandTilSøkerTekst,
    EAvstandTilSøker,
    IAnnenForelder,
    IAvstandTilSøker,
    IBarnMedSamværSøknadsgrunnlag,
} from './typer';
import { AnnenForelderNavnOgFnr } from '../NyttBarnSammePartner/AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';

interface Props {
    forelderRegister?: IAnnenForelder;
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

const AnnenForelderOpplysninger: FC<Props> = ({ forelderRegister, søknadsgrunnlag }) => {
    const forelderSøknad = søknadsgrunnlag.forelder;

    const harNavnFødselsdatoEllerFnr = (forelder: IAnnenForelder): boolean =>
        harVerdi(forelder.navn) ||
        harVerdi(forelder.fødselsnummer) ||
        harVerdi(forelder.fødselsdato);

    const utledAvstandTilSøkerTekst = (avstandTilSøker: IAvstandTilSøker): string => {
        switch (avstandTilSøker.langAvstandTilSøker) {
            case EAvstandTilSøker.JA:
                return avstandTilSøker.avstandIKm + ' km';
            default:
                return avstandTilSøkerTekst[avstandTilSøker.langAvstandTilSøker];
        }
    };
    const visForelderSøknadInfo =
        !forelderRegister?.dødsfall &&
        ((forelderSøknad && harNavnFødselsdatoEllerFnr(forelderSøknad)) ||
            harVerdi(søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse));

    return (
        <GridTabell>
            {visForelderSøknadInfo && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Annen forelder</Normaltekst>
                    <Normaltekst>
                        {forelderSøknad &&
                        harNavnFødselsdatoEllerFnr(forelderSøknad) &&
                        !søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse ? (
                            <>
                                <AnnenForelderNavnOgFnr forelder={forelderSøknad} />
                            </>
                        ) : (
                            <>
                                {søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse
                                    ? `Ikke oppgitt: ${søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse}`
                                    : '-'}
                            </>
                        )}
                    </Normaltekst>
                </>
            )}

            {!visForelderSøknadInfo &&
                forelderRegister &&
                harNavnFødselsdatoEllerFnr(forelderRegister) && (
                    <>
                        <Registergrunnlag />
                        <Normaltekst>Annen forelder</Normaltekst>
                        <Normaltekst>
                            {forelderRegister ? (
                                <AnnenForelderNavnOgFnr forelder={forelderRegister} />
                            ) : (
                                '-'
                            )}
                        </Normaltekst>
                    </>
                )}

            {forelderRegister?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <Normaltekst>Annen forelder dødsdato</Normaltekst>
                    <Normaltekst>{formaterNullableIsoDato(forelderRegister.dødsfall)}</Normaltekst>
                </>
            )}
            {!forelderRegister?.dødsfall && (
                <>
                    {forelderSøknad && harNavnFødselsdatoEllerFnr(forelderSøknad) && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Annen forelder bor i</Normaltekst>
                            <Normaltekst>
                                {forelderSøknad?.bosattINorge
                                    ? 'Norge'
                                    : forelderSøknad?.land || '-'}
                            </Normaltekst>
                        </>
                    )}

                    {!visForelderSøknadInfo &&
                        forelderRegister &&
                        harNavnFødselsdatoEllerFnr(forelderRegister) && (
                            <>
                                <Registergrunnlag />
                                <Normaltekst>Annen forelder bor i</Normaltekst>
                                <Normaltekst>
                                    {forelderRegister?.bosattINorge
                                        ? 'Norge'
                                        : forelderRegister.land || '-'}
                                </Normaltekst>
                            </>
                        )}
                </>
            )}

            {!forelderRegister?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <Normaltekst>Annen forelder automatisk beregnet avstand til søker</Normaltekst>
                    <Normaltekst>
                        {forelderRegister &&
                            utledAvstandTilSøkerTekst(forelderRegister?.avstandTilSøker)}
                    </Normaltekst>
                </>
            )}
        </GridTabell>
    );
};

export default AnnenForelderOpplysninger;
