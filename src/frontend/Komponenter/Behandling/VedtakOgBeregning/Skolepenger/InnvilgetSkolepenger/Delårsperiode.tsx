import React, { Dispatch, SetStateAction } from 'react';
import {
    ESkolepengerStudietype,
    IPeriodeSkolepenger,
    skolepengerStudietypeTilTekst,
} from '../../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../../App/utils/utils';
import styled from 'styled-components';
import { tomPeriode } from '../typer';
import InputUtenSpinner from '../../../../../Felles/Visningskomponenter/InputUtenSpinner';
import { kalkulerAntallMåneder } from '../../../../../App/utils/dato';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { Visningsmodus } from './Skoleårsperiode';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';

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

interface Props {
    antallDelårsperioder: number;
    behandlingErRedigerbar: boolean;
    delårsperiode: IPeriodeSkolepenger;
    erOpphør: boolean | undefined;
    index: number;
    settDelårsperioder: Dispatch<SetStateAction<IPeriodeSkolepenger[]>>;
    skoleårErFjernet: boolean | undefined;
    valideringsfeil: FormErrors<IPeriodeSkolepenger>[] | undefined;
    visningsmodus: Visningsmodus;
}

const Delårsperiode: React.FC<Props> = ({
    antallDelårsperioder,
    behandlingErRedigerbar,
    delårsperiode,
    erOpphør,
    index,
    settDelårsperioder,
    skoleårErFjernet,
    valideringsfeil,
    visningsmodus,
}) => {
    const { studietype, årMånedFra, årMånedTil, studiebelastning } = delårsperiode;

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
            { ...tomPeriode, studietype: prevState.at(0).studietype },
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

    const skalViseFjernKnapp =
        behandlingErRedigerbar &&
        index === antallDelårsperioder - 1 &&
        index !== 0 &&
        !skoleårErFjernet &&
        (visningsmodus === Visningsmodus.REDIGER_SKOLEÅRSPERIODE ||
            visningsmodus === Visningsmodus.INITIELL);

    const lesevisning: boolean =
        visningsmodus === Visningsmodus.REDIGER_UTGIFTSPERIODE ||
        visningsmodus === Visningsmodus.VISNING ||
        !behandlingErRedigerbar ||
        skoleårErFjernet === true;

    return (
        <>
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
                lesevisningVerdi={studietype ? skolepengerStudietypeTilTekst[studietype] : ''}
            >
                <option value="">Velg</option>
                {Object.keys(ESkolepengerStudietype).map((type) => (
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
                    oppdaterDelårsperiode(index, 'studiebelastning', tilTallverdi(e.target.value))
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
        </>
    );
};

export default Delårsperiode;
