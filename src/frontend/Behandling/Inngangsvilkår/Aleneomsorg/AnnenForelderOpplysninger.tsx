import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { IAnnenForelder, IBarnMedSamværSøknadsgrunnlag } from './typer';
import { AnnenForelderNavnOgFnr } from '../NyttBarnSammePartner/AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../utils/utils';
import { formaterNullableIsoDato } from '../../../utils/formatter';

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
                            <AnnenForelderNavnOgFnr forelder={forelderSøknad} />
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

            {forelderRegister && harNavnFødselsdatoEllerFnr(forelderRegister) && (
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

                    {forelderRegister && harNavnFødselsdatoEllerFnr(forelderRegister) && (
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
        </GridTabell>
    );
};

export default AnnenForelderOpplysninger;
