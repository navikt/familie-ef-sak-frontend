import React from 'react';
import { BodyLong, Label } from '@navikt/ds-react';
import styled from 'styled-components';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

const Liste = styled.ul`
    padding-left: 1rem;
    margin: 0;

    li::marker {
        color: ${ATextSubtle};
        font-size: 0.75rem;
    }
`;

const ListeTekst = styled(BodyLong)`
    padding-left: 0.25rem;
`;

const Tekst = styled(BodyLong)`
    padding-top: 1.25rem;
`;

export const HeaderBegrunnelse: React.FC = () => (
    <>
        <Label>Begrunnelse (internt notat)</Label>

        <BodyLong textColor="subtle">Dette må være med i vurderingen:</BodyLong>
        <Liste>
            <li>
                <ListeTekst textColor="subtle">Årsaken til feilutbetalingen</ListeTekst>
            </li>
            <li>
                <ListeTekst textColor="subtle">Hvordan feilutbetalingen ble oppdaget </ListeTekst>
            </li>
            <li>
                <ListeTekst textColor="subtle">
                    Hvem som oppdaget feilutbetalingen (bruker eller NAV)
                </ListeTekst>
            </li>
            <li>
                <ListeTekst textColor="subtle">
                    Dato for når feilutbetalingen ble oppdaget
                </ListeTekst>
            </li>
            <li>
                <ListeTekst textColor="subtle">
                    Andre relevante opplysninger, for eksempel hva slags informasjon bruker har fått
                    eller tidligere feilutbetalingssaker
                </ListeTekst>
            </li>
        </Liste>
        <Tekst textColor="subtle">
            Hvis det feilutbetalte beløpet er under 4 rettsgebyr og beløpet ikke skal betales
            tilbake, må du i tillegg ha vurdert at bruker ikke har handlet forsettlig eller grovt
            uaktsomt.
        </Tekst>
    </>
);
