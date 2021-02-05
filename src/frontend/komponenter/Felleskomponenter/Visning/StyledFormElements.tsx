import styled from 'styled-components';

export const RadioContainer = styled.div`
    display: flex;

    .radiogruppe {
        width: 26rem;
    }

    .hjelpetekst__innhold {
        max-width: ${(props: { hjelpetekstMaxWidth?: number }) => props.hjelpetekstMaxWidth || 16}
            rem;
    }
`;
