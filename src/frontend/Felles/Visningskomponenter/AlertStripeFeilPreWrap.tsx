import styled from 'styled-components';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const AlertStripeFeilPreWrap = styled(AlertStripeFeil)<{ alertVariant?: AlertStripeVariant }>`
    white-space: pre-wrap;
    word-wrap: break-word;
    grid-column: ${(props) =>
        props.alertVariant === AlertStripeVariant.SAMLIV_VILKÅR ? '1 / span 3' : ''};
`;

export enum AlertStripeVariant {
    IKKE_VALGT = 'IKKE_VALGT',
    SAMLIV_VILKÅR = 'SAMLIV_VILKÅR',
}

export default AlertStripeFeilPreWrap;
