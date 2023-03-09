import React from 'react';
import {
    ESkolepengerStudietype,
    IPeriodeSkolepenger,
    skolepengerStudietypeTilTekst,
    studietyper,
} from '../../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../../App/utils/utils';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import styled from 'styled-components';
import { tomSkoleårsperiode, ValideringsPropsMedOppdatering } from '../typer';
import InputUtenSpinner from '../../../../../Felles/Visningskomponenter/InputUtenSpinner';
import { kalkulerAntallMåneder } from '../../../../../App/utils/dato';
import { Label } from '@navikt/ds-react';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';

const Grid = styled.div<{
    lesevisning?: boolean;
    skoleårErFjernet?: boolean;
}>`
    display: grid;
    grid-template-columns: repeat(6, max-content);
    grid-gap: 0.5rem 1rem;

    text-decoration: ${(props) => (props.skoleårErFjernet ? 'line-through' : 'inherit')};
    .ny-rad {
        grid-column: 1;
    }
`;

const AntallMåneder = styled(BodyShortSmall)<{ erLesevisning: boolean }>`
    margin-top: ${(props) => (props.erLesevisning ? '0rem' : '0.65rem')};
    margin-right: ${(props) => (props.erLesevisning ? '1.2rem' : '0rem')};
    text-align: center;
`;

const StyledInput = styled(InputUtenSpinner)`
    width: 8rem;
    text-align: left;
`;

const StyledSelect = styled(EnsligFamilieSelect)`
    align-items: start;
    min-width: 140px;
    max-width: 200px;
`;

const IkonKnappWrapper = styled.div`
    display: block;
`;

const LeggTilPeriodeKnapp = styled(LeggTilKnapp)`
    width: 12rem;
`;

const SkoleårDelårsperiode: React.FC<ValideringsPropsMedOppdatering<IPeriodeSkolepenger>> = ({
    data,
    oppdater,
    erOpphør,
    skoleårErFjernet,
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

    const fjernDelårsperiode = (index: number) => {
        oppdater([...data.slice(0, index), ...data.slice(index + 1)]);
        settValideringsFeil((valideringsfeil || []).filter((_, i) => i !== index));
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

    const erLesevisning: boolean = !behandlingErRedigerbar || skoleårErFjernet === true;

    return (
        <>
            <Grid lesevisning={!behandlingErRedigerbar} skoleårErFjernet={skoleårErFjernet}>
                <Label>Studietype</Label>
                <Label>Periode fra og med</Label>
                <Label>Periode til og med</Label>
                <Label>Ant.</Label>
                <Label>Studiebelastning</Label>
                {data.map((periode, index) => {
                    const { studietype, årMånedFra, årMånedTil, studiebelastning } = periode;
                    const skalViseFjernKnapp =
                        behandlingErRedigerbar &&
                        index === data.length - 1 &&
                        index !== 0 &&
                        !skoleårErFjernet;
                    return (
                        <React.Fragment key={index}>
                            <StyledSelect
                                className={'ny-rad'}
                                label="Periodetype"
                                hideLabel
                                value={studietype}
                                error={valideringsfeil && valideringsfeil[index]?.studietype}
                                onChange={(e) => {
                                    oppdaterStudietype(e.target.value as ESkolepengerStudietype);
                                }}
                                erLesevisning={erLesevisning || erOpphør || index !== 0}
                                lesevisningVerdi={
                                    index === 0
                                        ? studietype && skolepengerStudietypeTilTekst[studietype]
                                        : ' '
                                }
                            >
                                <option value="">Velg</option>
                                {studietyper.map((type) => (
                                    <option value={type} key={type}>
                                        {skolepengerStudietypeTilTekst[type]}
                                    </option>
                                ))}
                            </StyledSelect>
                            <MånedÅrPeriode
                                årMånedFraInitiell={årMånedFra}
                                årMånedTilInitiell={årMånedTil}
                                index={index}
                                onEndre={(verdi, periodeVariant) =>
                                    oppdaterUtgiftsPeriode(
                                        index,
                                        periodeVariantTilUtgiftsperiodeProperty(periodeVariant),
                                        verdi
                                    )
                                }
                                feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                                erLesevisning={erLesevisning}
                            />
                            <AntallMåneder erLesevisning={erLesevisning}>
                                {kalkulerAntallMåneder(årMånedFra, årMånedTil)}
                            </AntallMåneder>
                            <StyledInput
                                label={'Studiebelastning'}
                                hideLabel
                                onKeyPress={tilHeltall}
                                type="number"
                                error={valideringsfeil && valideringsfeil[index]?.studiebelastning}
                                value={harTallverdi(studiebelastning) ? studiebelastning : ''}
                                formatValue={(k) => k + ' %'}
                                onChange={(e) =>
                                    oppdaterUtgiftsPeriode(
                                        index,
                                        'studiebelastning',
                                        tilTallverdi(e.target.value)
                                    )
                                }
                                erLesevisning={erLesevisning}
                            />
                            {skalViseFjernKnapp && (
                                <IkonKnappWrapper>
                                    <FjernKnapp
                                        onClick={() => fjernDelårsperiode(index)}
                                        ikontekst={'Fjern delårsperiode'}
                                    />
                                </IkonKnappWrapper>
                            )}
                        </React.Fragment>
                    );
                })}
            </Grid>
            {!erLesevisning && !erOpphør && (
                <LeggTilPeriodeKnapp
                    onClick={() =>
                        oppdater([
                            ...data,
                            { ...tomSkoleårsperiode, studietype: data[0].studietype },
                        ])
                    }
                    knappetekst="Legg til periode"
                />
            )}
        </>
    );
};

export default SkoleårDelårsperiode;
