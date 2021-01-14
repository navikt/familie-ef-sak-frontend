import { FC, useMemo } from 'react';
import TabellVisning, { TabellIkon } from '../../TabellVisning';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import * as React from 'react';
import { IGyldigVedtakPeriode } from './typer';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
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
                    overskrift: 'Medlem i i folketrygden',
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
