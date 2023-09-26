import React from 'react';
import { IHistorikkForStønad, ITidligereVedtaksperioder } from './typer';
import TabellVisningMedTag from '../Tabell/TabellVisningMedTag';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import HistorikkIInfotrygdKort from './HistorikkIInfotrygdKort';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import HistorikkIEfKort from './HistorikkIEfKort';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
    text-align: left;
`;

const Tittel = styled(Heading)`
    text-decoration: underline;
`;

const Stønadskort: React.FC<{ stønad: IHistorikkForStønad }> = ({ stønad }) => {
    const { periodeHistorikkData, skalViseInfotrygdKort } = stønad;

    const stønadstypeTilOverskrift = (stønadstype: string) => {
        return stønadstype.charAt(0).toUpperCase() + stønadstype.slice(1).toLowerCase();
    };

    return (
        <>
            <Tittel level="3" size="small">
                {stønadstypeTilOverskrift(stønad.stønadstype)}
            </Tittel>
            <TabellVisningMedTag stønad={stønad} />
            {periodeHistorikkData && (
                <HistorikkIEfKort
                    periodeHistorikkData={periodeHistorikkData}
                    stønadstype={stønad.stønadstype}
                />
            )}
            {skalViseInfotrygdKort && <HistorikkIInfotrygdKort />}
        </>
    );
};

export const TidligereVedtaksperiodeKort: React.FC<{
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}> = ({ tidligereVedtaksperioder }) => {
    const historikkForStønader: IHistorikkForStønad[] = [
        {
            stønadstype: Stønadstype.OVERGANGSSTØNAD,
            skalViseInfotrygdKort: tidligereVedtaksperioder.infotrygd?.harTidligereOvergangsstønad,
            periodeHistorikkData: tidligereVedtaksperioder.sak?.periodeHistorikkOvergangsstønad,
            harHistorikkISak: tidligereVedtaksperioder.sak?.harTidligereOvergangsstønad,
            harHistorikkIInfotrygd: tidligereVedtaksperioder.infotrygd?.harTidligereOvergangsstønad,
        },
        {
            stønadstype: Stønadstype.BARNETILSYN,
            skalViseInfotrygdKort: tidligereVedtaksperioder.infotrygd?.harTidligereBarnetilsyn,
            periodeHistorikkData: undefined,
            harHistorikkISak: tidligereVedtaksperioder.sak?.harTidligereBarnetilsyn,
            harHistorikkIInfotrygd: tidligereVedtaksperioder.infotrygd?.harTidligereBarnetilsyn,
        },
        {
            stønadstype: Stønadstype.SKOLEPENGER,
            skalViseInfotrygdKort: tidligereVedtaksperioder.infotrygd?.harTidligereSkolepenger,
            periodeHistorikkData: undefined,
            harHistorikkISak: tidligereVedtaksperioder.sak?.harTidligereSkolepenger,
            harHistorikkIInfotrygd: tidligereVedtaksperioder.infotrygd?.harTidligereSkolepenger,
        },
    ];

    return (
        <Container>
            {historikkForStønader.map((stønad, i) => (
                <Stønadskort key={i} stønad={stønad} />
            ))}
        </Container>
    );
};
