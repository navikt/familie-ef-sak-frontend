import styled from 'styled-components';
import { AlertError } from './Alerts';

const AlertStripeFeilPreWrap = styled(AlertError)<{ alertvariant?: AlertStripeVariant }>`
    white-space: pre-wrap;
    word-wrap: break-word;
    grid-column: ${(props) =>
        props.alertvariant === AlertStripeVariant.SAMLIV_VILKÅR ? '1 / span 3' : ''};
`;

export enum AlertStripeVariant {
    IKKE_VALGT = 'IKKE_VALGT',
    SAMLIV_VILKÅR = 'SAMLIV_VILKÅR',
}

export default AlertStripeFeilPreWrap;
