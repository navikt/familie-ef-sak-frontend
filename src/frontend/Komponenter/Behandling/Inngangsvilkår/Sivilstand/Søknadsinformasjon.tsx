import React, { FC } from 'react';
import { SivilstandType } from '../../../../App/typer/personopplysninger';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { EÅrsakEnslig, ISivilstandSøknadsgrunnlag, ÅrsakEnsligTilTekst } from './typer';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { hentBooleanTekst } from '../utils';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

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
                    <Søknadsgrunnlag />
                    <BodyShortSmall>
                        Gift uten at det er registrert i folkeregisteret
                    </BodyShortSmall>
                    {erUformeltGift !== undefined && <BooleanTekst value={erUformeltGift} />}

                    <Søknadsgrunnlag />
                    <BodyShortSmall>
                        Separert eller skilt uten at det er registrert i folkeregisteret
                    </BodyShortSmall>
                    {erUformeltSeparertEllerSkilt !== undefined && (
                        <BooleanTekst value={erUformeltSeparertEllerSkilt} />
                    )}
                </>
            );
        case SivilstandType.GIFT:
        case SivilstandType.REGISTRERT_PARTNER:
            return (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Søkt separasjon, skilsmisse eller reist sak</BodyShortSmall>
                    {søknad.søktOmSkilsmisseSeparasjon !== undefined && (
                        <BodyShortSmall>
                            {søknad.søktOmSkilsmisseSeparasjon
                                ? `${hentBooleanTekst(søknad.søktOmSkilsmisseSeparasjon)}, 
                            ${formaterNullableIsoDato(søknad.datoSøktSeparasjon)}`
                                : hentBooleanTekst(søknad.søktOmSkilsmisseSeparasjon)}
                        </BodyShortSmall>
                    )}
                    {søknad.fraflytningsdato && (
                        <>
                            <Søknadsgrunnlag />
                            <BodyShortSmall>Dato for fraflytting</BodyShortSmall>
                            <BodyShortSmall>
                                {formaterNullableIsoDato(søknad.fraflytningsdato)}
                            </BodyShortSmall>
                        </>
                    )}
                </>
            );
        case SivilstandType.SEPARERT:
        case SivilstandType.SEPARERT_PARTNER:
            return (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Alene med barn fordi</BodyShortSmall>
                    {søknad.årsakEnslig && (
                        <BodyShortSmall>{ÅrsakEnsligTilTekst[søknad.årsakEnslig]}</BodyShortSmall>
                    )}

                    {søknad.årsakEnslig === EÅrsakEnslig.samlivsbruddForeldre && (
                        <>
                            <Søknadsgrunnlag />
                            <BodyShortSmall>Dato for samlivsbrudd</BodyShortSmall>

                            <BodyShortSmall>
                                {søknad.samlivsbruddsdato
                                    ? formaterNullableIsoDato(søknad.samlivsbruddsdato)
                                    : '-'}
                            </BodyShortSmall>
                        </>
                    )}

                    {søknad.årsakEnslig === EÅrsakEnslig.samlivsbruddAndre && (
                        <>
                            <Søknadsgrunnlag />
                            <BodyShortSmall>Tidligere samboer</BodyShortSmall>
                            <BodyShortSmall>{`${tidligereSamboer?.navn} - ${
                                tidligereSamboer?.personIdent
                                    ? tidligereSamboer?.personIdent
                                    : formaterNullableIsoDato(tidligereSamboer?.fødselsdato)
                            }`}</BodyShortSmall>

                            <Søknadsgrunnlag />
                            <BodyShortSmall>Dato for fraflytting</BodyShortSmall>
                            <BodyShortSmall>
                                {formaterNullableIsoDato(søknad.fraflytningsdato)}
                            </BodyShortSmall>
                        </>
                    )}

                    {søknad.årsakEnslig === EÅrsakEnslig.endringISamværsordning && (
                        <>
                            <Søknadsgrunnlag />
                            <BodyShortSmall>Endringen skjedde</BodyShortSmall>
                            <BodyShortSmall>
                                {søknad.endringSamværsordningDato
                                    ? formaterNullableIsoDato(søknad.endringSamværsordningDato)
                                    : '-'}
                            </BodyShortSmall>
                        </>
                    )}
                </>
            );

        default:
            return <></>;
    }
};

export default Søknadsinformasjon;
