import React from 'react';
import {
    ESkolepengerStudietype,
    IPeriodeSkolepenger,
    skolepengerStudietypeTilTekst,
    studietyper,
} from '../../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../../App/utils/utils';
import styled from 'styled-components';
import { tomSkoleårsperiode, ValideringsPropsMedOppdatering } from '../typer';
import InputUtenSpinner from '../../../../../Felles/Visningskomponenter/InputUtenSpinner';
import { kalkulerAntallMåneder } from '../../../../../App/utils/dato';
import { Label } from '@navikt/ds-react';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import DisplayBlockKnapp, { Variant } from '../../../../../Felles/Knapper/DisplayBlockKnapp';

const Grid = styled.div<{
    skoleårErFjernet?: boolean;
}>`
    display: grid;
    grid-template-columns: repeat(6, max-content);
    gap: 0.25rem 1rem;
    text-decoration: ${(props) => (props.skoleårErFjernet ? 'line-through' : 'inherit')};

    .ny-rad {
        grid-column: 1;
    }
`;

const AntallMåneder = styled(BodyShortSmall)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Input = styled(InputUtenSpinner)`
    width: 8rem;
    text-align: right;
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
            <Grid skoleårErFjernet={skoleårErFjernet}>
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
                            <EnsligFamilieSelect
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
                            </EnsligFamilieSelect>
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
                            <AntallMåneder>
                                {kalkulerAntallMåneder(årMånedFra, årMånedTil)}
                            </AntallMåneder>
                            <Input
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
                                <FjernKnapp
                                    onClick={() => fjernDelårsperiode(index)}
                                    ikontekst={'Fjern delårsperiode'}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </Grid>
            {!erLesevisning && !erOpphør && (
                <DisplayBlockKnapp
                    onClick={() =>
                        oppdater([
                            ...data,
                            { ...tomSkoleårsperiode, studietype: data[0].studietype },
                        ])
                    }
                    knappetekst="Legg til periode"
                    variant={Variant.LEGG_TIL}
                />
            )}
        </>
    );
};

export default SkoleårDelårsperiode;
