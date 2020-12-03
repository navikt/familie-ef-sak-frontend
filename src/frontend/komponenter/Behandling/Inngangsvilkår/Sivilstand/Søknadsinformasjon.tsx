import React, { FC } from 'react';
import { SivilstandType } from '../../../../typer/personopplysninger';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { ISivilstandSøknadsgrunnlag } from './typer';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';

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
                    <Normaltekst>Gift i utlandet</Normaltekst>
                    {erUformeltGift !== undefined && <BooleanTekst value={erUformeltGift} />}

                    <Søknadsgrunnlag />
                    <Normaltekst>Skilt eller separert i utlandet</Normaltekst>
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
                    {søknad.søktOmSkilsmisseSeparasjon && (
                        <BooleanTekst value={søknad.søktOmSkilsmisseSeparasjon} />
                    )}

                    <Søknadsgrunnlag />
                    <Normaltekst>Dato</Normaltekst>
                    <Normaltekst>{søknad.datoSøktSeparasjon}</Normaltekst>
                </>
            );
        case SivilstandType.SEPARERT:
        case SivilstandType.SEPARERT_PARTNER:
            return (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Alene med barn fordi</Normaltekst>
                    <Normaltekst>{søknad.årsakEnslig}</Normaltekst>

                    <Søknadsgrunnlag />
                    <Normaltekst>Tidligere samboer</Normaltekst>
                    <Normaltekst>{`${tidligereSamboer?.navn}, ${
                        tidligereSamboer?.ident
                            ? tidligereSamboer?.ident
                            : tidligereSamboer?.fødselsdato
                    }`}</Normaltekst>

                    <Søknadsgrunnlag />
                    <Normaltekst>Dato for fraflytting</Normaltekst>
                    <Normaltekst>{søknad.fraflytningsdato}</Normaltekst>
                </>
            );

        default:
            return <></>;
    }
};

export default Søknadsinformasjon;
