import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { IAnnenForelder, IBarnMedSamværSøknadsgrunnlag } from './typer';
import { AnnenForelderNavnogFnr } from '../NyttBarnSammePartner/AnnenForelderNavnOgFnr';
import { AnnenForelderSøknad } from './AnnenForelderSøknad';

interface Props {
    forelderRegister?: IAnnenForelder;
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

const AnnenForelderOpplysninger: FC<Props> = ({ forelderRegister, søknadsgrunnlag }) => {
    const forelderSøknad = søknadsgrunnlag.forelder;

    return (
        <GridTabell>
            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder</Normaltekst>
            <Normaltekst>
                <AnnenForelderSøknad
                    forelder={søknadsgrunnlag.forelder}
                    ikkeOppgittAnnenForelderBegrunnelse={
                        søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse
                    }
                />
            </Normaltekst>

            <Registergrunnlag />
            <Normaltekst>Annen forelder</Normaltekst>
            <Normaltekst>
                {forelderRegister ? <AnnenForelderNavnogFnr forelder={forelderRegister} /> : '-'}
            </Normaltekst>

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
