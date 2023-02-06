import React, { FC } from 'react';
import { SivilstandType } from '../../../../App/typer/personopplysninger';
import { EÅrsakEnslig, ISivilstandSøknadsgrunnlag, ÅrsakEnsligTilTekst } from './typer';
import { hentBooleanTekst } from '../utils';
import { formaterNullableIsoDato, mapTrueFalse } from '../../../../App/utils/formatter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    sivilstandtype: SivilstandType;
    søknad: ISivilstandSøknadsgrunnlag;
}

const Søknadsinformasjon: FC<Props> = ({ sivilstandtype, søknad }) => {
    const { tidligereSamboer, erUformeltSeparertEllerSkilt, erUformeltGift } = søknad;

    switch (sivilstandtype) {
        case SivilstandType.UGIFT:
        case SivilstandType.UOPPGITT:
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
        case SivilstandType.GIFT:
        case SivilstandType.REGISTRERT_PARTNER:
            return (
                <>
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Søkt separasjon, skilsmisse eller reist sak"
                        verdi={
                            søknad.søktOmSkilsmisseSeparasjon !== undefined &&
                            (søknad.søktOmSkilsmisseSeparasjon
                                ? `${hentBooleanTekst(søknad.søktOmSkilsmisseSeparasjon)}, 
                            ${formaterNullableIsoDato(søknad.datoSøktSeparasjon)}`
                                : hentBooleanTekst(søknad.søktOmSkilsmisseSeparasjon))
                        }
                    />
                    {søknad.fraflytningsdato && (
                        <Informasjonsrad
                            ikon={VilkårInfoIkon.SØKNAD}
                            label="Dato for fraflytting"
                            verdi={formaterNullableIsoDato(søknad.fraflytningsdato)}
                        />
                    )}
                </>
            );
        case SivilstandType.SEPARERT:
        case SivilstandType.SEPARERT_PARTNER:
            return (
                <>
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Alene med barn fordi"
                        verdi={søknad.årsakEnslig && ÅrsakEnsligTilTekst[søknad.årsakEnslig]}
                    />

                    {søknad.årsakEnslig === EÅrsakEnslig.samlivsbruddForeldre && (
                        <>
                            <Informasjonsrad
                                ikon={VilkårInfoIkon.SØKNAD}
                                label="Dato for samlivsbrudd"
                                verdi={
                                    søknad.samlivsbruddsdato
                                        ? formaterNullableIsoDato(søknad.samlivsbruddsdato)
                                        : '-'
                                }
                            />
                        </>
                    )}

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

        default:
            return <></>;
    }
};

export default Søknadsinformasjon;
