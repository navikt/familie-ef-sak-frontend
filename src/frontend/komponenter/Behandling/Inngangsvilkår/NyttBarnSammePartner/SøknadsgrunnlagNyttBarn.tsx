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
    return (
        <GridTabell>
            <>
                <LiteBarn />
                <Element>{mapBarnNavnTekst(barn)}</Element>
            </>
            <>
                <Søknadsgrunnlag />
                <Element>Termindato</Element>
                <Normaltekst>{formaterNullableIsoDato(barn.fødselTermindato)}</Normaltekst>
            </>
            <>
                <Søknadsgrunnlag />
                <Element>Annen forelder lagt til i søknad</Element>
                <Normaltekst>
                    {barn.annenForelderSoknad ? (
                        <AnnenForelderNavnOgFnr forelder={barn.annenForelderSoknad} />
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
