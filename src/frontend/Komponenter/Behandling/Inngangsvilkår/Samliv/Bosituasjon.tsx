import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { IPersonDetaljer } from '../Sivilstand/typer';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { ESøkerDelerBolig, IBosituasjon, ISivilstandsplaner } from './typer';
import { hentPersonInfo } from '../utils';
import { useDataHenter } from '../../../../App/hooks/felles/useDataHenter';
import {
    AdresseType,
    IPersonopplysninger,
    ISøkeresultatPerson,
} from '../../../../App/typer/personopplysninger';
import { AxiosRequestConfig } from 'axios';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursFeilet } from '../../../../App/typer/ressurs';
import { useHentPersonopplysninger } from '../../../../App/hooks/useHentPersonopplysninger';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';

interface Props {
    bosituasjon: IBosituasjon;
    sivilstandsplaner?: ISivilstandsplaner;
    behandlingId: string;
}

export const Bosituasjon: FC<Props> = ({ bosituasjon, sivilstandsplaner, behandlingId }) => {
    const { axiosRequest } = useApp();
    const [søkResultat, settSøkResultat] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());

    const { hentPersonopplysninger, personopplysningerResponse } =
        useHentPersonopplysninger(behandlingId);

    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);

    console.log('person', personopplysningerResponse);

    const søkPerson = useCallback(
        (behandlingId: string) => {
            axiosRequest<any, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/${behandlingId}/samme-adresse`,
            }).then((respons: Ressurs<ISøkeresultatPerson> | RessursFeilet) => {
                settSøkResultat(respons);
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        søkPerson(behandlingId);
    }, [behandlingId, søkPerson]);

    console.log('res', søkResultat);

    console.log('bo', bosituasjon);

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

            <DataViewer response={{ personopplysningerResponse }}>
                {({ personopplysningerResponse }) => {
                    const bostedsadresse = personopplysningerResponse.adresse.find(
                        (adresse) => adresse.type === AdresseType.BOSTEDADRESSE
                    );

                    return (
                        <>
                            <Registergrunnlag />
                            <Normaltekst>Brukers bostedsadresse</Normaltekst>
                            <Normaltekst>{bostedsadresse?.visningsadresse}</Normaltekst>
                        </>
                    );
                }}
            </DataViewer>
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
