import React, { Dispatch, SetStateAction } from 'react';
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
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { Visningsmodus } from './Skoleårsperiode';

const Grid = styled.div<{
    erskoleårfjernet?: boolean;
}>`
    display: grid;
    grid-template-columns: repeat(7, max-content);
    gap: 0.25rem 1.5rem;
    text-decoration: ${(props) => (props.erskoleårfjernet === true ? 'line-through' : 'inherit')};
    align-items: start;

    .ny-rad {
        grid-column: 1;
    }
`;

const AntallMåneder = styled(BodyShortSmall)<{ lesevisning: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: ${(props) => (props.lesevisning ? '0rem' : '0.75rem')};
`;

const Input = styled(InputUtenSpinner)`
    width: 8rem;
    text-align: right;
`;

type Props = ValideringsPropsMedOppdatering<IPeriodeSkolepenger> & {
    delårsperioder: IPeriodeSkolepenger[];
    settDelårsperioder: Dispatch<SetStateAction<IPeriodeSkolepenger[]>>;
    visningsmodus: Visningsmodus;
};

const Delårsperioder: React.FC<Props> = ({
    behandlingErRedigerbar,
    delårsperioder,
    erOpphør,
    settDelårsperioder,
    settValideringsFeil,
    skoleårErFjernet,
    valideringsfeil,
    visningsmodus,
}) => {
    const oppdaterDelårsperiode = (
        index: number,
        property: keyof IPeriodeSkolepenger,
        value: string | number | undefined
    ) => {
        settDelårsperioder((prevState) =>
            prevState.map((periode, i) =>
                index === i ? { ...periode, [property]: value } : periode
            )
        );
    };

    const fjernDelårsperiode = (index: number) => {
        settDelårsperioder((prevState) => [
            ...prevState.slice(0, index),
            ...prevState.slice(index + 1),
        ]);
    };

    const oppdaterStudietype = (studietype: ESkolepengerStudietype) => {
        settDelårsperioder((prevState) => prevState.map((periode) => ({ ...periode, studietype })));
    };

    const leggTilDelårsPeriode = () => {
        settDelårsperioder((prevState) => [
            ...prevState,
            { ...tomSkoleårsperiode, studietype: prevState[0].studietype },
        ]);
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

    const lesevisning: boolean =
        visningsmodus === Visningsmodus.REDIGER_UTGIFTSPERIODE ||
        visningsmodus === Visningsmodus.VISNING ||
        !behandlingErRedigerbar ||
        skoleårErFjernet === true;

    return (
        <>
            <Grid erskoleårfjernet={skoleårErFjernet}>
                <Label>Studietype</Label>
                <Label>Studiebelastning</Label>
                <Label>Periode fra og med</Label>
                <Label>Periode til og med</Label>
                <Label>Antall måneder</Label>
                {delårsperioder.map((periode, index) => {
                    const { studietype, årMånedFra, årMånedTil, studiebelastning } = periode;
                    const skalViseFjernKnapp =
                        behandlingErRedigerbar &&
                        index === delårsperioder.length - 1 &&
                        index !== 0 &&
                        !skoleårErFjernet &&
                        (visningsmodus === Visningsmodus.REDIGER_SKOLEÅRSPERIODE ||
                            visningsmodus === Visningsmodus.INITIELL);
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
                                erLesevisning={lesevisning || erOpphør || index !== 0}
                                lesevisningVerdi={
                                    index === 0 && studietype
                                        ? skolepengerStudietypeTilTekst[studietype]
                                        : ''
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
                                    oppdaterDelårsperiode(
                                        index,
                                        'studiebelastning',
                                        tilTallverdi(e.target.value)
                                    )
                                }
                                erLesevisning={lesevisning}
                            />
                            <MånedÅrPeriode
                                årMånedFraInitiell={årMånedFra}
                                årMånedTilInitiell={årMånedTil}
                                index={index}
                                onEndre={(verdi, periodeVariant) =>
                                    oppdaterDelårsperiode(
                                        index,
                                        periodeVariantTilUtgiftsperiodeProperty(periodeVariant),
                                        verdi
                                    )
                                }
                                feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                                erLesevisning={lesevisning}
                            />
                            <AntallMåneder lesevisning={lesevisning}>
                                {kalkulerAntallMåneder(årMånedFra, årMånedTil)}
                            </AntallMåneder>
                            {!lesevisning && !erOpphør && (
                                <LeggTilKnapp onClick={leggTilDelårsPeriode} variant="tertiary" />
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
        </>
    );
};

export default Delårsperioder;
