import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { IAnnenForelder, IBarnMedSamværSøknadsgrunnlag } from './typer';
import { AnnenForelderNavnOgFnr } from '../NyttBarnSammePartner/AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import styled from 'styled-components';

interface Props {
    forelderRegister?: IAnnenForelder;
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

const NavnOgIkon = styled.div`
    display: flex;

    flex-direction: row;
`;

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

    const sjekkMotPdlMatch = forelderSøknad?.fødselsnummer === forelderRegister?.fødselsnummer;

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
                                {sjekkMotPdlMatch && (
                                    <AlertStripeAdvarsel>
                                        <Normaltekst>
                                            Sjekk av manuelt innlagte opplysninger mot PDL.
                                        </Normaltekst>
                                        <Normaltekst>
                                            Fødselsnummer {forelderRegister?.fødselsnummer} tilhører
                                        </Normaltekst>
                                        <NavnOgIkon>
                                            <Registergrunnlag />
                                            <Normaltekst>{forelderRegister?.navn}</Normaltekst>
                                        </NavnOgIkon>
                                    </AlertStripeAdvarsel>
                                )}
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
        </GridTabell>
    );
};

export default AnnenForelderOpplysninger;
