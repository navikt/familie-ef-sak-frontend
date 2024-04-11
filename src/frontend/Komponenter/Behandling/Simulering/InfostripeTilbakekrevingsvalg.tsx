import { Alert, Heading } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

const DivMedMargin = styled.div`
    margin: 1rem 0;
`;

const StyledAlert = styled(Alert)`
    max-width: 60rem;
    margin: 1rem 0 0.25rem 0;
`;

const Liste = styled.ol`
    display: flex;
    flex-direction: column;
    list-style-type: disc;
    padding-bottom: 1rem;
    margin: 0;
`;

export const InfostripeTilbakekrevingsvalg: React.FC<{ erUnder4xRettsgebyr: boolean }> = ({
    erUnder4xRettsgebyr,
}) => (
    <StyledAlert variant={'info'}>
        <Heading spacing size="small" level="3">
            Informasjon om valg for tilbakekreving
        </Heading>
        {erUnder4xRettsgebyr && (
            <DivMedMargin>
                <strong>
                    Opprett automatisk behandling av tilbakekreving under 4 ganger rettsgebyret:
                </strong>
                <DivMedMargin>
                    Dette valget kan du bruke når alle punktene er oppfylt:
                    <Liste>
                        <li>Bruker har ikke handlet forsettlig eller grovt uaktsomt</li>
                        <li>Beløpet er under 4 ganger rettsgebyr</li>
                        <li>Beløpet skal ikke betales tilbake</li>
                    </Liste>
                    Saken blir automatisk behandlet og bruker får et vedtak om ikke tilbakebetaling.
                </DivMedMargin>
            </DivMedMargin>
        )}
        <DivMedMargin>
            <strong>Opprett tilbakekreving, send varsel:</strong> Brukes når du vet at det blir
            feilutbetaling
        </DivMedMargin>
        <DivMedMargin>
            <strong>Opprett tilbakekreving, ikke send varsel:</strong> Brukes når du vet at det blir
            feilutbetaling tilbake i tid, men må avvente beregning for inneværende måned før varsel
            sendes
        </DivMedMargin>
        <DivMedMargin>
            <strong>Avvent:</strong> Brukes i tilfeller hvor du ikke tror det blir en feilutbetaling
            i det hele tatt
        </DivMedMargin>
    </StyledAlert>
);
