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
import { tomSkoleårsperiode } from '../typer';
import InputUtenSpinner from '../../../../../Felles/Visningskomponenter/InputUtenSpinner';
import { kalkulerAntallMåneder } from '../../../../../App/utils/dato';
import { Label } from '@navikt/ds-react';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, max-content);
    gap: 0.25rem 1.5rem;
    text-decoration: inherit;
    align-items: start;
    .ny-rad {
        grid-column: 1;
    }
`;

const AntallMåneder = styled(BodyShortSmall)<{ erLesevisning: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: ${(props) => (props.erLesevisning ? '0rem' : '0.75rem')};
`;

const Input = styled(InputUtenSpinner)`
    width: 8rem;
    text-align: right;
`;

type Props = {
    delårsperioder: IPeriodeSkolepenger[];
    erLesevisning: boolean;
    oppdaterSkoleårsperiode: (data: IPeriodeSkolepenger[]) => void;
    settValideringsfeil: (errors: FormErrors<IPeriodeSkolepenger>[]) => void;
    valideringsfeil: FormErrors<IPeriodeSkolepenger>[] | undefined;
};

const Delårsperioder: React.FC<Props> = ({
    delårsperioder,
    oppdaterSkoleårsperiode,
    erLesevisning,
    valideringsfeil,
    settValideringsfeil,
}) => {
    const oppdaterUtgiftsPeriode = (
        index: number,
        property: keyof IPeriodeSkolepenger,
        value: string | number | undefined
    ) => {
        oppdaterSkoleårsperiode(
            delårsperioder.map((periode, i) =>
                index === i ? { ...periode, [property]: value } : periode
            )
        );
    };

    const fjernDelårsperiode = (index: number) => {
        oppdaterSkoleårsperiode([
            ...delårsperioder.slice(0, index),
            ...delårsperioder.slice(index + 1),
        ]);
        settValideringsfeil((valideringsfeil || []).filter((_, i) => i !== index));
    };

    const oppdaterStudietype = (studietype: ESkolepengerStudietype) => {
        oppdaterSkoleårsperiode(delårsperioder.map((periode) => ({ ...periode, studietype })));
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
        <Grid>
            <Label>Studietype</Label>
            <Label>Studiebelastning</Label>
            <Label>Periode fra og med</Label>
            <Label>Periode til og med</Label>
            <Label>Antall måneder</Label>
            {delårsperioder.map((periode, index) => {
                const { studietype, årMånedFra, årMånedTil, studiebelastning } = periode;
                const erFørsteRad = index === 0;
                const erSisteRad = index === delårsperioder.length - 1;
                const skalViseFjernKnapp = !erLesevisning && !erFørsteRad && erSisteRad;
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
                            erLesevisning={erLesevisning || index !== 0}
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
                        {!erLesevisning && (
                            <LeggTilKnapp
                                onClick={() =>
                                    oppdaterSkoleårsperiode([
                                        ...delårsperioder,
                                        {
                                            ...tomSkoleårsperiode,
                                            studietype: delårsperioder[0].studietype,
                                        },
                                    ])
                                }
                                variant="tertiary"
                            />
                        )}
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
    );
};

export default Delårsperioder;
