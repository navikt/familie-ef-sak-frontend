import React, { FC } from 'react';
import { SivilstandType } from '../../../../typer/personopplysninger';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { EÅrsakEnslig, ISivilstandSøknadsgrunnlag, ÅrsakEnsligTilTekst } from './typer';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import { hentBooleanTekst } from '../utils';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

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
                    <Normaltekst>Gift uten at det er registrert i folkeregisteret</Normaltekst>
                    {erUformeltGift !== undefined && <BooleanTekst value={erUformeltGift} />}

                    <Søknadsgrunnlag />
                    <Normaltekst>
                        Separert eller skilt uten at det er registrert i folkeregisteret
                    </Normaltekst>
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
                    <Normaltekst>Søkt separasjon, skilsmisse eller reist sak</Normaltekst>
                    {søknad.søktOmSkilsmisseSeparasjon !== undefined && (
                        <Normaltekst>
                            {søknad.søktOmSkilsmisseSeparasjon
                                ? `${hentBooleanTekst(søknad.søktOmSkilsmisseSeparasjon)}, 
                            ${formaterNullableIsoDato(søknad.datoSøktSeparasjon)}`
                                : hentBooleanTekst(søknad.søktOmSkilsmisseSeparasjon)}
                        </Normaltekst>
                    )}
                    {søknad.fraflytningsdato && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Dato for fraflytting</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknad.fraflytningsdato)}
                            </Normaltekst>
                        </>
                    )}
                </>
            );
        case SivilstandType.SEPARERT:
        case SivilstandType.SEPARERT_PARTNER:
            return (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Alene med barn fordi</Normaltekst>
                    <Normaltekst>
                        {søknad.årsakEnslig && ÅrsakEnsligTilTekst[søknad.årsakEnslig]}
                    </Normaltekst>

                    {søknad.årsakEnslig === EÅrsakEnslig.samlivsbruddForeldre && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Dato for samlivsbrudd</Normaltekst>

                            <Normaltekst>
                                {søknad.samlivsbruddsdato
                                    ? formaterNullableIsoDato(søknad.samlivsbruddsdato)
                                    : '-'}
                            </Normaltekst>
                        </>
                    )}

                    {søknad.årsakEnslig === EÅrsakEnslig.samlivsbruddAndre && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Tidligere samboer</Normaltekst>
                            <Normaltekst>{`${tidligereSamboer?.navn} - ${
                                tidligereSamboer?.personIdent
                                    ? tidligereSamboer?.personIdent
                                    : formaterNullableIsoDato(tidligereSamboer?.fødselsdato)
                            }`}</Normaltekst>

                            <Søknadsgrunnlag />
                            <Normaltekst>Dato for fraflytting</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknad.fraflytningsdato)}
                            </Normaltekst>
                        </>
                    )}

                    {søknad.årsakEnslig === EÅrsakEnslig.endringISamværsordning && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Endringen skjedde</Normaltekst>
                            <Normaltekst>
                                {søknad.endringSamværsordningDato
                                    ? formaterNullableIsoDato(søknad.endringSamværsordningDato)
                                    : '-'}
                            </Normaltekst>
                        </>
                    )}
                </>
            );

        default:
            return <></>;
    }
};

export default Søknadsinformasjon;
