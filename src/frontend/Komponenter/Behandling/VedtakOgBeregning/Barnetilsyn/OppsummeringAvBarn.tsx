import React from 'react';
import { IBarnForBarnetilsyn } from './mockData';
import styled from 'styled-components';
import { Heading, Label } from '@navikt/ds-react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { ResultatSwitch } from '../../../../Felles/Ikoner/ResultatSwitch';

const Container = styled.div`
    margin: 1rem;
    margin-right: 0.5rem;
    padding: 1rem;
    background-color: ${navFarger.navGraBakgrunn};
`;

const BoldTekst = styled(Label)`
    margin-left: 0.25rem;
`;

const MarginTekst = styled(Normaltekst)`
    margin-left: 0.25rem;
`;

const IkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const GridLinje = styled.div`
    display: grid;
    grid-template-columns: 11rem 13rem;
    grid-gap: 1rem;
    margin-bottom: 0.75rem;
`;

const Ikontekst = styled(Normaltekst)`
    margin-left: 0.5rem;
`;

const NedersteGridLinje = styled(GridLinje)`
    margin-bottom: 1.25rem;
`;

const BorderWrapper = styled.div`
    margin-top: 1rem;
    border-bottom: 1px solid ${navFarger.navGra40};
    margin-bottom: 1.25rem;
`;

const ResultatIkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.5rem;
    margin-right: 4rem;
`;

const FlexDiv = styled.div`
    display: flex;
    justify-content: flex-start;
`;

export const OppsummeringAvBarn: React.FC<{
    barn: IBarnForBarnetilsyn;
}> = ({ barn }) => {
    const barnepassPeriode = `${barn.barnepassordning.datoFra} - ${barn.barnepassordning.datoTil}`;
    const navnOgAlder = `${barn.navn} (${barn.alder})`;
    const oppfyllerKriterieForAlder = parseInt(barn.alder) < 11; // TODO: Dersom barnet har bursdag før juli (07) så < 11. Dersom barnet har bursdag etter juli så < 10
    const oppfyllerKritereForAleneomsorg = true; // TODO: Finn vurdering for aleneomsorg på dette barnet

    return (
        <Container>
            <Heading spacing size="small" level="5">
                {navnOgAlder}
            </Heading>
            <BorderWrapper>
                <GridLinje>
                    <IkonOgTekstWrapper>
                        <Søknadsgrunnlag />
                        <BoldTekst size="small">Barnepassordning</BoldTekst>
                    </IkonOgTekstWrapper>
                    <Label size="small">{barn.barnepassordning.type}</Label>
                </GridLinje>
                <GridLinje>
                    <IkonOgTekstWrapper>
                        <Søknadsgrunnlag />
                        <MarginTekst>Navn passordning</MarginTekst>
                    </IkonOgTekstWrapper>
                    <Normaltekst>{barn.barnepassordning.navn}</Normaltekst>
                </GridLinje>
                <GridLinje>
                    <IkonOgTekstWrapper>
                        <Søknadsgrunnlag />
                        <MarginTekst>Periode passordning</MarginTekst>
                    </IkonOgTekstWrapper>
                    <Normaltekst>{barnepassPeriode}</Normaltekst>
                </GridLinje>
                <NedersteGridLinje>
                    <IkonOgTekstWrapper>
                        <Søknadsgrunnlag />
                        <MarginTekst>Utgifter</MarginTekst>
                    </IkonOgTekstWrapper>
                    <Normaltekst>{barn.barnepassordning.utgift},-</Normaltekst>
                </NedersteGridLinje>
            </BorderWrapper>
            <FlexDiv>
                <ResultatIkonOgTekstWrapper>
                    <ResultatSwitch evaluering={oppfyllerKritereForAleneomsorg} />
                    <Ikontekst>Aleneomsorg</Ikontekst>
                </ResultatIkonOgTekstWrapper>
                <ResultatIkonOgTekstWrapper>
                    <ResultatSwitch evaluering={oppfyllerKriterieForAlder} />
                    <Ikontekst>Alder på barn</Ikontekst>
                </ResultatIkonOgTekstWrapper>
            </FlexDiv>
        </Container>
    );
};
