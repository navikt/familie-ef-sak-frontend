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
import { ABorderDivider, AGray50 } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: ${AGray50};
    width: 26rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 0.75rem 1rem;
`;

const Divider = styled.div`
    border-bottom: 1px solid ${ABorderDivider};
`;

const IkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.35rem;
`;

const FlexSpaceAround = styled.div`
    display: flex;
    justify-content: space-around;
`;

const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 7.32rem;
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
    const søkesOmBarnetilsynForBarn = barn.barnepass?.skalHaBarnepass;

    const aleneomsorgVilkårsresultat = søkesOmBarnetilsynForBarn
        ? vilkårsresultatAleneomsorg
        : Vilkårsresultat.SKAL_IKKE_VURDERES;
    const alderPåBarnVilkårsresultat = søkesOmBarnetilsynForBarn
        ? vilkårsresultatAlderPåBarn
        : Vilkårsresultat.SKAL_IKKE_VURDERES;

    return (
        <Container>
            <Heading size="small" level="5">
                {navnOgAlder}
            </Heading>
            {barnepassordninger.length === 0 && (
                <FlexCenter>
                    <BodyShortSmall>Ingen søknadsinformasjon</BodyShortSmall>
                </FlexCenter>
            )}
            {barnepassordninger.map((barnepassordning, index) => {
                return (
                    <React.Fragment key={index}>
                        {søkesOmBarnetilsynForBarn ? (
                            <Grid>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <Label size="small">Barnepassordning</Label>
                                </IkonOgTekstWrapper>
                                <Label size="small">
                                    {typeBarnepassordningTilTekst[barnepassordning.type]}
                                </Label>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <BodyShortSmall>Navn passordning</BodyShortSmall>
                                </IkonOgTekstWrapper>
                                <BodyShortSmall>{barnepassordning.navn}</BodyShortSmall>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <BodyShortSmall>Periode passordning</BodyShortSmall>
                                </IkonOgTekstWrapper>
                                <BodyShortSmall>
                                    {formaterIsoDato(barnepassordning.fra)} -{' '}
                                    {formaterIsoDato(barnepassordning.til)}
                                </BodyShortSmall>
                                <IkonOgTekstWrapper>
                                    <Søknadsgrunnlag />
                                    <BodyShortSmall>Utgifter per måned</BodyShortSmall>
                                </IkonOgTekstWrapper>
                                <BodyShortSmall>{barnepassordning.beløp},-</BodyShortSmall>
                            </Grid>
                        ) : (
                            <FlexCenter>
                                <BodyShortSmall>Ikke søkt</BodyShortSmall>
                            </FlexCenter>
                        )}
                    </React.Fragment>
                );
            })}
            <Divider />
            <FlexSpaceAround>
                <IkonOgTekstWrapper>
                    <ResultatSwitch vilkårsresultat={aleneomsorgVilkårsresultat} />
                    <BodyShortSmall>Aleneomsorg</BodyShortSmall>
                </IkonOgTekstWrapper>
                <IkonOgTekstWrapper>
                    <ResultatSwitch vilkårsresultat={alderPåBarnVilkårsresultat} />
                    <BodyShortSmall>Alder på barn</BodyShortSmall>
                </IkonOgTekstWrapper>
            </FlexSpaceAround>
        </Container>
    );
};
