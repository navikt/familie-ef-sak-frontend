import React from 'react';
import {
    ESkolepengerStudietype,
    IPeriodeSkolepenger,
    skolepengerStudietypeTilTekst,
} from '../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import { Element } from 'nav-frontend-typografi';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../App/utils/utils';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import styled from 'styled-components';
import { tomSkoleårsperiode, ValideringsPropsMedOppdatering } from './typer';
import InputUtenSpinner from '../../../../Felles/Visningskomponenter/InputUtenSpinner';
import { FamilieSelect } from '@navikt/familie-form-elements';

const SkoleårsperiodeRad = styled.div<{ lesevisning?: boolean; erHeader?: boolean }>`
    display: grid;
    grid-template-areas: 'studietype fraOgMedVelger tilOgMedVelger studiebelastning';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '10rem 10rem 10rem 7rem' : '12rem 12rem 12rem 8rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: ${(props) => (props.erHeader ? '0,5rem' : 0)};
`;

const StyledInput = styled(InputUtenSpinner)`
    text-align: left;
`;

const StyledSelect = styled(FamilieSelect)`
    min-width: 140px;
    max-width: 200px;
`;

const SkoleårDelårsperiode: React.FC<ValideringsPropsMedOppdatering<IPeriodeSkolepenger>> = ({
    data,
    oppdater,
    behandlingErRedigerbar,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const oppdaterUtgiftsPeriode = (
        index: number,
        property: keyof IPeriodeSkolepenger,
        value: string | number | undefined
    ) => {
        oppdater(
            data.map((periode, i) => (index === i ? { ...periode, [property]: value } : periode))
        );
    };

    const oppdaterStudietype = (studietype: ESkolepengerStudietype) => {
        oppdater(data.map((periode) => ({ ...periode, studietype })));
    };

    const periodeVariantTilUtgiftsperiodeProperty = (
        periodeVariant: PeriodeVariant
    ): keyof IPeriodeSkolepenger => {
        switch (periodeVariant) {
            case PeriodeVariant.ÅR_MÅNED_FRA:
                return 'årMånedFra';
            case PeriodeVariant.ÅR_MÅNED_TIL:
                return 'årMånedTil';
        }
    };

    return (
        <>
            <SkoleårsperiodeRad lesevisning={!behandlingErRedigerbar} erHeader>
                <Element>Studietype</Element>
                <Element>Periode fra og med</Element>
                <Element>Periode til og med</Element>
                <Element>Studiebelastning</Element>
            </SkoleårsperiodeRad>
            {data.map((periode, index) => {
                const { studietype, årMånedFra, årMånedTil, studiebelastning } = periode;
                const skalViseFjernKnapp =
                    behandlingErRedigerbar && index === data.length - 1 && index !== 0;
                console.log(valideringsfeil ? valideringsfeil[index] : '');
                return (
                    <>
                        <SkoleårsperiodeRad key={index} lesevisning={!behandlingErRedigerbar}>
                            <StyledSelect
                                aria-label="Periodetype"
                                value={studietype}
                                feil={valideringsfeil && valideringsfeil[index]?.studietype}
                                onChange={(e) => {
                                    oppdaterStudietype(e.target.value as ESkolepengerStudietype);
                                }}
                                erLesevisning={!behandlingErRedigerbar}
                                lesevisningVerdi={
                                    studietype && skolepengerStudietypeTilTekst[studietype]
                                }
                                /*erLesevisning={!behandlingErRedigerbar || index !== 0}
                                lesevisningVerdi={
                                    index === 0
                                        ? studietype && skolepengerStudietypeTilTekst[studietype]
                                        : ' '
                                }*/
                            >
                                <option value="">Velg</option>
                                {[ESkolepengerStudietype.HØGSKOLE_UNIVERSITET].map((type) => (
                                    <option value={type} key={type}>
                                        {skolepengerStudietypeTilTekst[type]}
                                    </option>
                                ))}
                            </StyledSelect>
                            <MånedÅrPeriode
                                årMånedFraInitiell={årMånedFra}
                                årMånedTilInitiell={årMånedTil}
                                index={index}
                                onEndre={(verdi, periodeVariant) => {
                                    oppdaterUtgiftsPeriode(
                                        index,
                                        periodeVariantTilUtgiftsperiodeProperty(periodeVariant),
                                        verdi
                                    );
                                }}
                                feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                                erLesevisning={!behandlingErRedigerbar}
                            />
                            <StyledInput
                                onKeyPress={tilHeltall}
                                type="number"
                                feil={valideringsfeil && valideringsfeil[index]?.studiebelastning}
                                value={harTallverdi(studiebelastning) ? studiebelastning : ''}
                                formatValue={(k) => k + ' %'}
                                onChange={(e) => {
                                    oppdaterUtgiftsPeriode(
                                        index,
                                        'studiebelastning',
                                        tilTallverdi(e.target.value)
                                    );
                                }}
                                erLesevisning={!behandlingErRedigerbar}
                            />
                            {skalViseFjernKnapp && (
                                <FjernKnapp
                                    onClick={() => {
                                        oppdater([
                                            ...data.slice(0, index),
                                            ...data.slice(index + 1),
                                        ]);
                                        settValideringsFeil(
                                            (valideringsfeil || []).filter((_, i) => i !== index)
                                        );
                                    }}
                                    knappetekst="Fjern vedtaksperiode"
                                />
                            )}
                        </SkoleårsperiodeRad>
                    </>
                );
            })}
            <LeggTilKnapp
                onClick={() => oppdater([...data, tomSkoleårsperiode])}
                knappetekst="Legg til periode"
                hidden={!behandlingErRedigerbar}
            />
        </>
    );
};

export default SkoleårDelårsperiode;
