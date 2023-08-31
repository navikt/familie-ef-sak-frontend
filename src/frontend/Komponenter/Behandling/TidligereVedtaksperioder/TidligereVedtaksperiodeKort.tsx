import React from 'react';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { ITidligereVedtaksperioder } from './typer';
import TabellVisningMedTag, { IStonader } from '../Tabell/TabellVisningMedTag';
import { OSHistorikKort } from './OSHistorikKort';

export const TidligereVedtaksperiodeKort: React.FC<{
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}> = ({ tidligereVedtaksperioder }) => {
    const stønader: IStonader[] = [
        {
            overskrift: 'Overgangsstønad',
            historikk: {
                sak: tidligereVedtaksperioder.sak,
                infotrygd: tidligereVedtaksperioder.infotrygd,
            },
            verdier: {
                stønad: Stønadstype.OVERGANGSSTØNAD,
                verdi: [
                    { sak: tidligereVedtaksperioder.sak?.harTidligereOvergangsstønad },
                    {
                        infotrygd: tidligereVedtaksperioder.infotrygd?.harTidligereOvergangsstønad,
                    },
                ],
            },
        },
        {
            overskrift: 'Barnetilsyn',
            verdier: {
                stønad: Stønadstype.BARNETILSYN,
                verdi: [
                    { sak: tidligereVedtaksperioder.sak?.harTidligereBarnetilsyn },
                    {
                        infotrygd: tidligereVedtaksperioder.infotrygd?.harTidligereBarnetilsyn,
                    },
                ],
            },
        },
        {
            overskrift: 'Skolepenger',
            verdier: {
                stønad: Stønadstype.SKOLEPENGER,
                verdi: [
                    { sak: tidligereVedtaksperioder.sak?.harTidligereSkolepenger },
                    {
                        infotrygd: tidligereVedtaksperioder.infotrygd?.harTidligereSkolepenger,
                    },
                ],
            },
        },
    ];

    return (
        <>
            {stønader.map((stonad) => (
                <>
                    {/* <pre>{JSON.stringify(stonad, null, 2)}</pre> */}
                    <TabellVisningMedTag stonad={stonad} />
                    <OSHistorikKort
                        infotrygd={stonad.historikk?.infotrygd}
                        sak={stonad.historikk?.sak}
                    />
                </>
            ))}
        </>
    );
};
