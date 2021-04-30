import { IBeløpsperiode } from '../../../typer/vedtak';
import React from 'react';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Ressurs } from '../../../typer/ressurs';
import TabellVisning from '../TabellVisning';
import { formaterNullableMånedÅr, formaterTallMedTusenSkille } from '../../../utils/formatter';

interface Props {
    beregnetStønad: Ressurs<IBeløpsperiode[]>;
}

const Utregningstabell: React.FC<Props> = ({ beregnetStønad }) => {
    return (
        <DataViewer response={{ beregnetStønad }}>
            {({ beregnetStønad }) => {
                return (
                    <>
                        <TabellVisning
                            tittel="Utregning"
                            tittelType={'undertittel'}
                            verdier={beregnetStønad}
                            kolonner={[
                                {
                                    overskrift: 'Periode',
                                    tekstVerdi: (d) =>
                                        `${formaterNullableMånedÅr(
                                            d.fraOgMedDato
                                        )} - ${formaterNullableMånedÅr(d.tilDato)}`,
                                },
                                {
                                    overskrift: 'Inntekt (år)',
                                    tekstVerdi: (d) =>
                                        formaterTallMedTusenSkille(d.beregningsgrunnlag.inntekt),
                                },
                                {
                                    overskrift: 'Beløp før samordning',
                                    tekstVerdi: (d) =>
                                        formaterTallMedTusenSkille(d.beløpFørSamordning),
                                },
                                {
                                    overskrift: 'Samordningsfradrag (mnd)',
                                    tekstVerdi: (d) =>
                                        formaterTallMedTusenSkille(
                                            d.beregningsgrunnlag.samordningsfradrag
                                        ),
                                },
                                {
                                    overskrift: 'Beløp',
                                    tekstVerdi: (d) => formaterTallMedTusenSkille(d.beløp),
                                },
                            ]}
                        />
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Utregningstabell;
