import styled from 'styled-components';
import React from 'react';
import { EUtgiftstype, SkolepengerUtgift, utgiftstyper } from '../../../../../App/typer/vedtak';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { ValideringsPropsMedOppdatering } from '../typer';
import navFarger from 'nav-frontend-core';
import {
    formaterIsoMånedÅrFull,
    formaterTallMedTusenSkilleEllerStrek,
} from '../../../../../App/utils/formatter';
import KansellerKnapp from '../../../../../Felles/Knapper/KansellerKnapp';
import { findIndexForElementBefore, utgiftstyperFormatert } from '../utils';

const Utgiftsrad = styled.div<{
    lesevisning?: boolean;
    erHeader?: boolean;
    valgtAlleUtgiftstyper: boolean;
}>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger utgiftstyper utgifter stønad';
    grid-template-columns: ${(props) => {
        if (props.lesevisning) {
            return props.valgtAlleUtgiftstyper ? '9rem 19rem 4rem 4rem' : '9rem 14rem 4rem 4rem';
        }
        return '12rem 23rem 5rem 5rem 4rem';
    }};
    grid-gap: 0.5rem;
    margin-bottom: ${(props) => (props.erHeader ? '0rem' : '0.5rem')};
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
    border-left: 3px solid ${navFarger.navGra80};
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    margin-bottom: 0.75rem;
`;

const UtgiftstypeContainer = styled.div`
    margin-bottom: 1rem;
    display: flex;
`;

const UtgiftstypeTekst = styled(Normaltekst)`
    margin-right: 0.3rem;
`;

const OpphørUtgiftsperiodeSkolepenger: React.FC<
    ValideringsPropsMedOppdatering<SkolepengerUtgift> & {
        forrigeUtgifter: SkolepengerUtgift[];
        skoleårErFjernet: boolean;
        harValgtAlleUtgiftstyper: boolean;
    }
> = ({
    data,
    forrigeUtgifter,
    skoleårErFjernet,
    oppdater,
    behandlingErRedigerbar,
    valideringsfeil,
    settValideringsFeil,
    harValgtAlleUtgiftstyper,
}) => {
    const erLesevisning = !behandlingErRedigerbar;

    const fjernUtgift = (id: string) => {
        const index = data.findIndex((d) => d.id === id);
        oppdater([...data.slice(0, index), ...data.slice(index + 1)]);
        settValideringsFeil((valideringsfeil || []).filter((_, i) => i !== index));
    };

    const tilbakestillUtgift = (forrigeIndex: number) => {
        const indexForElementFørId = findIndexForElementBefore(
            forrigeIndex,
            data,
            forrigeUtgifter,
            (t1, t2) => t1.id === t2.id
        );
        oppdater([
            ...data.slice(0, indexForElementFørId),
            forrigeUtgifter[forrigeIndex],
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
                    <Utgiftsrad
                        erHeader={true}
                        lesevisning={erLesevisning}
                        valgtAlleUtgiftstyper={harValgtAlleUtgiftstyper}
                    >
                        <Element>Utbetalingsmåned</Element>
                        <Element>Utgiftstyper</Element>
                        <Element>Utgifter</Element>
                        <Element>Stønadsbeløp</Element>
                    </Utgiftsrad>
                    {forrigeUtgifter.map((utgift, index) => {
                        const erFjernet = !nyePerioder[utgift.id];
                        const formaterteUtgiftstyper = utgiftstyperFormatert(utgiftstyper);

                        return (
                            <Utgiftsrad
                                erHeader={false}
                                lesevisning={erLesevisning}
                                key={index}
                                valgtAlleUtgiftstyper={harValgtAlleUtgiftstyper}
                            >
                                <Element>{formaterIsoMånedÅrFull(utgift.årMånedFra)}</Element>
                                <UtgiftstypeContainer>
                                    {formaterteUtgiftstyper
                                        .filter((periode) =>
                                            utgift.utgiftstyper.includes(
                                                periode.value as EUtgiftstype
                                            )
                                        )
                                        .map((periode) => (
                                            <UtgiftstypeTekst>{periode.label}</UtgiftstypeTekst>
                                        ))}
                                </UtgiftstypeContainer>
                                <Element>
                                    {formaterTallMedTusenSkilleEllerStrek(utgift.utgifter)}
                                </Element>
                                <Element>
                                    {formaterTallMedTusenSkilleEllerStrek(utgift.stønad)}
                                </Element>
                                {behandlingErRedigerbar && !skoleårErFjernet && !erFjernet && (
                                    <FjernKnapp
                                        onClick={() => fjernUtgift(utgift.id)}
                                        knappetekst="Fjern vedtaksperiode"
                                    />
                                )}
                                {behandlingErRedigerbar && !skoleårErFjernet && erFjernet && (
                                    <KansellerKnapp
                                        onClick={() => tilbakestillUtgift(index)}
                                        knappetekst="Tilbakestill utgift"
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
