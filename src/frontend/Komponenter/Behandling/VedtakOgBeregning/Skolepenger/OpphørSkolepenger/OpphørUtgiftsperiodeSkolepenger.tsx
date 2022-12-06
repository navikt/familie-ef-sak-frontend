import styled from 'styled-components';
import React from 'react';
import { SkolepengerUtgift } from '../../../../../App/typer/vedtak';
import { SkolepengerOpphørProps } from '../typer';
import {
    formaterIsoMånedÅrFull,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../../../App/utils/formatter';
import { locateIndexToRestorePreviousItemInCurrentItems } from '../utils';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import TilbakestillKnapp from '../../../../../Felles/Knapper/TilbakestillKnapp';
import { SmallTextLabel } from '../../../../../Felles/Visningskomponenter/Tekster';
import { NavdsSemanticColorBorder } from '@navikt/ds-tokens/dist/tokens';

const Utgiftsrad = styled.div<{
    lesevisning?: boolean;
    erHeader?: boolean;
    erFjernet?: boolean;
}>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger utgifter stønad';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '9rem 4rem 4rem' : '12rem 5rem 5rem 4rem'};
    grid-gap: 0.5rem;
    margin-bottom: ${(props) => (props.erHeader ? '0rem' : '0.5rem')};
    text-decoration: ${(props) => (props.erFjernet ? 'line-through' : 'inherit')};
    align-items: center;
`;

const TilbakestillButton = styled(TilbakestillKnapp)`
    margin-bottom: 0.25rem;
`;

const FlexRow = styled.div`
    display: flex;
    margin-top: 0.75rem;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const FargetStrek = styled.span`
    border-left: 3px solid ${NavdsSemanticColorBorder};
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    margin-bottom: 0.75rem;
`;

const OpphørUtgiftsperiodeSkolepenger: React.FC<SkolepengerOpphørProps<SkolepengerUtgift>> = ({
    data,
    forrigeData,
    skoleårErFjernet,
    oppdater,
    behandlingErRedigerbar,
}) => {
    const erLesevisning = !behandlingErRedigerbar;

    const fjernUtgift = (id: string) => {
        oppdater(data.filter((utgift) => utgift.id !== id));
    };

    const tilbakestillUtgift = (forrigeIndex: number) => {
        const indexForElementFørId = locateIndexToRestorePreviousItemInCurrentItems(
            forrigeIndex,
            data,
            forrigeData,
            (t1, t2) => t1.id === t2.id
        );
        oppdater([
            ...data.slice(0, indexForElementFørId),
            forrigeData[forrigeIndex],
            ...data.slice(indexForElementFørId, data.length),
        ]);
    };

    const nyePerioder = data.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr }),
        {} as Record<string, SkolepengerUtgift>
    );

    return (
        <FlexRow>
            <FargetStrek />
            <div style={{ marginLeft: '1rem' }}>
                <FlexColumn>
                    <Utgiftsrad erHeader={true} lesevisning={erLesevisning}>
                        <SmallTextLabel>Utbetalingsmåned</SmallTextLabel>
                        <SmallTextLabel>Utgifter</SmallTextLabel>
                        <SmallTextLabel>Stønadsbeløp</SmallTextLabel>
                    </Utgiftsrad>
                    {forrigeData.map((utgift, index) => {
                        const erFjernet = !nyePerioder[utgift.id];

                        const harFlereUtgifter = data.length > 1;
                        const skalViseFjernKnapp =
                            behandlingErRedigerbar &&
                            !skoleårErFjernet &&
                            !erFjernet &&
                            harFlereUtgifter;

                        return (
                            <Utgiftsrad
                                erHeader={false}
                                lesevisning={erLesevisning}
                                key={index}
                                erFjernet={erFjernet}
                            >
                                <SmallTextLabel>
                                    {formaterIsoMånedÅrFull(utgift.årMånedFra)}
                                </SmallTextLabel>
                                <SmallTextLabel>
                                    {formaterTallMedTusenSkilleEllerStrek(utgift.utgifter)}
                                </SmallTextLabel>
                                <SmallTextLabel>
                                    {formaterTallMedTusenSkilleEllerStrek(utgift.stønad)}
                                </SmallTextLabel>
                                {skalViseFjernKnapp && (
                                    <FjernKnapp
                                        onClick={() => fjernUtgift(utgift.id)}
                                        ikontekst={'Fjern utgift'}
                                    />
                                )}
                                {behandlingErRedigerbar && !skoleårErFjernet && erFjernet && (
                                    <TilbakestillButton
                                        onClick={() => tilbakestillUtgift(index)}
                                        ikontekst={'Tilbakestill utgiftsrad'}
                                    />
                                )}
                            </Utgiftsrad>
                        );
                    })}
                </FlexColumn>
            </div>
        </FlexRow>
    );
};

export default OpphørUtgiftsperiodeSkolepenger;
