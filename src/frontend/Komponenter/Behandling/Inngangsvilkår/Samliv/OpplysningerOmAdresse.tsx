import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { IOpplysningerOmAdresse } from '../vilkår';

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
            <Normaltekst>Bor på denne adressen ({data.adresse})</Normaltekst>
            <BooleanTekst value={data.søkerBorPåRegistrertAdresse} />

            {data.harMeldtFlytteendring && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Har meldt adresseendring til Folkeregisteret</Normaltekst>
                    <BooleanTekst value={data.harMeldtFlytteendring} />
                </>
            )}
        </>
    );
};
