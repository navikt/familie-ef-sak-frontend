import React from 'react';
import styled from 'styled-components';
import { Heading, Label } from '@navikt/ds-react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ResultatSwitch } from '../../../../Felles/Ikoner/ResultatSwitch';
import {
    IBarnMedSamvær,
    typeBarnepassordningTilTekst,
} from '../../Inngangsvilkår/Aleneomsorg/typer';
import { datoTilAlder, tilDato } from '../../../../App/utils/dato';
import { Vilkårsresultat } from '../../Inngangsvilkår/vilkår';
import { formaterIsoDato } from '../../../../App/utils/formatter';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { AGray50, ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

const BoldTekst = styled(Label)`
    margin-left: 0.25rem;
`;

const MarginTekst = styled(BodyShortSmall)`
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

const Ikontekst = styled(BodyShortSmall)`
    margin-left: 0.5rem;
`;

const NedersteGridLinje = styled(GridLinje)`
    margin-bottom: 1.25rem;
`;

const BorderWrapper = styled.div`
    margin-top: 1rem;
    border-bottom: 1px solid ${ABorderDivider};
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
                    <BodyShortSmall>Ingen søknadsinformasjon</BodyShortSmall>
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
                                <BodyShortSmall>{barnepassordning.navn}</BodyShortSmall>
                            </GridLinje>
                            <GridLinje>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <MarginTekst>Periode passordning</MarginTekst>
                                </IkonOgTekstWrapper>
                                <BodyShortSmall>
                                    {formaterIsoDato(barnepassordning.fra)} -{' '}
                                    {formaterIsoDato(barnepassordning.til)}
                                </BodyShortSmall>
                            </GridLinje>
                            <NedersteGridLinje>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <MarginTekst>Utgifter per måned</MarginTekst>
                                </IkonOgTekstWrapper>
                                <BodyShortSmall>{barnepassordning.beløp},-</BodyShortSmall>
                            </NedersteGridLinje>
                        </React.Fragment>
                    );
                })}
            </BorderWrapper>
            <FlexDiv>
                <ResultatIkonOgTekstWrapper>
                    <ResultatSwitch vilkårsresultat={vilkårsresultatAleneomsorg} />
                    <Ikontekst>Aleneomsorg</Ikontekst>
                </ResultatIkonOgTekstWrapper>
                <ResultatIkonOgTekstWrapper>
                    <ResultatSwitch vilkårsresultat={vilkårsresultatAlderPåBarn} />
                    <Ikontekst>Alder på barn</Ikontekst>
                </ResultatIkonOgTekstWrapper>
            </FlexDiv>
        </Container>
    );
};
