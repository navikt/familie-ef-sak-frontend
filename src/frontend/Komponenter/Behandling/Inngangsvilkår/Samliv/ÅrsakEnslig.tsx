import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { EÅrsakEnslig, ISivilstandSøknadsgrunnlag } from '../Sivilstand/typer';
import { hentPersonInfo } from '../utils';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

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
                        <BodyShortSmall>Dato for samlivsbrudd</BodyShortSmall>
                        <BodyShortSmall>
                            {formaterNullableIsoDato(søknadsgrunnlag.samlivsbruddsdato)}
                        </BodyShortSmall>
                    </>
                )}

            {søknadsgrunnlag.årsakEnslig === EÅrsakEnslig.samlivsbruddAndre && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Tidligere samboer</BodyShortSmall>
                    <BodyShortSmall>{hentPersonInfo(tidligereSamboer)}</BodyShortSmall>
                    {søknadsgrunnlag.fraflytningsdato && (
                        <>
                            <Søknadsgrunnlag />
                            <BodyShortSmall>Flyttet fra hverandre</BodyShortSmall>
                            <BodyShortSmall>
                                {formaterNullableIsoDato(søknadsgrunnlag.fraflytningsdato)}
                            </BodyShortSmall>
                        </>
                    )}
                </>
            )}

            {søknadsgrunnlag.årsakEnslig === EÅrsakEnslig.endringISamværsordning &&
                søknadsgrunnlag.endringSamværsordningDato && (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>Endringen skjer/skjedde</BodyShortSmall>
                        <BodyShortSmall>
                            {formaterNullableIsoDato(søknadsgrunnlag.endringSamværsordningDato)}
                        </BodyShortSmall>
                    </>
                )}
        </>
    );
};
export default ÅrsakEnslig;
