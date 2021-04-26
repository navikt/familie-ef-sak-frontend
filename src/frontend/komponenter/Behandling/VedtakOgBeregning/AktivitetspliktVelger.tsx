import { EAktivitet, EPeriodeProperty, EPeriodetype } from '../../../typer/vedtak';
import TekstMedLabel from '../../Felleskomponenter/TekstMedLabel/TekstMedLabel';
import React from 'react';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';

interface Props {
    periodeType: EPeriodetype | undefined;
    aktivitet: EAktivitet;
    index: number;
    oppdaterVedtakslisteElement: (index: number, property: EPeriodeProperty, value: string) => void;
}

const StyledSelect = styled(Select)`
    max-width: 200px;
    margin-right: 2rem;
`;

const AktivitetKolonne = styled.div`
    width: 230px;
`;

const AktivitetspliktVelger: React.FC<Props> = (props: Props) => {
    const { periodeType, aktivitet, index, oppdaterVedtakslisteElement } = props;
    const aktivitetLabel = index === 0 ? 'Aktivitet' : '';

    switch (periodeType) {
        case EPeriodetype.HOVEDPERIODE:
            return (
                <AktivitetKolonne>
                    <StyledSelect
                        label={aktivitetLabel}
                        value={aktivitet}
                        onChange={(e) => {
                            oppdaterVedtakslisteElement(
                                index,
                                EPeriodeProperty.aktivitet,
                                e.target.value
                            );
                        }}
                    >
                        <option value="">Velg</option>
                        <optgroup label="Ingen aktivitetsplikt">
                            <option value={EAktivitet.BARN_UNDER_ETT_ÅR}>Barn er under 1 år</option>
                        </optgroup>
                        <optgroup label="Fyller aktivitetsplikt">
                            <option value={EAktivitet.FORSØRGER_I_ARBEID}>
                                Forsørger er i arbeid (§15-6 første ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_I_UTDANNING}>
                                Forsørger er i utdannings (§15-6 første ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_REELL_ARBEIDSSØKER}>
                                Forsørger er reell arbeidssøker (§15-6 første ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_ETABLERER_VIRKSOMHET}>
                                Forsørger etablerer egen virksomhet (§15-6 første ledd)
                            </option>
                        </optgroup>
                        <optgroup label="Fyller unntak for aktivitetsplikt">
                            <option value={EAktivitet.BARNET_SÆRLIG_TILSYNSKREVENDE}>
                                Barnet er særlig tilsynskrevende (§15-6 fjerde ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_MANGLER_TILSYNSORDNING}>
                                Forsørger mangler tilsynsordning (§15-6 femte ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_ER_SYK}>
                                Forsørger er syk (§15-6 femte ledd)
                            </option>
                            <option value={EAktivitet.BARNET_ER_SYKT}>
                                Barnet er sykt (§15-6 femte ledd)
                            </option>
                        </optgroup>
                    </StyledSelect>
                </AktivitetKolonne>
            );
        case EPeriodetype.PERIODE_FØR_FØDSEL:
            return (
                <AktivitetKolonne>
                    <TekstMedLabel label={aktivitetLabel} tekst="Ikke aktivitetsplikt" />
                </AktivitetKolonne>
            );
        default:
            return (
                <AktivitetKolonne>
                    <TekstMedLabel label={aktivitetLabel} tekst="-" />
                </AktivitetKolonne>
            );
    }
};
export default AktivitetspliktVelger;
