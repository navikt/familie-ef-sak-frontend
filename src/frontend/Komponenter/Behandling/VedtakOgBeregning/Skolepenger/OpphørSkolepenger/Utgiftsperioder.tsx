import styled from 'styled-components';
import React from 'react';
import { SkolepengerUtgift } from '../../../../../App/typer/vedtak';
import {
    formaterIsoMånedÅrFull,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../../../App/utils/formatter';
import { locateIndexToRestorePreviousItemInCurrentItems } from '../utils';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import TilbakestillKnapp from '../../../../../Felles/Knapper/TilbakestillKnapp';
import { SmallTextLabel } from '../../../../../Felles/Visningskomponenter/Tekster';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';

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
    column-gap: 1rem;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const VertikalStrek = styled.span`
    border-left: 3px solid ${ABorderStrong};
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    margin-bottom: 0.75rem;
`;

interface Props {
    behandlingErRedigerbar: boolean;
    data: SkolepengerUtgift[];
    forrigeData: SkolepengerUtgift[];
    oppdater: (data: SkolepengerUtgift[]) => void;
    skoleårErOpphørt: boolean;
}

const Utgiftsperioder: React.FC<Props> = ({
    behandlingErRedigerbar,
    data,
    forrigeData,
    oppdater,
    skoleårErOpphørt,
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
            <VertikalStrek />
            <FlexColumn>
                <Utgiftsrad erHeader={true} lesevisning={erLesevisning}>
                    <SmallTextLabel>Utbetalingsmåned</SmallTextLabel>
                    <SmallTextLabel>Utgifter</SmallTextLabel>
                    <SmallTextLabel>Stønadsbeløp</SmallTextLabel>
                </Utgiftsrad>
                {forrigeData.map((utgift, index) => {
                    const utgiftsperiodeErFjernet = !nyePerioder[utgift.id];

                    const harFlereUtgifter = data.length > 1;
                    const skalViseFjernKnapp =
                        behandlingErRedigerbar &&
                        !skoleårErOpphørt &&
                        !utgiftsperiodeErFjernet &&
                        harFlereUtgifter;

                    return (
                        <Utgiftsrad
                            erHeader={false}
                            lesevisning={erLesevisning}
                            key={index}
                            erFjernet={utgiftsperiodeErFjernet}
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
                            {behandlingErRedigerbar &&
                                !skoleårErOpphørt &&
                                utgiftsperiodeErFjernet && (
                                    <TilbakestillButton
                                        onClick={() => tilbakestillUtgift(index)}
                                        ikontekst={'Tilbakestill utgiftsrad'}
                                    />
                                )}
                        </Utgiftsrad>
                    );
                })}
            </FlexColumn>
        </FlexRow>
    );
};

export default Utgiftsperioder;
