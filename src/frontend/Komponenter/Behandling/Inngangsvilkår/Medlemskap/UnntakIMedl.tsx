import * as React from 'react';
import { FC, useMemo } from 'react';
import TabellVisning, { TabellIkon } from '../../Tabell/TabellVisning';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { IGyldigVedtakPeriode } from './typer';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { differenceInDays } from 'date-fns';

interface Props {
    gyldigeVedtaksPerioder: IGyldigVedtakPeriode[];
}

const UnntakIMedl: FC<Props> = ({ gyldigeVedtaksPerioder }) => {
    const perioderSortert = useMemo(
        () =>
            gyldigeVedtaksPerioder.sort((a, b) =>
                differenceInDays(new Date(b.tilogmedDato), new Date(a.tilogmedDato))
            ),
        [gyldigeVedtaksPerioder]
    );

    return (
        <TabellVisning
            ikon={TabellIkon.REGISTER}
            tittel="Gyldige vedtaksperioder i MEDL"
            verdier={perioderSortert}
            kolonner={[
                {
                    overskrift: 'Medlem i folketrygden',
                    tekstVerdi: (d) => <BooleanTekst value={d.erMedlemIFolketrygden} />,
                },
                {
                    overskrift: 'Fra',
                    tekstVerdi: (d) => formaterNullableIsoDato(d.fraogmedDato),
                },
                {
                    overskrift: 'Til',
                    tekstVerdi: (d) => formaterNullableIsoDato(d.tilogmedDato),
                },
            ]}
        />
    );
};

export default UnntakIMedl;
