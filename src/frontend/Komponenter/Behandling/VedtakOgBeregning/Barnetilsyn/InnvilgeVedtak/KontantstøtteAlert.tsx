import React from 'react';
import styled from 'styled-components';
import { FinnesKontantstøtteUtbetaling } from '../../../../../App/hooks/useHentKontantstøtteUtbetalinger';
import { Alert } from '@navikt/ds-react';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

interface Props {
    finnesKontantstøtteUtbetaling: FinnesKontantstøtteUtbetaling;
}
export const KontantstøtteAlert: React.FC<Props> = ({ finnesKontantstøtteUtbetaling }) => {
    return (
        <>
            {finnesKontantstøtteUtbetaling === FinnesKontantstøtteUtbetaling.JA && (
                <AlertStripe variant={'warning'} size={'small'}>
                    Bruker har eller har fått kontantstøtte.
                </AlertStripe>
            )}
            {finnesKontantstøtteUtbetaling === FinnesKontantstøtteUtbetaling.NEI && (
                <AlertStripe variant={'info'} size={'small'}>
                    Bruker verken mottar eller har mottatt kontantstøtte.
                </AlertStripe>
            )}
        </>
    );
};
