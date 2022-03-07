import React from 'react';
import { IBarnForBarnetilsyn } from './mockData';
import styled from 'styled-components';
import { Heading, Label } from '@navikt/ds-react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';

const Container = styled.div`
    margin: 1rem;
    margin-right: 0.5rem;
    padding: 1rem;
    background-color: ${navFarger.navGraBakgrunn};
`;

const BoldTekst = styled(Label)`
    margin-left: 0.25rem;
`;

const IkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const ResultatGrid = styled.div`
    display: grid;
    grid-template-columns: 11rem 13rem;
    grid-gap: 1rem;
    margin-bottom: 0.5rem;
`;

export const OppsummeringAvBarn: React.FC<{
    barn: IBarnForBarnetilsyn;
}> = ({ barn }) => {
    const barnepassPeriode = `${barn.barnepassordning.datoFra} - ${barn.barnepassordning.datoTil}`;
    const navnOgAlder = `${barn.navn} (${barn.alder})`;
    return (
        <Container>
            <Heading spacing size="small" level="5">
                {navnOgAlder}
            </Heading>
            <ResultatGrid>
                <IkonOgTekstWrapper>
                    <Søknadsgrunnlag />
                    <BoldTekst size="small">Barnepassordning:</BoldTekst>
                </IkonOgTekstWrapper>
                <Normaltekst>{barn.barnepassordning.type}</Normaltekst>
            </ResultatGrid>
            <ResultatGrid>
                <IkonOgTekstWrapper>
                    <Søknadsgrunnlag />
                    <BoldTekst size="small">Navn passordning:</BoldTekst>
                </IkonOgTekstWrapper>
                <Normaltekst>{barn.barnepassordning.navn}</Normaltekst>
            </ResultatGrid>
            <ResultatGrid>
                <IkonOgTekstWrapper>
                    <Søknadsgrunnlag />
                    <BoldTekst size="small">Periode passordning:</BoldTekst>
                </IkonOgTekstWrapper>
                <Normaltekst>{barnepassPeriode}</Normaltekst>
            </ResultatGrid>
            <ResultatGrid>
                <IkonOgTekstWrapper>
                    <Søknadsgrunnlag />
                    <BoldTekst size="small">Utgifter:</BoldTekst>
                </IkonOgTekstWrapper>
                <Normaltekst>{barn.barnepassordning.utgift},-</Normaltekst>
            </ResultatGrid>
        </Container>
    );
};
