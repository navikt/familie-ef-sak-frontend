import styled from 'styled-components';
import { AGrayalpha600, AWhite } from '@navikt/ds-tokens/dist/tokens';

import { Neutral400A } from "@navikt/ds-tokens/js";

export const HorizontalScroll = styled.div<{
    $synligVedLukketMeny: string;
    $synligVedÅpenMeny: string;
    $åpenHøyremeny: boolean;
}>`
    @media screen and (max-width: ${(p) =>
            p.$åpenHøyremeny ? p.$synligVedÅpenMeny : p.$synligVedLukketMeny}) {
        // Noen mac innstillinger fjerner scroll-baren fra nettsiden. Denne stylingen gjør slik at baren alltid vises
        // dersom det er behov for horisontal scrolling. Kun støttet i chrome.
        ::-webkit-scrollbar {
            -webkit-appearance: none;
        }
        ::-webkit-scrollbar:horizontal {
            height: 11px;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 8px;
            border: 2px solid ${AWhite};
            background-color: ${Neutral400A};
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: ${AGrayalpha600};
        }
        ::-webkit-scrollbar-track {
            background-color: ${AWhite};
        }
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
    }
`;
