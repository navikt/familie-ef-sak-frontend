import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import {
    avstandTilSøkerTekst,
    EAvstandTilSøker,
    IAnnenForelder,
    IAvstandTilSøker,
    IBarnMedSamværSøknadsgrunnlag,
} from './typer';
import { AnnenForelderNavnOgFnr } from '../NyttBarnSammePartner/AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { HelpText } from '@navikt/ds-react';
import styled from 'styled-components';
import { BodyLongSmall, BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

const StyledHelpText = styled(HelpText)`
    & + .navds-popover {
        max-width: 40rem;
    }
`;

interface Props {
    forelderRegister?: IAnnenForelder;
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
}

const AnnenForelderOpplysninger: FC<Props> = ({ forelderRegister, søknadsgrunnlag }) => {
    const forelderSøknad = søknadsgrunnlag.forelder;

    const harNavnFødselsdatoEllerFnr = (forelder: IAnnenForelder): boolean =>
        harVerdi(forelder.navn) ||
        harVerdi(forelder.fødselsnummer) ||
        harVerdi(forelder.fødselsdato);

    const utledAvstandTilSøkerTekst = (avstandTilSøker: IAvstandTilSøker): string => {
        switch (avstandTilSøker.langAvstandTilSøker) {
            case EAvstandTilSøker.JA:
                return avstandTilSøker.avstandIKm + ' km';
            default:
                return avstandTilSøkerTekst[avstandTilSøker.langAvstandTilSøker];
        }
    };
    const visForelderSøknadInfo =
        !forelderRegister?.dødsfall &&
        ((forelderSøknad && harNavnFødselsdatoEllerFnr(forelderSøknad)) ||
            harVerdi(søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse));

    return (
        <GridTabell>
            {visForelderSøknadInfo && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Annen forelder</BodyShortSmall>
                    <BodyLongSmall>
                        {forelderSøknad &&
                        harNavnFødselsdatoEllerFnr(forelderSøknad) &&
                        !søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse ? (
                            <>
                                <AnnenForelderNavnOgFnr forelder={forelderSøknad} />
                            </>
                        ) : (
                            <>
                                {søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse
                                    ? `Ikke oppgitt: ${søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse}`
                                    : '-'}
                            </>
                        )}
                    </BodyLongSmall>
                </>
            )}

            {!visForelderSøknadInfo &&
                forelderRegister &&
                harNavnFødselsdatoEllerFnr(forelderRegister) && (
                    <>
                        <Registergrunnlag />
                        <BodyShortSmall>Annen forelder</BodyShortSmall>
                        <BodyLongSmall>
                            {forelderRegister ? (
                                <AnnenForelderNavnOgFnr forelder={forelderRegister} />
                            ) : (
                                '-'
                            )}
                        </BodyLongSmall>
                    </>
                )}

            {forelderRegister?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <BodyShortSmall>Annen forelder dødsdato</BodyShortSmall>
                    <BodyShortSmall>
                        {formaterNullableIsoDato(forelderRegister.dødsfall)}
                    </BodyShortSmall>
                </>
            )}
            {!forelderRegister?.dødsfall && (
                <>
                    {forelderSøknad && harNavnFødselsdatoEllerFnr(forelderSøknad) && (
                        <>
                            <Søknadsgrunnlag />
                            <BodyShortSmall>Annen forelder bor i</BodyShortSmall>
                            <BodyShortSmall>
                                {forelderSøknad?.bosattINorge
                                    ? 'Norge'
                                    : forelderSøknad?.land || '-'}
                            </BodyShortSmall>
                        </>
                    )}

                    {!visForelderSøknadInfo &&
                        forelderRegister &&
                        harNavnFødselsdatoEllerFnr(forelderRegister) && (
                            <>
                                <Registergrunnlag />
                                <BodyShortSmall>Annen forelder bor i</BodyShortSmall>
                                <BodyShortSmall>
                                    {forelderRegister?.bosattINorge
                                        ? 'Norge'
                                        : forelderRegister.land || '-'}
                                </BodyShortSmall>
                            </>
                        )}
                </>
            )}

            {forelderRegister &&
                harNavnFødselsdatoEllerFnr(forelderRegister) &&
                !forelderRegister?.dødsfall && (
                    <>
                        <Registergrunnlag />
                        <BodyLongSmall>
                            Annen forelders avstand til bruker (automatisk beregnet)
                        </BodyLongSmall>
                        <BodyShortSmall>
                            {forelderRegister &&
                                utledAvstandTilSøkerTekst(forelderRegister?.avstandTilSøker)}
                        </BodyShortSmall>
                        <StyledHelpText placement={'right'}>
                            Automatisk beregning av avstand mellom bostedsadressene til bruker og
                            annen forelder. Dette betyr de ulike resultatene:
                            <ul>
                                <li>
                                    <b>xx km</b> - Det er automatisk beregnet nøyaktig avstand
                                    mellom boligene i luftlinje.
                                </li>
                                <li>
                                    <b>Kan ikke beregnes automatisk</b> - Vilkåret må vurderes
                                    manuelt fordi avstanden mellom boligene er mindre enn 1 km i
                                    luftlinje, eller en av forelder er registrert med bostedsadresse
                                    utenfor Norge.
                                </li>
                                <li>
                                    <b>Mer enn 1 km</b> - Det er automatisk beregnet at det er mer
                                    enn 1 km mellom boligene i luftlinje. Det kan ikke vises helt
                                    nøyaktig avstand da avstandsberegningen er upresis i retning øst
                                    og vest i Nord-Norge, fordi Nord-Norge ligger i et annet
                                    koordinatsystem. For å unngå feilmarginen det gir, vil det kun
                                    avstandsberegnes i retning nord og sør for brukere som bor i
                                    Nord-Norge, da dette ikke avhenger av koordinatsystem.
                                </li>
                            </ul>
                        </StyledHelpText>
                    </>
                )}
        </GridTabell>
    );
};

export default AnnenForelderOpplysninger;
