import styled from 'styled-components';
import React from 'react';
import { SkolepengerUtgift } from '../../../../../App/typer/vedtak';
import { Element } from 'nav-frontend-typografi';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../../App/utils/utils';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { tomUtgift, ValideringsPropsMedOppdatering } from '../typer';
import InputMedTusenSkille from '../../../../../Felles/Visningskomponenter/InputMedTusenskille';
import navFarger from 'nav-frontend-core';

const Utgiftsrad = styled.div<{
    lesevisning?: boolean;
    erHeader?: boolean;
}>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger utgifter stønad';
    grid-template-columns: ${(props) => {
        if (props.lesevisning) {
            return '9rem 4rem 4rem';
        }
        return '12rem 5rem 5rem 4rem';
    }};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: ${(props) => (props.erHeader ? '0rem' : '0.5rem')};
`;

const StyledInputMedTusenSkille = styled(InputMedTusenSkille)`
    text-align: left;
`;

const FlexRow = styled.div<{ lesevisning?: boolean }>`
    display: flex;
    margin-top: ${(props) => (props.lesevisning ? '0.75rem' : '0rem')};
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const FargetStrek = styled.span<{ lesevisning?: boolean }>`
    border-left: 3px solid
        ${(props) => (props.lesevisning ? navFarger.navGra80 : navFarger.navBlaLighten40)};
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    margin-bottom: 0.75rem;
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
        <FlexRow lesevisning={erLesevisning}>
            <FargetStrek lesevisning={erLesevisning} />
            <div style={{ marginLeft: '1rem' }}>
                <FlexColumn>
                    <Utgiftsrad erHeader={true} lesevisning={erLesevisning}>
                        <Element>Utbetalingsmåned</Element>
                        <Element>Utgifter</Element>
                        <Element>Stønadsbeløp</Element>
                    </Utgiftsrad>
                    {data.map((utgift, index) => {
                        const erLåstFraForrigeBehandling = låsteUtgiftIder.indexOf(utgift.id) > -1;
                        const skalViseFjernKnapp =
                            behandlingErRedigerbar && index !== 0 && !erLåstFraForrigeBehandling;
                        return (
                            <Utgiftsrad erHeader={false} lesevisning={erLesevisning} key={index}>
                                <MånedÅrVelger
                                    årMånedInitiell={utgift.årMånedFra}
                                    antallÅrTilbake={0}
                                    antallÅrFrem={0}
                                    lesevisning={true}
                                    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
                                    onEndret={() => {}}
                                />
                                <StyledInputMedTusenSkille
                                    onKeyPress={tilHeltall}
                                    type="number"
                                    value={harTallverdi(utgift.utgifter) ? utgift.utgifter : ''}
                                    feil={valideringsfeil && valideringsfeil[index]?.utgifter}
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
                                <StyledInputMedTusenSkille
                                    onKeyPress={tilHeltall}
                                    type="number"
                                    value={harTallverdi(utgift.stønad) ? utgift.stønad : ''}
                                    feil={valideringsfeil && valideringsfeil[index]?.stønad}
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
                                        knappetekst="Fjern vedtaksperiode"
                                    />
                                )}
                            </Utgiftsrad>
                        );
                    })}
                </FlexColumn>
                <LeggTilKnapp
                    onClick={() => oppdater([...data, tomUtgift()])}
                    knappetekst="Legg til utgift"
                    hidden={!behandlingErRedigerbar}
                />
            </div>
        </FlexRow>
    );
};

export default UtgiftsperiodeSkolepenger;
