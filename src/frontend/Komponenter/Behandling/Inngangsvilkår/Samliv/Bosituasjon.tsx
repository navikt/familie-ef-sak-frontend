import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { IPersonDetaljer } from '../Sivilstand/typer';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { ESøkerDelerBolig, IBosituasjon, ISivilstandsplaner } from './typer';
import { hentPersonInfo } from '../utils';
import { Bostedsadresse } from './Bostedsadresse';

interface Props {
    bosituasjon: IBosituasjon;
    sivilstandsplaner?: ISivilstandsplaner;
    behandlingId: string;
}

export const Bosituasjon: FC<Props> = ({ bosituasjon, sivilstandsplaner, behandlingId }) => {
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

            <Bostedsadresse behandlingId={behandlingId} />
        </>
    );
};

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
