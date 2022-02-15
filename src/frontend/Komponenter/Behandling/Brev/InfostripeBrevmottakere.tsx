import React from 'react';
import { IBrevmottakere } from '../Brevmottakere/typer';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

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
        <AlertStripeInfo>
            Mottakere av brev:{<br />}
            {brevmottakereStreng}
        </AlertStripeInfo>
    );
};
