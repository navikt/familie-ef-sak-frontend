import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { IPersonDetaljer } from '../Sivilstand/typer';
import { ISivilstandsplaner } from '../vilkår';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import { ESøkerDelerBolig, IBosituasjon } from './typer';

const erPersonInfoUtfylt = (personInfo: IPersonDetaljer): boolean => {
    return (
        personInfo.navn !== undefined &&
        personInfo.navn !== null &&
        personInfo.ident !== undefined &&
        personInfo.ident !== null &&
        personInfo.fødselsdato !== undefined &&
        personInfo.fødselsdato !== null
    );
};

interface Props {
    bosituasjon: IBosituasjon;
    tidligereSamboer?: IPersonDetaljer;
    sivilstandsplaner?: ISivilstandsplaner;
}

export const Bosituasjon: FC<Props> = ({ bosituasjon, tidligereSamboer, sivilstandsplaner }) => (
    <>
        {bosituasjon.delerDuBolig === ESøkerDelerBolig.harEkteskapsliknendeForhold && (
            <SamboerInfoOgDatoSammenflytting
                samboer={bosituasjon?.samboer}
                sammenflyttingsdato={bosituasjon?.sammenflyttingsdato}
            />
        )}

        {bosituasjon.delerDuBolig ===
            ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse && (
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Tidligere samboer</Normaltekst>
                <Normaltekst>
                    {tidligereSamboer && !erPersonInfoUtfylt(tidligereSamboer)
                        ? 'Ikke fylt ut'
                        : `${tidligereSamboer?.navn || ''} - ${
                              tidligereSamboer?.ident ||
                              formaterNullableIsoDato(tidligereSamboer?.fødselsdato) ||
                              ''
                          }`}
                </Normaltekst>
            </>
        )}

        {[
            ESøkerDelerBolig.borAleneMedBarnEllerGravid,
            ESøkerDelerBolig.delerBoligMedAndreVoksne,
            ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
        ].includes(bosituasjon.delerDuBolig) &&
            sivilstandsplaner?.harPlaner && (
                <Sivilstandsplaner sivilstandsplaner={sivilstandsplaner} />
            )}
    </>
);

const SamboerInfoOgDatoSammenflytting: FC<{
    samboer?: IPersonDetaljer;
    sammenflyttingsdato?: string;
}> = ({ samboer, sammenflyttingsdato }) => (
    <>
        <Søknadsgrunnlag />
        <Normaltekst>Samboers navn</Normaltekst>
        <Normaltekst>
            {`${samboer?.navn} - ${
                samboer?.ident || formaterNullableIsoDato(samboer?.fødselsdato)
            }`}
        </Normaltekst>

        <Søknadsgrunnlag />
        <Normaltekst>Flyttet sammen</Normaltekst>
        <Normaltekst>{formaterNullableIsoDato(sammenflyttingsdato)}</Normaltekst>
    </>
);

const Sivilstandsplaner: FC<{ sivilstandsplaner: ISivilstandsplaner }> = ({
    sivilstandsplaner,
}) => (
    <>
        <Søknadsgrunnlag />
        <Normaltekst>Skal gifte seg eller bli samboer</Normaltekst>
        <BooleanTekst value={!!sivilstandsplaner.harPlaner} />

        {sivilstandsplaner.harPlaner && (
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Dato</Normaltekst>
                <Normaltekst>{formaterNullableIsoDato(sivilstandsplaner.fraDato)}</Normaltekst>

                <Søknadsgrunnlag />
                <Normaltekst>Ektefelle eller samboer</Normaltekst>
                <Normaltekst>{`${sivilstandsplaner.vordendeSamboerEktefelle?.navn} - ${
                    sivilstandsplaner.vordendeSamboerEktefelle?.ident ||
                    formaterNullableIsoDato(sivilstandsplaner.vordendeSamboerEktefelle?.fødselsdato)
                }`}</Normaltekst>
            </>
        )}
    </>
);
