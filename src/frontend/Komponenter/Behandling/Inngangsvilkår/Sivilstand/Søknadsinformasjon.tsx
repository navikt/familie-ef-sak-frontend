import React, { FC } from 'react';
import { EÅrsakEnslig, IPersonDetaljer, ISivilstandSøknadsgrunnlag } from './typer';
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
        fraflytningsdato,
        datoSøktSeparasjon,
        årsakEnslig,
        tidligereSamboer,
    } = søknad;

    const harBesvartErUformeltGiftSpørsmål =
        erUformeltGift !== undefined && erUformeltGift !== null;

    const harBesvartErUformeltSeparertEllerSkiltSpørsmål =
        erUformeltSeparertEllerSkilt !== undefined && erUformeltSeparertEllerSkilt !== null;

    const harBesvartSøktSkillsmisseSpørsmål =
        søktOmSkilsmisseSeparasjon !== undefined && søktOmSkilsmisseSeparasjon !== null;

    const erEnsligPåGrunnAvSamlivsbruddMedNoenAndre =
        årsakEnslig === EÅrsakEnslig.samlivsbruddAndre;

    const erEnsligPåGrunnAvEndringISamværsordning =
        årsakEnslig === EÅrsakEnslig.endringISamværsordning;

    const tidligereSamboerInfo = utledTidligereSamboerInformasjon(tidligereSamboer);

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
            {erEnsligPåGrunnAvSamlivsbruddMedNoenAndre && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Tidligere samboer"
                    verdi={tidligereSamboerInfo}
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
            {fraflytningsdato && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Dato for fraflytting"
                    verdi={formaterNullableIsoDato(fraflytningsdato)}
                />
            )}
        </>
    );
};

const utledTidligereSamboerInformasjon = (samboer: IPersonDetaljer | undefined) => {
    if (!samboer) {
        return 'ukjent samboer';
    }

    const personIdentEllerFødselsdato = samboer.personIdent
        ? samboer.personIdent
        : formaterNullableIsoDato(samboer.fødselsdato);

    return `${samboer.navn} - ${personIdentEllerFødselsdato ?? 'ukjent fødselsdato'}`;
};
