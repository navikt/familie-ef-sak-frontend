import React, { FC } from 'react';
import { IAdresseopplysninger } from '../vilkår';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { mapTrueFalse } from '../../../../App/utils/formatter';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

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
                ikon={VilkårInfoIkon.SØKNAD}
                label={`Bor på denne adressen (${data.adresse})`}
                verdi={mapTrueFalse(data.søkerBorPåRegistrertAdresse)}
            />

            {data.harMeldtAdresseendring && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Har meldt adresseendring til Folkeregisteret"
                    verdi={mapTrueFalse(data.harMeldtAdresseendring)}
                />
            )}
        </>
    );
};
