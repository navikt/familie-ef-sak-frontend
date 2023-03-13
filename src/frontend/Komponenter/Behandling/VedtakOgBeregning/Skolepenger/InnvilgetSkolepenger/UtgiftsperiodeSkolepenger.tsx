import styled from 'styled-components';
import React from 'react';
import { SkolepengerUtgift } from '../../../../../App/typer/vedtak';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../../App/utils/utils';
import { tomUtgift, ValideringsPropsMedOppdatering } from '../typer';
import InputMedTusenSkille from '../../../../../Felles/Visningskomponenter/InputMedTusenskille';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { SmallTextLabel } from '../../../../../Felles/Visningskomponenter/Tekster';
import { ABlue300, ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const FlexRow = styled.div`
    display: flex;
    gap: 1rem;
    padding: 0 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    grid-gap: 0.25rem 1rem;

    .ny-rad {
        grid-column: 1;
    }
`;

const VertikalDivider = styled.span<{ lesevisning?: boolean }>`
    border-left: 3px solid ${(props) => (props.lesevisning ? ABorderStrong : ABlue300)};
`;

const InputRightAligned = styled(InputMedTusenSkille)`
    text-align: right;
`;

const UtgiftsperiodeSkolepenger: React.FC<
    ValideringsPropsMedOppdatering<SkolepengerUtgift> & {
        låsteUtgiftIder: string[];
    }
> = ({
    data,
    oppdater,
    behandlingErRedigerbar,
    valideringsfeil,
    settValideringsFeil,
    låsteUtgiftIder,
}) => {
    const erLesevisning = !behandlingErRedigerbar;
    const oppdaterUtgift = (
        index: number,
        property: keyof SkolepengerUtgift,
        value: string | number | undefined
    ) => {
        oppdater(
            data.map((periode, i) => (index === i ? { ...periode, [property]: value } : periode))
        );
    };

    const fjernUtgift = (id: string) => {
        oppdater(data.filter((utgift) => utgift.id !== id));
        settValideringsFeil((valideringsfeil || []).filter((formErrors) => formErrors.id !== id));
    };

    return (
        <Container>
            <FlexRow>
                <VertikalDivider lesevisning={erLesevisning} />
                <Grid>
                    <SmallTextLabel>Utbetalingsmåned</SmallTextLabel>
                    <SmallTextLabel>Utgifter</SmallTextLabel>
                    <SmallTextLabel>Stønadsbeløp</SmallTextLabel>
                    {data.map((utgift, index) => {
                        const erLåstFraForrigeBehandling = låsteUtgiftIder.indexOf(utgift.id) > -1;
                        const skalViseFjernKnapp =
                            behandlingErRedigerbar && index !== 0 && !erLåstFraForrigeBehandling;
                        return (
                            <React.Fragment key={index}>
                                <MånedÅrVelger
                                    className="ny-rad"
                                    årMånedInitiell={utgift.årMånedFra}
                                    antallÅrTilbake={0}
                                    antallÅrFrem={0}
                                    lesevisning={true}
                                    onEndret={() => null}
                                />
                                <InputRightAligned
                                    label={'Utgifter'}
                                    hideLabel
                                    onKeyPress={tilHeltall}
                                    type="number"
                                    value={harTallverdi(utgift.utgifter) ? utgift.utgifter : ''}
                                    error={valideringsfeil && valideringsfeil[index]?.utgifter}
                                    onChange={(e) => {
                                        oppdaterUtgift(
                                            index,
                                            'utgifter',
                                            tilTallverdi(e.target.value)
                                        );
                                    }}
                                    erLesevisning={erLesevisning}
                                    disabled={erLåstFraForrigeBehandling}
                                />
                                <InputRightAligned
                                    label={'Stønadsbeløp'}
                                    hideLabel
                                    onKeyPress={tilHeltall}
                                    type="number"
                                    value={harTallverdi(utgift.stønad) ? utgift.stønad : ''}
                                    error={valideringsfeil && valideringsfeil[index]?.stønad}
                                    onChange={(e) => {
                                        oppdaterUtgift(
                                            index,
                                            'stønad',
                                            tilTallverdi(e.target.value)
                                        );
                                    }}
                                    erLesevisning={erLesevisning}
                                    disabled={erLåstFraForrigeBehandling}
                                />
                                {skalViseFjernKnapp && (
                                    <FjernKnapp
                                        onClick={() => fjernUtgift(utgift.id)}
                                        ikontekst={'Fjern utgiftsperiode'}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </Grid>
            </FlexRow>
            {behandlingErRedigerbar && (
                <LeggTilKnapp
                    onClick={() => oppdater([...data, tomUtgift()])}
                    knappetekst="Legg til utgift"
                />
            )}
        </Container>
    );
};

export default UtgiftsperiodeSkolepenger;
