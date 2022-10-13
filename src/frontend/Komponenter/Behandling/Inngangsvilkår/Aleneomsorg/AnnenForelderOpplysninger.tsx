import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
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
                    <Normaltekst>Annen forelder</Normaltekst>
                    <Normaltekst>
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
                    </Normaltekst>
                </>
            )}

            {!visForelderSøknadInfo &&
                forelderRegister &&
                harNavnFødselsdatoEllerFnr(forelderRegister) && (
                    <>
                        <Registergrunnlag />
                        <Normaltekst>Annen forelder</Normaltekst>
                        <Normaltekst>
                            {forelderRegister ? (
                                <AnnenForelderNavnOgFnr forelder={forelderRegister} />
                            ) : (
                                '-'
                            )}
                        </Normaltekst>
                    </>
                )}

            {forelderRegister?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <Normaltekst>Annen forelder dødsdato</Normaltekst>
                    <Normaltekst>{formaterNullableIsoDato(forelderRegister.dødsfall)}</Normaltekst>
                </>
            )}
            {!forelderRegister?.dødsfall && (
                <>
                    {forelderSøknad && harNavnFødselsdatoEllerFnr(forelderSøknad) && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Annen forelder bor i</Normaltekst>
                            <Normaltekst>
                                {forelderSøknad?.bosattINorge
                                    ? 'Norge'
                                    : forelderSøknad?.land || '-'}
                            </Normaltekst>
                        </>
                    )}

                    {!visForelderSøknadInfo &&
                        forelderRegister &&
                        harNavnFødselsdatoEllerFnr(forelderRegister) && (
                            <>
                                <Registergrunnlag />
                                <Normaltekst>Annen forelder bor i</Normaltekst>
                                <Normaltekst>
                                    {forelderRegister?.bosattINorge
                                        ? 'Norge'
                                        : forelderRegister.land || '-'}
                                </Normaltekst>
                            </>
                        )}
                </>
            )}

            {!forelderRegister?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <Normaltekst>
                        Annen forelders avstand til bruker (automatisk beregnet)
                    </Normaltekst>
                    <Normaltekst>
                        {forelderRegister &&
                            utledAvstandTilSøkerTekst(forelderRegister?.avstandTilSøker)}
                    </Normaltekst>
                    <StyledHelpText placement={'right'}>
                        Automatisk beregning av avstand mellom bostedsadressene til bruker og annen
                        forelder. Dette betyr de ulike resultatene:
                        <ul>
                            <li>
                                <b>xx km</b> - Det er automatisk beregnet nøyaktig avstand mellom
                                boligene i luftlinje.
                            </li>
                            <li>
                                <b>Kan ikke beregnes automatisk</b> - Vilkåret må vurderes manuelt
                                fordi avstanden mellom boligene er mindre enn 1 km i luftlinje,
                                eller en av forelder er registrert med bostedsadresse utenfor Norge.
                            </li>
                            <li>
                                <b>Mer enn 1 km</b> - Det er automatisk beregnet at det er mer enn 1
                                km mellom boligene i luftlinje. Det kan ikke vises helt nøyaktig
                                avstand da avstandsberegningen er upresis i retning øst og vest i
                                Nord-Norge, fordi Nord-Norge ligger i et annet koordinatsystem. For
                                å unngå feilmarginen det gir, vil det kun avstandsberegnes i retning
                                nord og sør for brukere som bor i Nord-Norge, da dette ikke avhenger
                                av koordinatsystem.
                            </li>
                        </ul>
                    </StyledHelpText>
                </>
            )}
        </GridTabell>
    );
};

export default AnnenForelderOpplysninger;
