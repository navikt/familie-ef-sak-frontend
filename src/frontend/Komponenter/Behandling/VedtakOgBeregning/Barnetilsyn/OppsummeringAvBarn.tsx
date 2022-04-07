import React from 'react';
import styled from 'styled-components';
import { Heading, Label } from '@navikt/ds-react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { ResultatSwitch } from '../../../../Felles/Ikoner/ResultatSwitch';
import {
    IBarnMedSamvær,
    typeBarnepassordningTilTekst,
} from '../../Inngangsvilkår/Aleneomsorg/typer';
import { datoTilAlder, tilDato } from '../../../../App/utils/dato';
import { Vilkårsresultat } from '../../Inngangsvilkår/vilkår';

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
    barn: IBarnMedSamvær;
    vilkårsresultatAleneomsorg: Vilkårsresultat;
    vilkårsresultatAlderPåBarn: Vilkårsresultat;
}> = ({ barn, vilkårsresultatAleneomsorg, vilkårsresultatAlderPåBarn }) => {
    const fødselsdatostring = barn.registergrunnlag.fødselsdato;
    if (!fødselsdatostring) {
        return (
            <>
                Barn med id={barn.barnId} mangler fødelsdato, her er noe galt - kontakt brukerstøtte
            </>
        );
    }
    const alder = datoTilAlder(tilDato(fødselsdatostring));
    const navnOgAlder = `${barn.registergrunnlag.navn} (${alder})`;
    const barnepassordninger = barn.barnepass?.barnepassordninger || [];

    return (
        <Container>
            <Heading spacing size="small" level="5">
                {navnOgAlder}
            </Heading>
            <BorderWrapper>
                {barnepassordninger.length === 0 && (
                    <Normaltekst>Ingen søknadsinformasjon</Normaltekst>
                )}
                {barnepassordninger.map((barnepassordning, index) => {
                    return (
                        <React.Fragment key={index}>
                            <GridLinje>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <BoldTekst size="small">Barnepassordning</BoldTekst>
                                </IkonOgTekstWrapper>
                                <Label size="small">
                                    {typeBarnepassordningTilTekst[barnepassordning.type]}
                                </Label>
                            </GridLinje>
                            <GridLinje>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <MarginTekst>Navn passordning</MarginTekst>
                                </IkonOgTekstWrapper>
                                <Normaltekst>{barnepassordning.navn}</Normaltekst>
                            </GridLinje>
                            <GridLinje>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <MarginTekst>Periode passordning</MarginTekst>
                                </IkonOgTekstWrapper>
                                <Normaltekst>
                                    {barnepassordning.fra} - {barnepassordning.til}
                                </Normaltekst>
                            </GridLinje>
                            <NedersteGridLinje>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <MarginTekst>Utgifter</MarginTekst>
                                </IkonOgTekstWrapper>
                                <Normaltekst>{barnepassordning.beløp},-</Normaltekst>
                            </NedersteGridLinje>
                        </React.Fragment>
                    );
                })}
            </BorderWrapper>
            <FlexDiv>
                <ResultatIkonOgTekstWrapper>
                    <ResultatSwitch
                        evaluering={vilkårsresultatAleneomsorg === Vilkårsresultat.OPPFYLT}
                    />
                    <Ikontekst>Aleneomsorg</Ikontekst>
                </ResultatIkonOgTekstWrapper>
                <ResultatIkonOgTekstWrapper>
                    <ResultatSwitch
                        evaluering={vilkårsresultatAlderPåBarn === Vilkårsresultat.OPPFYLT}
                    />
                    <Ikontekst>Alder på barn</Ikontekst>
                </ResultatIkonOgTekstWrapper>
            </FlexDiv>
        </Container>
    );
};
