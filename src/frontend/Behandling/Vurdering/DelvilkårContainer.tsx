import styled from 'styled-components';

export const DelvilkårContainer = styled.div`
    display: flex;

    .radiogruppe {
        width: 26rem;
    }

    .hjelpetekst__innhold {
        max-width: ${(props: { hjelpetekstMaxWidth?: number }) =>
            props.hjelpetekstMaxWidth || 22}rem;
    }

    .knapp {
        margin-top: 1rem;
    }
`;
