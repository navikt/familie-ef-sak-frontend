import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { IPersonDetaljer } from '../Sivilstand/typer';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { ESøkerDelerBolig, IBosituasjon, ISivilstandsplaner } from './typer';
import { hentPersonInfo } from '../utils';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    bosituasjon: IBosituasjon;
    sivilstandsplaner?: ISivilstandsplaner;
}

export const Bosituasjon: FC<Props> = ({ bosituasjon, sivilstandsplaner }) => {
    return (
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
                    <BodyShortSmall>Tidligere samboer</BodyShortSmall>
                    <BodyShortSmall>{hentPersonInfo(bosituasjon.samboer)}</BodyShortSmall>

                    <Søknadsgrunnlag />
                    <BodyShortSmall>Flyttet fra hverandre</BodyShortSmall>
                    <BodyShortSmall>
                        {formaterNullableIsoDato(bosituasjon.datoFlyttetFraHverandre) || '-'}
                    </BodyShortSmall>
                </>
            )}

            {[
                ESøkerDelerBolig.borAleneMedBarnEllerGravid,
                ESøkerDelerBolig.delerBoligMedAndreVoksne,
                ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
            ].includes(bosituasjon.delerDuBolig) &&
                sivilstandsplaner && <Sivilstandsplaner sivilstandsplaner={sivilstandsplaner} />}
        </>
    );
};

const SamboerInfoOgDatoSammenflytting: FC<{
    samboer?: IPersonDetaljer;
    sammenflyttingsdato?: string;
}> = ({ samboer, sammenflyttingsdato }) => (
    <>
        <Søknadsgrunnlag />
        <BodyShortSmall>Samboer</BodyShortSmall>
        <BodyShortSmall>{hentPersonInfo(samboer)}</BodyShortSmall>

        <Søknadsgrunnlag />
        <BodyShortSmall>Flyttet sammen</BodyShortSmall>
        <BodyShortSmall>{formaterNullableIsoDato(sammenflyttingsdato)}</BodyShortSmall>
    </>
);

const Sivilstandsplaner: FC<{ sivilstandsplaner: ISivilstandsplaner }> = ({
    sivilstandsplaner,
}) => (
    <>
        <Søknadsgrunnlag />
        <BodyShortSmall>Skal gifte seg eller bli samboer</BodyShortSmall>
        <BooleanTekst value={!!sivilstandsplaner.harPlaner} />

        {sivilstandsplaner.harPlaner && (
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Dato</BodyShortSmall>
                <BodyShortSmall>
                    {formaterNullableIsoDato(sivilstandsplaner.fraDato)}
                </BodyShortSmall>

                <Søknadsgrunnlag />
                <BodyShortSmall>Ektefelle eller samboer</BodyShortSmall>
                <BodyShortSmall>{`${sivilstandsplaner.vordendeSamboerEktefelle?.navn} - ${
                    sivilstandsplaner.vordendeSamboerEktefelle?.personIdent ||
                    formaterNullableIsoDato(sivilstandsplaner.vordendeSamboerEktefelle?.fødselsdato)
                }`}</BodyShortSmall>
            </>
        )}
    </>
);
