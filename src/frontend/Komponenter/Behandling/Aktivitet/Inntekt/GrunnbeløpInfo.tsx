import React, { FC, useEffect } from 'react';
import { formaterTallMedTusenSkille } from '../../../../App/utils/formatter';
import TabellVisning from '../../Tabell/TabellVisning';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { useHentNyesteGrunnbeløpOgAntallGrunnløpsperioderTilbakeITid } from '../../../../App/hooks/felles/useHentGrunbeløpsperioder';

export const GrunnbeløpInfo: FC = () => {
    const { grunnbeløpsperioder, hentGrunnbeløpsperioderCallback } =
        useHentNyesteGrunnbeløpOgAntallGrunnløpsperioderTilbakeITid(4);

    useEffect(() => {
        hentGrunnbeløpsperioderCallback();
    }, [hentGrunnbeløpsperioderCallback]);

    return (
        <div>
            <TabellVisning
                ikon={VilkårInfoIkon.PENGESEKK}
                tittel="6 ganger grunnbeløpet"
                verdier={grunnbeløpsperioder}
                minimerKolonnebredde={true}
                kolonner={[
                    {
                        overskrift: 'Fra',
                        tekstVerdi: (d) => d.periode.fom,
                    },
                    {
                        overskrift: '6G  (år)',
                        tekstVerdi: (d) =>
                            `${formaterTallMedTusenSkille(d.seksGangerGrunnbeløp)} kr`,
                    },
                    {
                        overskrift: '6G (måned)',
                        tekstVerdi: (d) =>
                            `${formaterTallMedTusenSkille(d.seksGangerGrunnbeløpPerMåned)} kr`,
                    },
                ]}
            />
        </div>
    );
};
