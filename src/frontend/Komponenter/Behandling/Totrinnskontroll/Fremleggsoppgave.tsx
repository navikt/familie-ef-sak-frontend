import * as React from 'react';
import { Alert, Checkbox, Label } from '@navikt/ds-react';
import styled from 'styled-components';

const Alertstripe = styled(Alert)`
    white-space: nowrap;
`;

const Fremleggsoppgave: React.FC<{
    behandlingErRedigerbar: boolean;
    håndterCheckboxEndring: () => void;
    kanOppretteFremlegg: boolean;
    skalOppretteFremlegg: boolean;
}> = ({
    behandlingErRedigerbar,
    håndterCheckboxEndring,
    kanOppretteFremlegg,
    skalOppretteFremlegg,
}) => {
    if (behandlingErRedigerbar && kanOppretteFremlegg) {
        return (
            <Alertstripe variant={'info'}>
                <Label>
                    Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:
                </Label>
                <Checkbox onChange={håndterCheckboxEndring} checked={skalOppretteFremlegg}>
                    Oppgave for kontroll av inntekt 1 år frem i tid
                </Checkbox>
            </Alertstripe>
        );
    } else if (!behandlingErRedigerbar && skalOppretteFremlegg) {
        return (
            <Alertstripe variant={'info'}>
                <Label>
                    Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:
                </Label>
                <Checkbox onChange={håndterCheckboxEndring} checked={skalOppretteFremlegg}>
                    Oppgave for kontroll av inntekt 1 år frem i tid
                </Checkbox>
            </Alertstripe>
        );
    } else if (!behandlingErRedigerbar && !skalOppretteFremlegg) {
        return (
            <Alertstripe variant={'info'}>
                <Label>
                    Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:
                </Label>
                <br />
                <i>Ingen oppgave opprettes automatisk</i>
            </Alertstripe>
        );
    }
    return <></>;
};

export default Fremleggsoppgave;
