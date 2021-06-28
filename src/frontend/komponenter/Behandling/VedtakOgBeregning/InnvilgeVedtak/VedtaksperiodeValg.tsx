import {
    EAktivitet,
    EPeriodeProperty,
    EPeriodetype,
    IValideringsfeil,
    IVedtaksperiode,
    periodeVariantTilProperty,
} from '../../../../typer/vedtak';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode from '../../../Felleskomponenter/MånedÅr/MånedÅrPeriode';
import React from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../context/BehandlingContext';
import VedtakperiodeSelect from './VedtakperiodeSelect';
import LeggTilKnapp from '../../../Felleskomponenter/Knapper/LeggTilKnapp';
import FjernKnapp from '../../../Felleskomponenter/Knapper/FjernKnapp';
import { ListState } from '../../../../hooks/felles/useListState';
import { månederMellom, månedÅrTilDate } from '../../../../utils/dato';
import { Element } from 'nav-frontend-typografi';

const VedtakPeriodeContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'periodetype aktivitetstype fraOgMedVelger tilOgMedVelger antallMåneder fjernknapp';
    grid-template-columns: 14rem 14rem 13rem 13rem 4rem 4rem;
    grid-template-rows: auto;
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
    margin-bottom: 1rem;
    }
`;

const KolonneHeaderWrapper = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'periodetype aktivitetstype fraOgMedVelger tilOgMedVelger';
    grid-template-columns: 14rem 14rem 12rem 12rem;
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
    margin-bottom: 1rem;
    }
`;

const StyledElement = styled(Element)`
    margin-top: 0.65rem;
`;
interface Props {
    vedtaksperiodeListe: ListState<IVedtaksperiode>;
    valideringsfeil?: IValideringsfeil['vedtak'];
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

const VedtaksperiodeValg: React.FC<Props> = ({ vedtaksperiodeListe, valideringsfeil }) => {
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
            <KolonneHeaderWrapper lesevisning={behandlingErRedigerbar}>
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
                    <VedtakPeriodeContainer key={index} lesevisning={behandlingErRedigerbar}>
                        <VedtakperiodeSelect
                            feil={valideringsfeil && valideringsfeil[index]?.type}
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
                            aktivitetfeil={
                                valideringsfeil && valideringsfeil[index]?.aktivitetstype
                            }
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
                            feilmelding={valideringsfeil && valideringsfeil[index].periode}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        {antallMåneder && <StyledElement>{`${antallMåneder} mnd`}</StyledElement>}
                        {skalViseFjernKnapp && (
                            <FjernKnapp
                                onClick={() => vedtaksperiodeListe.remove(index)}
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
