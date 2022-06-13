import styled from 'styled-components';
import React from 'react';
import {
    EUtgiftstype,
    SkolepengerUtgift,
    SkolepengerUtgiftProperty,
    utgiftstyper,
    utgiftstypeTilTekst,
} from '../../../../../App/typer/vedtak';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../../App/utils/utils';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { tomUtgift, ValideringsPropsMedOppdatering } from '../typer';
import InputMedTusenSkille from '../../../../../Felles/Visningskomponenter/InputMedTusenskille';
import navFarger from 'nav-frontend-core';
import { FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';

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
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: ${(props) => (props.erHeader ? '0rem' : '0.5rem')};
`;

const StyledInputMedTusenSkille = styled(InputMedTusenSkille)`
    text-align: left;
`;

const FlexRow = styled.div<{ lesevisning?: boolean }>`
    display: flex;
    margin-top: ${(props) => (props.lesevisning ? '0.75rem' : '0rem')};
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const FargetStrek = styled.span<{ lesevisning?: boolean }>`
    border-left: 3px solid
        ${(props) => (props.lesevisning ? navFarger.navGra80 : navFarger.navBlaLighten40)};
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

const UtgiftsperiodeSkolepenger: React.FC<
    ValideringsPropsMedOppdatering<SkolepengerUtgift> & {
        låsteUtgiftIder: string[];
        harValgtAlleUtgiftstyper: boolean;
    }
> = ({
    data,
    oppdater,
    behandlingErRedigerbar,
    valideringsfeil,
    settValideringsFeil,
    låsteUtgiftIder,
    harValgtAlleUtgiftstyper,
}) => {
    const erLesevisning = !behandlingErRedigerbar;
    const oppdaterUtgift = (
        index: number,
        property: keyof SkolepengerUtgift,
        value: string | number | EUtgiftstype[] | undefined
    ) => {
        oppdater(
            data.map((periode, i) => (index === i ? { ...periode, [property]: value } : periode))
        );
    };

    const fjernUtgift = (index: number) => {
        oppdater([...data.slice(0, index), ...data.slice(index + 1)]);
        settValideringsFeil((valideringsfeil || []).filter((_, i) => i !== index));
    };

    return (
        <FlexRow lesevisning={erLesevisning}>
            <FargetStrek lesevisning={erLesevisning} />
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
                        <Element>Stønad</Element>
                    </Utgiftsrad>
                    {data.map((utgift, index) => {
                        const erLåstFraForrigeBehandling = låsteUtgiftIder.indexOf(utgift.id) > -1;
                        const skalViseFjernKnapp =
                            behandlingErRedigerbar &&
                            index === data.length - 1 &&
                            index !== 0 &&
                            !erLåstFraForrigeBehandling;
                        const formaterteUtgiftstyper = utgiftstyperFormatert(utgiftstyper);
                        const ikkeValgteUtgiftstyper = formaterteUtgiftstyper.filter((type) =>
                            utgift.utgiftstyper.includes(type.value as EUtgiftstype)
                        );
                        return (
                            <Utgiftsrad
                                erHeader={false}
                                lesevisning={erLesevisning}
                                key={index}
                                valgtAlleUtgiftstyper={harValgtAlleUtgiftstyper}
                            >
                                <MånedÅrVelger
                                    årMånedInitiell={utgift.årMånedFra}
                                    //label={datoFraTekst}
                                    onEndret={(verdi) => {
                                        oppdaterUtgift(index, 'årMånedFra', verdi);
                                    }}
                                    antallÅrTilbake={10}
                                    antallÅrFrem={4}
                                    lesevisning={erLesevisning}
                                    feilmelding={
                                        valideringsfeil && valideringsfeil[index]?.årMånedFra
                                    }
                                    disabled={erLåstFraForrigeBehandling}
                                />
                                {behandlingErRedigerbar ? (
                                    /* @ts-ignore:next-line */
                                    <FamilieReactSelect
                                        placeholder={'Velg utgiftstyper'}
                                        options={formaterteUtgiftstyper}
                                        creatable={false}
                                        isMulti={true}
                                        defaultValue={ikkeValgteUtgiftstyper}
                                        value={ikkeValgteUtgiftstyper}
                                        feil={
                                            valideringsfeil &&
                                            valideringsfeil[index]?.utgiftstyper[0]
                                        }
                                        onChange={(valgtUtgiftstype) => {
                                            oppdaterUtgift(
                                                index,
                                                SkolepengerUtgiftProperty.utgiftstyper,
                                                valgtUtgiftstype === null
                                                    ? []
                                                    : [
                                                          ...mapValgtUtgiftstype(
                                                              valgtUtgiftstype as ISelectOption[]
                                                          ),
                                                      ]
                                            );
                                        }}
                                    />
                                ) : (
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
                                )}
                                <StyledInputMedTusenSkille
                                    onKeyPress={tilHeltall}
                                    type="number"
                                    value={harTallverdi(utgift.utgifter) ? utgift.utgifter : ''}
                                    feil={valideringsfeil && valideringsfeil[index]?.utgifter}
                                    onChange={(e) => {
                                        oppdaterUtgift(
                                            index,
                                            'utgifter',
                                            tilTallverdi(e.target.value)
                                        );
                                    }}
                                    erLesevisning={erLesevisning}
                                    disabled={erLåstFraForrigeBehandling}
                                />
                                <StyledInputMedTusenSkille
                                    onKeyPress={tilHeltall}
                                    type="number"
                                    value={harTallverdi(utgift.stønad) ? utgift.stønad : ''}
                                    feil={valideringsfeil && valideringsfeil[index]?.stønad}
                                    onChange={(e) => {
                                        oppdaterUtgift(
                                            index,
                                            'stønad',
                                            tilTallverdi(e.target.value)
                                        );
                                    }}
                                    erLesevisning={erLesevisning}
                                    disabled={erLåstFraForrigeBehandling}
                                />
                                {skalViseFjernKnapp && (
                                    <FjernKnapp
                                        onClick={() => fjernUtgift(index)}
                                        knappetekst="Fjern vedtaksperiode"
                                    />
                                )}
                            </Utgiftsrad>
                        );
                    })}
                </FlexColumn>
                <LeggTilKnapp
                    onClick={() => oppdater([...data, tomUtgift()])}
                    knappetekst="Legg til utgift"
                    hidden={!behandlingErRedigerbar}
                />
            </div>
        </FlexRow>
    );
};

const utgiftstyperFormatert = (utgiftstyper: EUtgiftstype[]) =>
    utgiftstyper.map<ISelectOption>((typeEnum) => {
        return {
            value: typeEnum,
            label: utgiftstypeTilTekst[typeEnum],
        };
    });

const mapValgtUtgiftstype = (valgtUtgiftstype: ISelectOption[]): EUtgiftstype[] => {
    return valgtUtgiftstype.map((type) => type.value as EUtgiftstype);
};

export default UtgiftsperiodeSkolepenger;
