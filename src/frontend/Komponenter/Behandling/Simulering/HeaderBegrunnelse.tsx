import React from 'react';
import { BodyLong, Label } from '@navikt/ds-react';
import styled from 'styled-components';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

const Liste = styled.ul`
    padding-left: 1rem;
    margin: 0 0 1rem 0;

    li::marker {
        color: ${ATextSubtle};
        font-size: 0.75rem;
    }
`;

const Tekst = styled(BodyLong)`
    padding-left: 1.25rem;
`;

export const HeaderBegrunnelse: React.FC = () => (
    <>
        <Label>Begrunnelse (internt notat)</Label>

        <BodyLong textColor="subtle">Dette må være med i vurderingen:</BodyLong>
        <Liste>
            <li>
                <Tekst textColor="subtle">Årsaken til feilutbetalingen</Tekst>
            </li>
            <li>
                <Tekst textColor="subtle">Hvordan feilutbetalingen ble oppdaget </Tekst>
            </li>
            <li>
                <Tekst textColor="subtle">
                    Hvem som oppdaget feilutbetalingen (bruker eller NAV)
                </Tekst>
            </li>
            <li>
                <Tekst textColor="subtle">Dato for når feilutbetalingen ble oppdaget</Tekst>
            </li>
            <li>
                <Tekst textColor="subtle">
                    Andre relevante opplysninger, for eksempel hva slags informasjon bruker har fått
                    eller tidligere feilutbetalingssaker Hvis det feilutbetalte beløpet er under 4
                    ganger rettsgebyret og du ikke skal kreve det tilbake, må du i tillegg ha
                    vurdert at bruker ikke har handlet forsettlig eller grovt uaktsomt.
                </Tekst>
            </li>
        </Liste>
        <BodyLong textColor="subtle">
            Hvis det feilutbetalte beløpet er under 4 ganger rettsgebyret og du ikke skal kreve det
            tilbake, må du i tillegg ha vurdert at bruker ikke har handlet forsettlig eller grovt
            uaktsomt.
        </BodyLong>
    </>
);
