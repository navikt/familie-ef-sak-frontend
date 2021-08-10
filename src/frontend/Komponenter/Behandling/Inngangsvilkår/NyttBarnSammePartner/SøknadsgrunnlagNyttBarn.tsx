import React, { FC } from 'react';
import { SøknadsgrunnlagNyttBarn } from './typer';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import LiteBarn from '../../../../Felles/Ikoner/LiteBarn';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { mapBarnNavnTekst } from './utils';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';

interface Props {
    barn: SøknadsgrunnlagNyttBarn;
}

const SøknadgrunnlagNyttBarn: FC<Props> = ({ barn }) => {
    const annenForelder =
        barn.annenForelderRegister && barn.annenForelderSoknad
            ? barn.annenForelderRegister
            : barn.annenForelderSoknad;

    const ikkeOppgittAnnenForelderBegrunnelse = barn.ikkeOppgittAnnenForelderBegrunnelse;

    return (
        <GridTabell>
            <>
                <LiteBarn />
                <Element tag="h4">{mapBarnNavnTekst(barn)}</Element>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Termindato</Normaltekst>
                <Normaltekst>{formaterNullableIsoDato(barn.fødselTermindato)}</Normaltekst>
            </>
            {annenForelder && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Annen forelder lagt til i søknad</Normaltekst>
                    <AnnenForelderNavnOgFnr forelder={annenForelder} />
                </>
            )}
            {harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Annen forelder</Normaltekst>
                    <Normaltekst>
                        {ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                            ? ikkeOppgittAnnenForelderBegrunnelse
                            : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`}
                    </Normaltekst>
                </>
            )}
        </GridTabell>
    );
};

export default SøknadgrunnlagNyttBarn;
