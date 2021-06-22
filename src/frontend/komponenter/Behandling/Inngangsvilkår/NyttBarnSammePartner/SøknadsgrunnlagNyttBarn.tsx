import React, { FC } from 'react';
import { SøknadsgrunnlagNyttBarn } from './typer';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import LiteBarn from '../../../../ikoner/LiteBarn';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { mapBarnNavnTekst } from './utils';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../utils/utils';

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
                    <Normaltekst>
                        <AnnenForelderNavnOgFnr forelder={annenForelder} />
                    </Normaltekst>
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
