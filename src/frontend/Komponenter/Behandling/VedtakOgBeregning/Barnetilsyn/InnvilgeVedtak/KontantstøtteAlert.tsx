import React from 'react';
import styled from 'styled-components';
import { Alert } from '@navikt/ds-react';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

interface Props {
    harKontantstøttePerioder?: boolean;
}
export const KontantstøtteAlert: React.FC<Props> = ({ harKontantstøttePerioder }) => {
    if (harKontantstøttePerioder === null || harKontantstøttePerioder === undefined) {
        return null;
    }

    return (
        <>
            <AlertStripe variant={harKontantstøttePerioder ? 'warning' : 'info'} size={'small'}>
                {harKontantstøttePerioder
                    ? 'Bruker har eller har fått kontantstøtte.'
                    : 'Bruker verken mottar eller har mottatt kontantstøtte.'}
            </AlertStripe>
        </>
    );
};
