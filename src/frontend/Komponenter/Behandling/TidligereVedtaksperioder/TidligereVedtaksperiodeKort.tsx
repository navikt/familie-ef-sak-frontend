import React from 'react';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { ITidligereVedtaksperioder } from './typer';
import TabellVisningMedTag, { IStonader } from '../Tabell/TabellVisningMedTag';
import { OSHistorikKort } from './OSHistorikKort';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
    text-align: left;
`;

export const TidligereVedtaksperiodeKort: React.FC<{
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}> = ({ tidligereVedtaksperioder }) => {
    const stønader: IStonader[] = [
        {
            overskrift: 'Overgangsstønad',
            historikk: {
                sak: tidligereVedtaksperioder.sak, // Endre til nytt navn med sak: tidligereVedtaksperioder.sak?.øyeblikksbildeAvPerioderOgPeriodetype,
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
        <Container>
            {stønader.map((stonad, i) => (
                <React.Fragment key={i}>
                    {/* <pre>{JSON.stringify(stonad, null, 2)}</pre> */}
                    <TabellVisningMedTag stonad={stonad} />
                    <OSHistorikKort
                        infotrygd={stonad.historikk?.infotrygd}
                        sak={stonad.historikk?.sak}
                    />
                </React.Fragment>
            ))}
        </Container>
    );
};
