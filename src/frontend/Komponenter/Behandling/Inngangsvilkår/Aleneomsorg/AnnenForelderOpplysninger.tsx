import React, { FC } from 'react';
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
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { TabellIkon } from '../../Vilkårpanel/TabellVisning';

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
        <>
            {visForelderSøknadInfo && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
                    label="Annen forelder"
                    verdiSomString={false}
                    verdi={
                        forelderSøknad &&
                        harNavnFødselsdatoEllerFnr(forelderSøknad) &&
                        !søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse ? (
                            <AnnenForelderNavnOgFnr forelder={forelderSøknad} />
                        ) : (
                            <BodyShortSmall>
                                {søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse
                                    ? `Ikke oppgitt: ${søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse}`
                                    : '-'}
                            </BodyShortSmall>
                        )
                    }
                />
            )}

            {!visForelderSøknadInfo &&
                forelderRegister &&
                harNavnFødselsdatoEllerFnr(forelderRegister) && (
                    <Informasjonsrad
                        ikon={TabellIkon.REGISTER}
                        label="Annen forelder"
                        verdiSomString={false}
                        verdi={
                            forelderRegister ? (
                                <AnnenForelderNavnOgFnr forelder={forelderRegister} />
                            ) : (
                                <BodyShortSmall>-</BodyShortSmall>
                            )
                        }
                    />
                )}

            {forelderRegister?.dødsfall && (
                <Informasjonsrad
                    ikon={TabellIkon.REGISTER}
                    label="Annen forelder dødsdato"
                    verdi={formaterNullableIsoDato(forelderRegister.dødsfall)}
                />
            )}
            {!forelderRegister?.dødsfall && (
                <>
                    {forelderSøknad && harNavnFødselsdatoEllerFnr(forelderSøknad) && (
                        <Informasjonsrad
                            ikon={TabellIkon.SØKNAD}
                            label="Annen forelder bor i"
                            verdi={
                                forelderSøknad?.bosattINorge ? 'Norge' : forelderSøknad?.land || '-'
                            }
                        />
                    )}

                    {!visForelderSøknadInfo &&
                        forelderRegister &&
                        harNavnFødselsdatoEllerFnr(forelderRegister) && (
                            <Informasjonsrad
                                ikon={TabellIkon.SØKNAD}
                                label="Annen forelder bor i"
                                verdi={
                                    forelderRegister?.bosattINorge
                                        ? 'Norge'
                                        : forelderRegister.land || '-'
                                }
                            />
                        )}
                </>
            )}

            {forelderRegister &&
                harNavnFødselsdatoEllerFnr(forelderRegister) &&
                !forelderRegister?.dødsfall && (
                    <Informasjonsrad
                        ikon={TabellIkon.REGISTER}
                        label="Annen forelders avstand til bruker (automatisk beregnet)"
                        verdiSomString={false}
                        verdi={
                            <>
                                <BodyShortSmall>
                                    {forelderRegister &&
                                        utledAvstandTilSøkerTekst(
                                            forelderRegister?.avstandTilSøker
                                        )}
                                </BodyShortSmall>
                                <StyledHelpText placement={'right'}>
                                    Automatisk beregning av avstand mellom bostedsadressene til
                                    bruker og annen forelder. Dette betyr de ulike resultatene:
                                    <ul>
                                        <li>
                                            <b>xx km</b> - Det er automatisk beregnet nøyaktig
                                            avstand mellom boligene i luftlinje.
                                        </li>
                                        <li>
                                            <b>Kan ikke beregnes automatisk</b> - Vilkåret må
                                            vurderes manuelt fordi avstanden mellom boligene er
                                            mindre enn 1 km i luftlinje, eller en av forelder er
                                            registrert med bostedsadresse utenfor Norge.
                                        </li>
                                        <li>
                                            <b>Mer enn 1 km</b> - Det er automatisk beregnet at det
                                            er mer enn 1 km mellom boligene i luftlinje. Det kan
                                            ikke vises helt nøyaktig avstand da avstandsberegningen
                                            er upresis i retning øst og vest i Nord-Norge, fordi
                                            Nord-Norge ligger i et annet koordinatsystem. For å
                                            unngå feilmarginen det gir, vil det kun avstandsberegnes
                                            i retning nord og sør for brukere som bor i Nord-Norge,
                                            da dette ikke avhenger av koordinatsystem.
                                        </li>
                                    </ul>
                                </StyledHelpText>
                            </>
                        }
                    />
                )}
        </>
    );
};

export default AnnenForelderOpplysninger;
