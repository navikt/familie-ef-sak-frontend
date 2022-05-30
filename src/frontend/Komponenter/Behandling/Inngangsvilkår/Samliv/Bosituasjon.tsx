import React, { FC, useState, useCallback, useEffect } from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { IPersonDetaljer } from '../Sivilstand/typer';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { ESøkerDelerBolig, IBosituasjon, ISivilstandsplaner } from './typer';
import { hentPersonInfo } from '../utils';
import { Td } from '../../../../Felles/Personopplysninger/TabellWrapper';
import { AdresseType, ISøkeresultatPerson } from '../../../../App/typer/personopplysninger';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { useHentPersonopplysninger } from '../../../../App/hooks/useHentPersonopplysninger';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import LenkeKnapp from '../../../../Felles/Knapper/LenkeKnapp';
import { Collapse, Expand } from '@navikt/ds-icons';

interface Props {
    bosituasjon: IBosituasjon;
    sivilstandsplaner?: ISivilstandsplaner;
    behandlingId: string;
}

interface BeboereTabellProps {
    vis: boolean;
}

const BeboereTabell = styled.table<BeboereTabellProps>`
    grid-column: 1 / span 3;
    background-color: #f9f9f9;
    margin-top: 2rem;

    display: ${(props) => (props.vis ? 'block' : 'none')};
`;

const LenkeIkon = styled.div`
    margin-left: 0.5rem;
    top: 2px;

    display: inline-block;
    position: relative;
`;

export const Bosituasjon: FC<Props> = ({ bosituasjon, sivilstandsplaner, behandlingId }) => {
    const { axiosRequest } = useApp();
    const [beboere, settBeboere] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());
    const [visBeboere, settVisBeboere] = useState<boolean>(false);

    const { hentPersonopplysninger, personopplysningerResponse } =
        useHentPersonopplysninger(behandlingId);

    useEffect(() => {
        hentPersonopplysninger(behandlingId);
    }, [behandlingId, hentPersonopplysninger]);

    const hentBeboerePåSammeAdresse = useCallback(
        (behandlingId: string) => {
            axiosRequest<ISøkeresultatPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/${behandlingId}/samme-adresse`,
            }).then((respons: Ressurs<ISøkeresultatPerson>) => {
                settBeboere(respons);
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        hentBeboerePåSammeAdresse(behandlingId);
    }, [behandlingId, hentBeboerePåSammeAdresse]);

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

            <DataViewer response={{ personopplysningerResponse, beboere }}>
                {({ personopplysningerResponse, beboere }) => {
                    const bostedsadresse = personopplysningerResponse.adresse.find(
                        (adresse) => adresse.type === AdresseType.BOSTEDADRESSE
                    );

                    return (
                        <>
                            <Registergrunnlag />
                            <Normaltekst>Brukers bostedsadresse</Normaltekst>
                            <div>
                                <Normaltekst>{bostedsadresse?.visningsadresse}</Normaltekst>
                                <LenkeKnapp
                                    onClick={() => {
                                        settVisBeboere(!visBeboere);
                                    }}
                                >
                                    Se beboere
                                    <LenkeIkon>{visBeboere ? <Collapse /> : <Expand />}</LenkeIkon>
                                </LenkeKnapp>
                            </div>

                            <BeboereTabell vis={visBeboere} className="tabell">
                                <thead>
                                    <Td>Navn</Td>
                                    <Td>Fødselsnummer</Td>
                                    <Td>Adresse</Td>
                                </thead>
                                <tbody>
                                    {beboere.hits.map((beboer) => {
                                        return (
                                            <tr>
                                                <Td>{beboer.visningsnavn}</Td>
                                                <Td>{beboer.personIdent}</Td>
                                                <Td>{beboer.visningsadresse}</Td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </BeboereTabell>
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
