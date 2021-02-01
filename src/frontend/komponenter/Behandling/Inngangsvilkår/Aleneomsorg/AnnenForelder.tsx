import React, { FC } from 'react';
import { IAleneomsorgSøknadsgrunnlag, IAnnenForelderAleneomsorg } from './typer';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';

interface Props {
    søknadsgrunnlag: IAleneomsorgSøknadsgrunnlag;
    forelderRegister?: IAnnenForelderAleneomsorg;
}

const AnnenForelder: FC<Props> = ({ forelderRegister, søknadsgrunnlag }) => {
    const forelderSøknad = søknadsgrunnlag.forelder;

    const erNavnFnrEllerFødselsdatoUtfylt: boolean =
        forelderSøknad?.navn !== '' ||
        forelderSøknad.fødselsnummer !== '' ||
        forelderSøknad.fødselsdato !== '';

    // TODO: Legg til hvorforIkkeOppgi - Donorbarn, annet
    const annenForelderInfo: string = !erNavnFnrEllerFødselsdatoUtfylt
        ? 'Ikke fylt ut'
        : `${forelderSøknad?.navn}, ${forelderSøknad?.fødselsnummer}`;

    // TODO: legg til samme data, men fra register

    return (
        <>
            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder</Normaltekst>
            <Normaltekst>{annenForelderInfo}</Normaltekst>
            <Søknadsgrunnlag />
            <Normaltekst>Annen forelder bor i</Normaltekst>
            <Normaltekst>
                {forelderSøknad?.bosattINorge ? 'Norge' : forelderSøknad?.land}
            </Normaltekst>
            {søknadsgrunnlag.spørsmålAvtaleOmDeltBosted !== undefined && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Skriftlig avtale om delt fast bosted</Normaltekst>
                    <BooleanTekst value={søknadsgrunnlag.spørsmålAvtaleOmDeltBosted} />
                </>
            )}
            {søknadsgrunnlag.skalAnnenForelderHaSamvær !== '' && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Annen forelders samvær</Normaltekst>
                    <Normaltekst>{søknadsgrunnlag.skalAnnenForelderHaSamvær}</Normaltekst>
                </>
            )}
        </>
    );
};

export default AnnenForelder;
