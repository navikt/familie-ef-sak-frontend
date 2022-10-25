import React from 'react';
import { IBrevmottakere } from '../Brevmottakere/typer';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';

export const InfostripeBrevmottakere: React.FC<{ brevmottakere: IBrevmottakere }> = ({
    brevmottakere,
}) => {
    const brevmottakereStreng =
        [
            ...brevmottakere.personer.map(
                (mottaker) => `${mottaker.navn}  (${mottaker.mottakerRolle.toLowerCase()})`
            ),
            ...brevmottakere.organisasjoner.map(
                (mottaker) =>
                    `${mottaker.navnHosOrganisasjon} (${mottaker.mottakerRolle.toLowerCase()})`
            ),
        ].join(', ') + '.';
    return (
        <AlertInfo>
            Mottakere av brev:{<br />}
            {brevmottakereStreng}
        </AlertInfo>
    );
};
