import {
    EAktivitet,
    EPeriodeProperty,
    EPeriodetype,
    IVedtaksperiode,
    periodeVariantTilProperty,
} from '../../../../typer/vedtak';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode from '../../../Felleskomponenter/MånedÅr/MånedÅrPeriode';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../context/BehandlingContext';
import VedtakperiodeSelect from './VedtakperiodeSelect';
import LeggTilKnapp from '../../../Felleskomponenter/Knapper/LeggTilKnapp';
import FjernKnapp from '../../../Felleskomponenter/Knapper/FjernKnapp';
import { ListState } from '../../../../hooks/felles/useListState';
import { månederMellom, månedÅrTilDate } from '../../../../utils/dato';
import { Element } from 'nav-frontend-typografi';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeVedtak';

const VedtakPeriodeContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'periodetype aktivitetstype fraOgMedVelger tilOgMedVelger antallMåneder fjernknapp';
    grid-template-columns: repeat(4, ${(props) =>
        props.lesevisning ? 10 : 14}rem) repeat(2, 4rem);
    grid-template-rows: auto;
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
    margin-bottom: 1rem;
    }
`;

const KolonneHeaderWrapper = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'periodetype aktivitetstype fraOgMedVelger tilOgMedVelger';
    grid-template-columns: repeat(4, ${(props) => (props.lesevisning ? 10 : 14)}rem);   
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
    margin-bottom: 1rem;
    }
`;

interface Props {
    vedtaksperiodeListe: ListState<IVedtaksperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['perioder'];
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

export const tomVedtaksperiodeRad: IVedtaksperiode = {
    periodeType: '' as EPeriodetype,
    aktivitet: '' as EAktivitet,
};

const kalkulerAntallMåneder = (årMånedFra?: string, årMånedTil?: string): number | undefined => {
    if (årMånedFra && årMånedTil) {
        return månederMellom(månedÅrTilDate(årMånedFra), månedÅrTilDate(årMånedTil));
    }
    return undefined;
};

const VedtaksperiodeValg: React.FC<Props> = ({
    vedtaksperiodeListe,
    valideringsfeil,
    setValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const oppdaterVedtakslisteElement = (
        index: number,
        property: EPeriodeProperty,
        value: string | number | undefined
    ) => {
        vedtaksperiodeListe.update(
            {
                ...vedtaksperiodeListe.value[index],
                [property]: value,
                ...(property === EPeriodeProperty.periodeType && {
                    [EPeriodeProperty.aktivitet]:
                        value === EPeriodetype.PERIODE_FØR_FØDSEL
                            ? EAktivitet.IKKE_AKTIVITETSPLIKT
                            : undefined,
                }),
            },
            index
        );
    };

    return (
        <>
            <KolonneHeaderWrapper lesevisning={!behandlingErRedigerbar}>
                <Element>Periodetype</Element>
                <Element>Aktivitet</Element>
                <Element>Fra og med</Element>
                <Element>Til og med</Element>
            </KolonneHeaderWrapper>
            {vedtaksperiodeListe.value.map((vedtaksperiode, index) => {
                const { periodeType, aktivitet, årMånedFra, årMånedTil } = vedtaksperiode;
                const antallMåneder = kalkulerAntallMåneder(årMånedFra, årMånedTil);
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    index === vedtaksperiodeListe.value.length - 1 &&
                    index !== 0;
                return (
                    <VedtakPeriodeContainer key={index} lesevisning={!behandlingErRedigerbar}>
                        <VedtakperiodeSelect
                            feil={valideringsfeil && valideringsfeil[index]?.periodeType}
                            oppdaterVedtakslisteElement={(property, value) =>
                                oppdaterVedtakslisteElement(index, property, value)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            periodeType={periodeType}
                            index={index}
                        />
                        <AktivitetspliktVelger
                            index={index}
                            aktivitet={aktivitet}
                            periodeType={periodeType}
                            oppdaterVedtakslisteElement={oppdaterVedtakslisteElement}
                            erLesevisning={!behandlingErRedigerbar}
                            aktivitetfeil={valideringsfeil && valideringsfeil[index]?.aktivitet}
                        />
                        <MånedÅrPeriode
                            årMånedFraInitiell={årMånedFra}
                            årMånedTilInitiell={årMånedTil}
                            index={index}
                            onEndre={(verdi, periodeVariant) => {
                                oppdaterVedtakslisteElement(
                                    index,
                                    periodeVariantTilProperty(periodeVariant),
                                    verdi
                                );
                            }}
                            feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        {antallMåneder && (
                            <Element
                                style={{ marginTop: behandlingErRedigerbar ? '0.65rem' : 0 }}
                            >{`${antallMåneder} mnd`}</Element>
                        )}
                        {skalViseFjernKnapp && (
                            <FjernKnapp
                                onClick={() => {
                                    vedtaksperiodeListe.remove(index);
                                    setValideringsFeil(
                                        (prevState: FormErrors<InnvilgeVedtakForm>) => {
                                            const perioder = prevState.perioder.filter(
                                                (_, i) => i !== index
                                            );
                                            return { ...prevState, perioder };
                                        }
                                    );
                                }}
                                knappetekst="Fjern vedtaksperiode"
                            />
                        )}
                    </VedtakPeriodeContainer>
                );
            })}
            <LeggTilKnapp
                onClick={() => vedtaksperiodeListe.push(tomVedtaksperiodeRad)}
                knappetekst="Legg til vedtaksperiode"
                hidden={!behandlingErRedigerbar}
            />
        </>
    );
};

export default VedtaksperiodeValg;
