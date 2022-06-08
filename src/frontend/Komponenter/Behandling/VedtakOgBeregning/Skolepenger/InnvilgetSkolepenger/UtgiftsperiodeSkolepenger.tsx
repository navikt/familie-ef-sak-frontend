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

const Utgiftsrad = styled.div<{ lesevisning?: boolean; erHeader?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger utgifter stønad';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '10rem 10rem 5rem' : '12rem 12rem 5rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: ${(props) => (props.erHeader ? '0,5rem' : 0)};
`;

const StyledInputMedTusenSkille = styled(InputMedTusenSkille)`
    text-align: left;
`;

const UtgiftsperiodeSkolepenger: React.FC<
    ValideringsPropsMedOppdatering<SkolepengerUtgift> & { låsteUtgiftIder: string[] }
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

    const fjernUtgift = (index: number) => {
        oppdater([...data.slice(0, index), ...data.slice(index + 1)]);
        settValideringsFeil((valideringsfeil || []).filter((_, i) => i !== index));
    };

    return (
        <div style={{ marginLeft: '1rem' }}>
            <Utgiftsrad>
                <Element>Utbetalingsmåned</Element>
                <Element>Utgifter</Element>
                <Element>Stønad</Element>
            </Utgiftsrad>
            {data.map((utgift, index) => {
                const erLåstFraForrigeBehandling = låsteUtgiftIder.indexOf(utgift.id) > -1;
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    index === data.length - 1 &&
                    index !== 0 &&
                    !erLåstFraForrigeBehandling;
                return (
                    <Utgiftsrad key={index}>
                        <MånedÅrVelger
                            årMånedInitiell={utgift.årMånedFra}
                            //label={datoFraTekst}
                            onEndret={(verdi) => {
                                oppdaterUtgift(index, 'årMånedFra', verdi);
                            }}
                            antallÅrTilbake={10}
                            antallÅrFrem={4}
                            lesevisning={erLesevisning}
                            feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                            disabled={erLåstFraForrigeBehandling}
                        />
                        <StyledInputMedTusenSkille
                            onKeyPress={tilHeltall}
                            type="number"
                            value={harTallverdi(utgift.utgifter) ? utgift.utgifter : ''}
                            feil={valideringsfeil && valideringsfeil[index]?.utgifter}
                            onChange={(e) => {
                                oppdaterUtgift(index, 'utgifter', tilTallverdi(e.target.value));
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
                                oppdaterUtgift(index, 'stønad', tilTallverdi(e.target.value));
                            }}
                            erLesevisning={erLesevisning}
                            disabled={erLåstFraForrigeBehandling}
                        />
                        {skalViseFjernKnapp && (
                            <FjernKnapp
                                onClick={() => fjernUtgift(index)}
                                knappetekst="Fjern vedtaksperiode"
                            />
                        )}
                    </Utgiftsrad>
                );
            })}
            <LeggTilKnapp
                onClick={() => oppdater([...data, tomUtgift()])}
                knappetekst="Legg til utgift"
                hidden={!behandlingErRedigerbar}
            />
        </div>
    );
};

export default UtgiftsperiodeSkolepenger;
