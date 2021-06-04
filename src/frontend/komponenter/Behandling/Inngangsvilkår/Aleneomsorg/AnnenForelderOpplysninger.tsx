import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { IAnnenForelder, IBarnMedSamværSøknadsgrunnlag } from './typer';
import { AnnenForelderNavnOgFnr } from '../NyttBarnSammePartner/AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../utils/utils';

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

    return (
        <GridTabell>
            {((forelderSøknad && harNavnFødselsdatoEllerFnr(forelderSøknad)) ||
                harVerdi(søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse)) && (
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

            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder bor i</Normaltekst>
            <Normaltekst>
                {forelderSøknad?.bosattINorge ? 'Norge' : forelderSøknad?.land || '-'}
            </Normaltekst>

            <Registergrunnlag />
            <Normaltekst>Annen forelder bor i</Normaltekst>
            <Normaltekst>{forelderRegister?.bosattINorge ? 'Norge' : '-'}</Normaltekst>
        </GridTabell>
    );
};

export default AnnenForelderOpplysninger;
