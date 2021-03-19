import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableFødsesnummer } from '../../../../utils/formatter';
import { hentAnnenForelderInfo } from './utils';
import { IAnnenForelder, IBarnMedSamværSøknadsgrunnlag } from './typer';

interface Props {
    forelderRegister?: IAnnenForelder;
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

const AnnenForelderOpplysninger: FC<Props> = ({ forelderRegister, søknadsgrunnlag }) => {
    const annenForelderInfo = hentAnnenForelderInfo(
        søknadsgrunnlag.forelder,
        søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse
    );
    const forelderSøknad = søknadsgrunnlag.forelder;

    return (
        <GridTabell>
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
                {forelderSøknad?.bosattINorge ? 'Norge' : forelderSøknad?.land || '-'}
            </Normaltekst>

            <Registergrunnlag />
            <Normaltekst>Annen forelder bor i</Normaltekst>
            <Normaltekst>{forelderRegister?.bosattINorge ? 'Norge' : '-'}</Normaltekst>
        </GridTabell>
    );
};

export default AnnenForelderOpplysninger;
