import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { IAdresseopplysninger } from '../vilkår';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    data?: IAdresseopplysninger;
}

export const Addresseopplysninger: FC<Props> = ({ data }) => {
    if (!data) {
        return null;
    }
    return (
        <>
            <Søknadsgrunnlag />
            <BodyShortSmall>Bor på denne adressen ({data.adresse})</BodyShortSmall>
            <BooleanTekst value={data.søkerBorPåRegistrertAdresse} />

            {data.harMeldtAdresseendring && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Har meldt adresseendring til Folkeregisteret</BodyShortSmall>
                    <BooleanTekst value={data.harMeldtAdresseendring} />
                </>
            )}
        </>
    );
};
