import React, { FC } from 'react';
import { ISærligeTilsynsbehov } from '../../../../App/typer/aktivitetstyper';
import { GridTabell, GridTabellRad } from '../../../../Felles/Visningskomponenter/GridTabell';
import styled from 'styled-components';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { DinSituasjonTilTekst, EDinSituasjon } from './typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { BodyLong, HelpText } from '@navikt/ds-react';
import {
    BodyLongSmall,
    BodyShortSmall,
    LabelSmallAsText,
} from '../../../../Felles/Visningskomponenter/Tekster';

const StyledList = styled.ul`
    list-style-type: square;
    margin: 0;
    padding-left: 1rem;
`;

const hjelpetekst = (
    <ul>
        <BodyLong>
            Mulig alternativer i søknadsdialog:
            <li>Jeg er syk</li>
            <li>Barnet mitt er sykt </li>
            <li>Jeg har søkt om barnepass, men ikke fått plass enda</li>
            <li>
                Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store
                sosiale problemer
            </li>
            <li>Nei</li>
        </BodyLong>
    </ul>
);

const TittelHjelpetekstWrapper = styled.div`
    display: flex;
    .litenSpacingHoyre {
        padding-right: 1rem;
    }
`;

interface Props {
    dinSituasjon: EDinSituasjon[];
    særligTilsynsbehov: ISærligeTilsynsbehov[];
}

const Annet: FC<Props> = ({ dinSituasjon, særligTilsynsbehov }) => {
    return (
        <>
            <GridTabell kolonner={3}>
                <TittelHjelpetekstWrapper className={'førsteDataKolonne'}>
                    <LabelSmallAsText className={'litenSpacingHoyre'}>Annet</LabelSmallAsText>
                    <HelpText placement={'top-start'}>{hjelpetekst}</HelpText>
                </TittelHjelpetekstWrapper>

                <Søknadsgrunnlag />
                <BodyShortSmall className={'førsteDataKolonne'}>
                    Mer om søkers situasjon
                </BodyShortSmall>
                <StyledList>
                    {dinSituasjon.map((svarsalternativ) => (
                        <li key={svarsalternativ}>
                            <BodyShortSmall>{DinSituasjonTilTekst[svarsalternativ]}</BodyShortSmall>
                        </li>
                    ))}
                </StyledList>

                <GridTabellRad kolonner={3} overTabellRadPadding={2}>
                    {særligTilsynsbehov.map((barnetsBehov) => (
                        <GridTabell key={barnetsBehov.id} kolonner={3} underTabellMargin={2}>
                            <Søknadsgrunnlag />
                            <BodyLongSmall>
                                Om tilsynsbehov for: <br />
                                {barnetsBehov.navn
                                    ? `${barnetsBehov.navn} `
                                    : `Barn ${
                                          barnetsBehov.erBarnetFødt ? 'født ' : 'termindato '
                                      } ${formaterNullableIsoDato(barnetsBehov.fødselTermindato)}`}
                            </BodyLongSmall>
                            <BodyShortSmall>{barnetsBehov.særligeTilsynsbehov}</BodyShortSmall>
                        </GridTabell>
                    ))}
                </GridTabellRad>
            </GridTabell>
        </>
    );
};

export default Annet;
