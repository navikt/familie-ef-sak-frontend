import React, { FC } from 'react';
import { ISærligeTilsynsbehov } from '../../../../typer/overgangsstønad';
import { StyledTabell, StyledTabellWrapper } from '../../../Felleskomponenter/Visning/StyledTabell';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { DinSituasjonTilTekst, EDinSituasjon } from './typer';
import { v4 as uuidv4 } from 'uuid';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

const StyledList = styled.ul`
    list-style-type: square;
    margin: 0;
`;

const StyledSøknadsgrunnlag = styled(Søknadsgrunnlag)`
    align-self: auto;
`;

interface Props {
    dinSituasjon: EDinSituasjon[];
    særligTilsynsbehov: ISærligeTilsynsbehov[];
}

const hjelpetekst = (
    <Normaltekst>
        Mulig alternativer i søknadsdialog:
        <ul>
            <li>Jeg er syk</li>
            <li>Barnet mitt er sykt </li>
            <li>Jeg har søkt om barnepass, men ikke fått plass enda</li>
            <li>
                Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store
                sosiale problemer
            </li>
            <li>Nei</li>
        </ul>
    </Normaltekst>
);

const Annet: FC<Props> = ({ dinSituasjon, særligTilsynsbehov }) => {
    return (
        <>
            <StyledTabell kolonner={3}>
                <Element className={'førsteDataKolonne'}>Annet</Element>
                <Hjelpetekst type={PopoverOrientering.Under}>{hjelpetekst}</Hjelpetekst>

                <StyledSøknadsgrunnlag />
                <Normaltekst className={'førsteDataKolonne'}>Mer om søkers situasjon</Normaltekst>
                <StyledList>
                    {dinSituasjon.map((svarsalternativ) => (
                        <li key={svarsalternativ}>
                            <Normaltekst>{DinSituasjonTilTekst[svarsalternativ]}</Normaltekst>
                        </li>
                    ))}
                </StyledList>
                {særligTilsynsbehov.map((barnetsBehov) => (
                    <StyledTabellWrapper key={uuidv4()}>
                        <Søknadsgrunnlag />
                        <Normaltekst className={'førsteDataKolonne'}>
                            Om tilsynsbehov for:
                            {barnetsBehov.navn ||
                                `Barn ${
                                    barnetsBehov.erBarnetFødt ? 'født' : 'termindato'
                                } ${formaterNullableIsoDato(barnetsBehov.fødselTermindato)}`}
                        </Normaltekst>
                        <Normaltekst>{barnetsBehov.særligeTilsynsbehov}</Normaltekst>
                    </StyledTabellWrapper>
                ))}
            </StyledTabell>
        </>
    );
};

export default Annet;
