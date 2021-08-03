import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato } from '../../../utils/formatter';
import { IPersonDetaljer } from '../Sivilstand/typer';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import { ESøkerDelerBolig, IBosituasjon, ISivilstandsplaner } from './typer';
import { hentPersonInfo } from '../utils';

interface Props {
    bosituasjon: IBosituasjon;
    sivilstandsplaner?: ISivilstandsplaner;
}

export const Bosituasjon: FC<Props> = ({ bosituasjon, sivilstandsplaner }) => (
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
                <Normaltekst>{hentPersonInfo(bosituasjon.samboer)}</Normaltekst>

                <Søknadsgrunnlag />
                <Normaltekst>Flyttet fra hverandre</Normaltekst>
                <Normaltekst>
                    {formaterNullableIsoDato(bosituasjon.datoFlyttetFraHverandre) || '-'}
                </Normaltekst>
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

const SamboerInfoOgDatoSammenflytting: FC<{
    samboer?: IPersonDetaljer;
    sammenflyttingsdato?: string;
}> = ({ samboer, sammenflyttingsdato }) => (
    <>
        <Søknadsgrunnlag />
        <Normaltekst>Samboer</Normaltekst>
        <Normaltekst>{hentPersonInfo(samboer)}</Normaltekst>

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
                    sivilstandsplaner.vordendeSamboerEktefelle?.personIdent ||
                    formaterNullableIsoDato(sivilstandsplaner.vordendeSamboerEktefelle?.fødselsdato)
                }`}</Normaltekst>
            </>
        )}
    </>
);
