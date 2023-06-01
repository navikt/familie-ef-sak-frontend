import React, { FC } from 'react';
import { formaterTallMedTusenSkille } from '../../../../App/utils/formatter';
import TabellVisning from '../../Tabell/TabellVisning';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

export const GrunnbeløpInfo: FC = () => {
    const grunnbeløpGanger6 = [
        {
            fra: '01.05.2023',
            grunnbeløpÅr: 711720,
            grunnbeløpMåned: 59310,
        },
        {
            fra: '01.05.2022',
            grunnbeløpÅr: 668862,
            grunnbeløpMåned: 55739,
        },
    ];
    return (
        <div>
            <TabellVisning
                ikon={VilkårInfoIkon.PENGESEKK}
                tittel="6 ganger grunnbeløpet"
                verdier={grunnbeløpGanger6}
                minimerKolonnebredde={true}
                kolonner={[
                    {
                        overskrift: 'Fra',
                        tekstVerdi: (d) => d.fra,
                    },
                    {
                        overskrift: '6G  (år)',
                        tekstVerdi: (d) => `${formaterTallMedTusenSkille(d.grunnbeløpÅr)} kr`,
                    },
                    {
                        overskrift: '6G (måned)',
                        tekstVerdi: (d) => `${formaterTallMedTusenSkille(d.grunnbeløpMåned)} kr`,
                    },
                ]}
            />
        </div>
    );
};
