import React from 'react';
import styled from 'styled-components';
import { EFinnesKontantstøtteUtbetaling } from '../../../../App/hooks/useHentKontantstøtteUtbetalinger';
import { Alert } from '@navikt/ds-react';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

interface Props {
    finnesKontantstøtteUtbetaling: EFinnesKontantstøtteUtbetaling;
}
export const KontantstøtteAlert: React.FC<Props> = ({ finnesKontantstøtteUtbetaling }) => {
    return (
        <>
            {finnesKontantstøtteUtbetaling === EFinnesKontantstøtteUtbetaling.JA && (
                <AlertStripe variant={'warning'} size={'small'}>
                    Bruker har eller har fått kontantstøtte.
                </AlertStripe>
            )}
            {finnesKontantstøtteUtbetaling === EFinnesKontantstøtteUtbetaling.NEI && (
                <AlertStripe variant={'info'} size={'small'}>
                    Bruker verken mottar eller har mottatt kontantstøtte.
                </AlertStripe>
            )}
        </>
    );
};
