import React, { FC } from 'react';
import { SøknadsgrunnlagNyttBarn } from './typer';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import LiteBarn from '../../../../ikoner/LiteBarn';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { mapBarnNavnTekst } from './utils';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';

interface Props {
    barn: SøknadsgrunnlagNyttBarn;
}

const SøknadgrunnlagNyttBarn: FC<Props> = ({ barn }) => {
    const annenForelder =
        barn.annenForelderRegister && barn.annenForelderSoknad
            ? barn.annenForelderRegister
            : barn.annenForelderSoknad;

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
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Annen forelder lagt til i søknad</Normaltekst>
                <Normaltekst>
                    {annenForelder ? (
                        <AnnenForelderNavnOgFnr forelder={annenForelder} />
                    ) : (
                        <>
                            {barn.ikkeOppgittAnnenForelderBegrunnelse
                                ? `Ikke oppgitt: ${barn.ikkeOppgittAnnenForelderBegrunnelse}`
                                : '-'}
                        </>
                    )}
                </Normaltekst>
            </>
        </GridTabell>
    );
};

export default SøknadgrunnlagNyttBarn;
