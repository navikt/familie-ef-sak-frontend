import React from 'react';
import {
    IPeriodeSkolepenger,
    skolepengerStudietypeTilTekst,
} from '../../../../../App/typer/vedtak';
import { Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import { ValideringsPropsMedOppdatering } from '../typer';
import { kalkulerAntallMåneder } from '../../../../../App/utils/dato';
import { formaterIsoMånedÅrFull } from '../../../../../App/utils/formatter';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { findIndexForElementBefore } from '../utils';
import KansellerKnapp from '../../../../../Felles/Knapper/KansellerKnapp';

const SkoleårsperiodeRad = styled.div<{
    lesevisning?: boolean;
    erFjernet?: boolean;
    erHeader?: boolean;
}>`
    display: grid;
    grid-template-areas: 'studietype fraOgMedVelger tilOgMedVelger antallMnd studiebelastning fjernknapp';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '10rem 9rem 9rem 5rem 7rem' : '12rem 12rem 11.5rem 4rem 8rem 4rem'};
    grid-gap: 0.5rem;
    margin-bottom: 0rem;
    text-decoration: ${(props) => (props.erFjernet ? 'line-through' : 'inherit')};
`;

const OpphørSkoleårDelårsperiode: React.FC<
    ValideringsPropsMedOppdatering<IPeriodeSkolepenger> & {
        forrigePerioder: IPeriodeSkolepenger[];
        skoleårErFjernet: boolean;
    }
> = ({
    data,
    forrigePerioder,
    skoleårErFjernet,
    oppdater,
    behandlingErRedigerbar,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const fjernDelårsperiode = (periode: IPeriodeSkolepenger) => {
        const index = data.findIndex((d) => d.årMånedFra === periode.årMånedFra);
        oppdater([...data.slice(0, index), ...data.slice(index + 1)]);
        settValideringsFeil((valideringsfeil || []).filter((_, i) => i !== index));
    };

    const tilbakestillDelårsperiode = (forrigeIndex: number) => {
        const indexForElementFørId = findIndexForElementBefore(
            forrigeIndex,
            data,
            forrigePerioder,
            (t1, t2) => t1.årMånedFra === t2.årMånedFra
        );
        oppdater([
            ...data.slice(0, indexForElementFørId),
            forrigePerioder[forrigeIndex],
            ...data.slice(indexForElementFørId, data.length),
        ]);
    };

    const nyePerioder = data.reduce(
        (acc, curr) => ({ ...acc, [curr.årMånedFra]: curr }),
        {} as Record<string, IPeriodeSkolepenger>
    );

    return (
        <>
            <SkoleårsperiodeRad lesevisning={!behandlingErRedigerbar} erHeader>
                <Element>Studietype</Element>
                <Element>Periode fra og med</Element>
                <Element>Periode til og med</Element>
                <Element>Ant. mnd</Element>
                <Element>Studiebelastning</Element>
            </SkoleårsperiodeRad>
            {forrigePerioder.map((periode, index) => {
                const erFjernet = !nyePerioder[periode.årMånedFra];
                const { studietype, årMånedFra, årMånedTil, studiebelastning } = periode;
                const skalViseFjernKnapp = behandlingErRedigerbar && data.length > 1;
                return (
                    <SkoleårsperiodeRad
                        key={index}
                        lesevisning={!behandlingErRedigerbar}
                        erFjernet={erFjernet}
                    >
                        <Element>{studietype && skolepengerStudietypeTilTekst[studietype]}</Element>
                        <Element>{formaterIsoMånedÅrFull(årMånedFra)}</Element>
                        <Element>{formaterIsoMånedÅrFull(årMånedTil)}</Element>
                        <Element>{kalkulerAntallMåneder(årMånedFra, årMånedTil)}</Element>
                        <Element>{studiebelastning} %</Element>
                        {skalViseFjernKnapp && !skoleårErFjernet && !erFjernet && (
                            <FjernKnapp
                                onClick={() => fjernDelårsperiode(periode)}
                                knappetekst="Fjern delårsperiode"
                            />
                        )}
                        {behandlingErRedigerbar && !skoleårErFjernet && erFjernet && (
                            <KansellerKnapp
                                onClick={() => tilbakestillDelårsperiode(index)}
                                knappetekst="Tilbakestill utgift"
                            />
                        )}
                    </SkoleårsperiodeRad>
                );
            })}
        </>
    );
};

export default OpphørSkoleårDelårsperiode;
