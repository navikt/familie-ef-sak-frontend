import React, { FC } from 'react';
import { SøknadsgrunnlagNyttBarn } from './typer';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import LiteBarn from '../../../../Felles/Ikoner/LiteBarn';
import { mapBarnNavnTekst } from './utils';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';
import { Label } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

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
                <Label as="h4" size={'small'}>
                    {mapBarnNavnTekst(barn)}
                </Label>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Termindato</BodyShortSmall>
                <BodyShortSmall>{formaterNullableIsoDato(barn.fødselTermindato)}</BodyShortSmall>
            </>
            {annenForelder && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Annen forelder lagt til i søknad</BodyShortSmall>
                    <AnnenForelderNavnOgFnr forelder={annenForelder} />
                </>
            )}
            {harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Annen forelder</BodyShortSmall>
                    <BodyShortSmall>
                        {ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                            ? ikkeOppgittAnnenForelderBegrunnelse
                            : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`}
                    </BodyShortSmall>
                </>
            )}
        </GridTabell>
    );
};

export default SøknadgrunnlagNyttBarn;
