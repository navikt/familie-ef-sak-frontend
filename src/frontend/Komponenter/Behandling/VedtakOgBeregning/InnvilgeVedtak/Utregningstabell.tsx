import React from 'react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Ressurs } from '../../../../App/typer/ressurs';
import TabellVisning from '../../Tabell/TabellVisning';
import {
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../../../App/utils/formatter';
import { IBeløpsperiode } from '../../../../App/typer/vedtak';

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
                                            d.periode.fradato
                                        )} - ${formaterNullableMånedÅr(d.periode.tildato)}`,
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
                                    overskrift: 'Stønadsbeløp',
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
