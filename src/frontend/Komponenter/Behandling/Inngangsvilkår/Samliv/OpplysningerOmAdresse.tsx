import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { IOpplysningerOmAdresse } from '../vilkår';
import { BodyShort } from '@navikt/ds-react';

interface Props {
    data: IOpplysningerOmAdresse;
}

export const OpplysningerOmAdresse: FC<Props> = ({ data }) => {
    if (
        data.søkerBorPåRegistrertAdresse === undefined ||
        data.søkerBorPåRegistrertAdresse === null
    ) {
        return null;
    }
    return (
        <>
            <Søknadsgrunnlag />
            <BodyShort>Bor på denne adressen ({data.adresse})</BodyShort>
            <BooleanTekst value={data.søkerBorPåRegistrertAdresse} />

            {data.harMeldtFlytteendring && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShort>Har meldt adresseendring til Folkeregisteret</BodyShort>
                    <BooleanTekst value={data.harMeldtFlytteendring} />
                </>
            )}
        </>
    );
};
