import styled from 'styled-components';

export const DelvilkårContainer = styled.div<{ hjelpetekstMaxWidth?: number }>`
    display: flex;

    .radiogruppe {
        width: 26rem;
    }

    .hjelpetekst__innhold {
        max-width: ${(props) => props.hjelpetekstMaxWidth || 22}rem;
    }

    .knapp {
        margin-top: 1rem;
    }
`;
