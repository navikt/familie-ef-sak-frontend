import React, { FC } from 'react';
import { SivilstandType } from '../../../../App/typer/personopplysninger';
import { EÅrsakEnslig, ISivilstandSøknadsgrunnlag } from './typer';
import { hentBooleanTekst } from '../utils';
import { formaterNullableIsoDato, mapTrueFalse } from '../../../../App/utils/formatter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    sivilstandtype: SivilstandType;
    søknad: ISivilstandSøknadsgrunnlag;
}

export const Søknadsinformasjon: FC<Props> = ({ sivilstandtype, søknad }) => {
    switch (sivilstandtype) {
        case SivilstandType.UGIFT:
        case SivilstandType.UOPPGITT:
        case SivilstandType.ENKE_ELLER_ENKEMANN:
        case SivilstandType.SKILT:
        case SivilstandType.SKILT_PARTNER:
            return <IkkeRegistrertGiftInformasjon søknad={søknad} />;
        case SivilstandType.GIFT:
        case SivilstandType.REGISTRERT_PARTNER:
            return <RegistrertGiftInformasjon søknad={søknad} />;
        case SivilstandType.SEPARERT:
        case SivilstandType.SEPARERT_PARTNER:
            return <Separasjonsinformasjon søknad={søknad} />;
        default:
            return <></>;
    }
};

const IkkeRegistrertGiftInformasjon: FC<{ søknad: ISivilstandSøknadsgrunnlag }> = ({ søknad }) => {
    const { erUformeltGift, erUformeltSeparertEllerSkilt, søktOmSkilsmisseSeparasjon } = søknad;
    const harBesvartSkillsmisseSpørsmål = søktOmSkilsmisseSeparasjon !== undefined;

    // Dersom brukeren var gift på søknadstidspunktet men senere blir registrert som skilt,
    // så ønsker vi fortsatt å vise hva brukeren svarte på spørsmålet om hen har søkt separasjon, skillsmisse
    // eller reist sak.
    if (harBesvartSkillsmisseSpørsmål) {
        return <RegistrertGiftInformasjon søknad={søknad} />;
    }

    return (
        <>
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Gift uten at det er registrert i folkeregisteret"
                verdi={erUformeltGift !== undefined && mapTrueFalse(erUformeltGift)}
            />
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Separert eller skilt uten at det er registrert i folkeregisteret"
                verdi={
                    erUformeltSeparertEllerSkilt !== undefined &&
                    mapTrueFalse(erUformeltSeparertEllerSkilt)
                }
            />
        </>
    );
};

const RegistrertGiftInformasjon: FC<{ søknad: ISivilstandSøknadsgrunnlag }> = ({ søknad }) => {
    const { søktOmSkilsmisseSeparasjon, datoSøktSeparasjon, fraflytningsdato } = søknad;

    return (
        <>
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Søkt separasjon, skilsmisse eller reist sak"
                verdi={
                    søktOmSkilsmisseSeparasjon !== undefined &&
                    (søktOmSkilsmisseSeparasjon
                        ? `${hentBooleanTekst(søktOmSkilsmisseSeparasjon)}, 
                            ${formaterNullableIsoDato(datoSøktSeparasjon)}`
                        : hentBooleanTekst(søktOmSkilsmisseSeparasjon))
                }
            />
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

const Separasjonsinformasjon: FC<{ søknad: ISivilstandSøknadsgrunnlag }> = ({ søknad }) => {
    const { tidligereSamboer, erUformeltSeparertEllerSkilt, erUformeltGift } = søknad;

    return (
        <>
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Gift uten at det er registrert i folkeregisteret"
                verdi={erUformeltGift !== undefined && mapTrueFalse(erUformeltGift)}
            />
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Separert eller skilt uten at det er registrert i folkeregisteret"
                verdi={
                    erUformeltSeparertEllerSkilt !== undefined &&
                    mapTrueFalse(erUformeltSeparertEllerSkilt)
                }
            />

            {søknad.årsakEnslig === EÅrsakEnslig.samlivsbruddAndre && (
                <>
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Tidligere samboer"
                        verdi={`${tidligereSamboer?.navn} - ${
                            tidligereSamboer?.personIdent
                                ? tidligereSamboer?.personIdent
                                : formaterNullableIsoDato(tidligereSamboer?.fødselsdato)
                        }`}
                    />
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Dato for fraflytting"
                        verdi={formaterNullableIsoDato(søknad.fraflytningsdato)}
                    />
                </>
            )}

            {søknad.årsakEnslig === EÅrsakEnslig.endringISamværsordning && (
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
