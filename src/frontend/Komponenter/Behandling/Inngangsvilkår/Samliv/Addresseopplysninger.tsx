import React, { FC } from 'react';
import { IAdresseopplysninger } from '../vilkår';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { TabellIkon } from '../../Vilkårpanel/TabellVisning';
import { mapTrueFalse } from '../../../../App/utils/formatter';

interface Props {
    data?: IAdresseopplysninger;
}

export const Addresseopplysninger: FC<Props> = ({ data }) => {
    if (!data) {
        return null;
    }
    return (
        <>
            <Informasjonsrad
                ikon={TabellIkon.SØKNAD}
                label={`Bor på denne adressen (${data.adresse})`}
                verdi={mapTrueFalse(data.søkerBorPåRegistrertAdresse)}
            />

            {data.harMeldtAdresseendring && (
                <Informasjonsrad
                    ikon={TabellIkon.SØKNAD}
                    label="Har meldt adresseendring til Folkeregisteret"
                    verdi={data.harMeldtAdresseendring}
                />
            )}
        </>
    );
};
