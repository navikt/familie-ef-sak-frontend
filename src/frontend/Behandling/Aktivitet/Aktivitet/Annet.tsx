import React, { FC } from 'react';
import { ISærligeTilsynsbehov } from '../../../typer/overgangsstønad';
import { GridTabell, GridTabellRad } from '../../../Felleskomponenter/Visning/StyledTabell';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { DinSituasjonTilTekst, EDinSituasjon } from './typer';
import { formaterNullableIsoDato } from '../../../utils/formatter';

const StyledList = styled.ul`
    list-style-type: square;
    margin: 0;
    padding-left: 1rem;
`;

const hjelpetekst = (
    <ul>
        <Normaltekst>
            Mulig alternativer i søknadsdialog:
            <li>Jeg er syk</li>
            <li>Barnet mitt er sykt </li>
            <li>Jeg har søkt om barnepass, men ikke fått plass enda</li>
            <li>
                Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store
                sosiale problemer
            </li>
            <li>Nei</li>
        </Normaltekst>
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
                    <Element className={'litenSpacingHoyre'}>Annet</Element>
                    <Hjelpetekst type={PopoverOrientering.OverVenstre}>{hjelpetekst}</Hjelpetekst>
                </TittelHjelpetekstWrapper>

                <Søknadsgrunnlag />
                <Normaltekst className={'førsteDataKolonne'}>Mer om søkers situasjon</Normaltekst>
                <StyledList>
                    {dinSituasjon.map((svarsalternativ) => (
                        <li key={svarsalternativ}>
                            <Normaltekst>{DinSituasjonTilTekst[svarsalternativ]}</Normaltekst>
                        </li>
                    ))}
                </StyledList>

                <GridTabellRad kolonner={3} overTabellRadPadding={2}>
                    {særligTilsynsbehov.map((barnetsBehov) => (
                        <GridTabell key={barnetsBehov.id} kolonner={3} underTabellMargin={2}>
                            <Søknadsgrunnlag />
                            <Normaltekst>
                                Om tilsynsbehov for: <br />
                                {barnetsBehov.navn
                                    ? `${barnetsBehov.navn} `
                                    : `Barn ${
                                          barnetsBehov.erBarnetFødt ? 'født ' : 'termindato '
                                      } ${formaterNullableIsoDato(barnetsBehov.fødselTermindato)}`}
                            </Normaltekst>
                            <Normaltekst>{barnetsBehov.særligeTilsynsbehov}</Normaltekst>
                        </GridTabell>
                    ))}
                </GridTabellRad>
            </GridTabell>
        </>
    );
};

export default Annet;
