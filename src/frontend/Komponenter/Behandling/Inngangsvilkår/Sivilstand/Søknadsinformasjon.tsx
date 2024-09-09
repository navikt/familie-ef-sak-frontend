import React, { FC } from 'react';
import { EÅrsakEnslig, ISivilstandSøknadsgrunnlag } from './typer';
import { hentBooleanTekst } from '../utils';
import { formaterNullableIsoDato, mapTrueFalse } from '../../../../App/utils/formatter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    søknad: ISivilstandSøknadsgrunnlag;
}

export const Søknadsinformasjon: FC<Props> = ({ søknad }) => {
    const {
        erUformeltGift,
        erUformeltSeparertEllerSkilt,
        søktOmSkilsmisseSeparasjon,
        datoSøktSeparasjon,
        årsakEnslig,
    } = søknad;

    const harBesvartErUformeltGiftSpørsmål =
        erUformeltGift !== undefined && erUformeltGift !== null;

    const harBesvartErUformeltSeparertEllerSkiltSpørsmål =
        erUformeltSeparertEllerSkilt !== undefined && erUformeltSeparertEllerSkilt !== null;

    const harBesvartSøktSkillsmisseSpørsmål =
        søktOmSkilsmisseSeparasjon !== undefined && søktOmSkilsmisseSeparasjon !== null;

    const erEnsligPåGrunnAvEndringISamværsordning =
        årsakEnslig === EÅrsakEnslig.endringISamværsordning;

    return (
        <>
            {harBesvartErUformeltGiftSpørsmål && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Gift uten at det er registrert i folkeregisteret"
                    verdi={mapTrueFalse(erUformeltGift)}
                />
            )}
            {harBesvartErUformeltSeparertEllerSkiltSpørsmål && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Separert eller skilt uten at det er registrert i folkeregisteret"
                    verdi={mapTrueFalse(erUformeltSeparertEllerSkilt)}
                />
            )}
            {harBesvartSøktSkillsmisseSpørsmål && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Søkt separasjon, skilsmisse eller reist sak"
                    verdi={
                        søktOmSkilsmisseSeparasjon
                            ? `${hentBooleanTekst(søktOmSkilsmisseSeparasjon)}, 
                            ${formaterNullableIsoDato(datoSøktSeparasjon)}`
                            : hentBooleanTekst(søktOmSkilsmisseSeparasjon)
                    }
                />
            )}
            {erEnsligPåGrunnAvEndringISamværsordning && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Endringen skjedde"
                    verdi={
                        søknad.endringSamværsordningDato
                            ? formaterNullableIsoDato(søknad.endringSamværsordningDato)
                            : '-'
                    }
                />
            )}
        </>
    );
};
