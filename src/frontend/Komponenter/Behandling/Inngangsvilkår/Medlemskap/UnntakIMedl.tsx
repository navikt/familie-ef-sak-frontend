import * as React from 'react';
import { FC, useMemo } from 'react';
import { formaterNullableIsoDato, mapTrueFalse } from '../../../../App/utils/formatter';
import { IGyldigVedtakPeriode } from './typer';
import { differenceInDays } from 'date-fns';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import TabellVisning from '../../Tabell/TabellVisning';

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
            ikon={VilkårInfoIkon.REGISTER}
            tittel="Gyldige vedtaksperioder i MEDL"
            verdier={perioderSortert}
            kolonner={[
                {
                    overskrift: 'Medlem i folketrygden',
                    tekstVerdi: (d) => mapTrueFalse(d.erMedlemIFolketrygden),
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
