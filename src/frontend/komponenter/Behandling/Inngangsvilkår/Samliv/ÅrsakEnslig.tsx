import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { EÅrsakEnslig, ISivilstandSøknadsgrunnlag } from '../Sivilstand/typer';
import { hentPersonInfo } from '../utils';

interface Props {
    søknadsgrunnlag: ISivilstandSøknadsgrunnlag;
}

const ÅrsakEnslig: FC<Props> = ({ søknadsgrunnlag }) => {
    const { tidligereSamboer } = søknadsgrunnlag;

    return (
        <>
            {søknadsgrunnlag.årsakEnslig === EÅrsakEnslig.samlivsbruddForeldre &&
                søknadsgrunnlag.samlivsbruddsdato && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Dato for samlivsbrudd</Normaltekst>
                        <Normaltekst>
                            {formaterNullableIsoDato(søknadsgrunnlag.samlivsbruddsdato)}
                        </Normaltekst>
                    </>
                )}

            {søknadsgrunnlag.årsakEnslig === EÅrsakEnslig.samlivsbruddAndre && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Tidligere samboer</Normaltekst>
                    <Normaltekst>{hentPersonInfo(tidligereSamboer)}</Normaltekst>
                    {søknadsgrunnlag.fraflytningsdato && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Flyttet fra hverandre</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknadsgrunnlag.fraflytningsdato)}
                            </Normaltekst>
                        </>
                    )}
                </>
            )}

            {søknadsgrunnlag.årsakEnslig === EÅrsakEnslig.endringISamværsordning &&
                søknadsgrunnlag.endringSamværsordningDato && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Endringen skjer/skjedde</Normaltekst>
                        <Normaltekst>
                            {formaterNullableIsoDato(søknadsgrunnlag.endringSamværsordningDato)}
                        </Normaltekst>
                    </>
                )}
        </>
    );
};
export default ÅrsakEnslig;
