import React from 'react';
import { ITilbakekrevingsvalg, TilbakekrevingsvalgTilTekst } from './Tilbakekreving';
import { BodyLong } from '@navikt/ds-react';
import styled from 'styled-components';

interface Props {
    år?: number;
    rettsgebyr?: number;
}

const Liste = styled.ul`
    list-style: none;
    margin: 0 0 1rem 0;
    padding: 0;
`;

const BodyLongMarginBottom = styled(BodyLong)`
    margin-bottom: 1rem;
`;

export const FireGangerRettsgebyr: React.FC<Props> = ({ år, rettsgebyr }) => (
    <>
        <BodyLongMarginBottom size="large">
            {TilbakekrevingsvalgTilTekst[ITilbakekrevingsvalg.OPPRETT_AUTOMATISK]}
        </BodyLongMarginBottom>
        <BodyLong size="small">Det er vurdert at</BodyLong>
        <Liste>
            <li>
                <BodyLong size="small">
                    - bruker ikke har handlet forsettlig eller grovt uaktsomt
                </BodyLong>
            </li>
            <li>
                <BodyLong size="small">
                    - beløpet er under 4 rettsgebyr (4 rettsgebyr i {år} er {rettsgebyr} kroner)
                </BodyLong>
            </li>
            <li>
                <BodyLong size="small">- beløpet ikke skal betales tilbake</BodyLong>
            </li>
        </Liste>
        <BodyLong size="small">
            Saken blir automatisk behandlet og bruker får et vedtak om ikke tilbakebetaling. Merk at
            det ikke er mulig å endre brevmottaker på denne typen tilbakekrevingsbehandling. Hvis du
            skal endre brevmottaker, må du velge et annet alternativ.
        </BodyLong>
    </>
);
