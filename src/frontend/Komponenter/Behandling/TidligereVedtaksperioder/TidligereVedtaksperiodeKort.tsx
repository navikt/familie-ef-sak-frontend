import React from 'react';
import { IStonader, ITidligereVedtaksperioder } from './typer';
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

const StønadsKort: React.FC<{ stonad: IStonader }> = ({ stonad }) => {
    const { historikkISak, viseInfotrygdKort } = stonad;

    const stønadstypeTilOverskrift = (stønadstype: string) => {
        return stønadstype.charAt(0).toUpperCase() + stønadstype.slice(1).toLowerCase();
    };

    return (
        <>
            <Tittel level="3" size="small">
                {stønadstypeTilOverskrift(stonad.stønadstype)}
            </Tittel>
            <TabellVisningMedTag stonad={stonad} />
            {historikkISak && (
                <HistorikkIEfKort historikkISak={historikkISak} stønadstype={stonad.stønadstype} />
            )}
            {viseInfotrygdKort && <HistorikkIInfotrygdKort />}
        </>
    );
};

export const TidligereVedtaksperiodeKort: React.FC<{
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}> = ({ tidligereVedtaksperioder }) => {
    const stønader: IStonader[] = [
        {
            stønadstype: Stønadstype.OVERGANGSSTØNAD,
            viseInfotrygdKort: tidligereVedtaksperioder.infotrygd?.harTidligereOvergangsstønad,
            historikkISak: tidligereVedtaksperioder.sak?.periodeHistorikkOvergangsstønad,
            verdier: {
                sak: tidligereVedtaksperioder.sak?.harTidligereOvergangsstønad,
                infotrygd: tidligereVedtaksperioder.infotrygd?.harTidligereOvergangsstønad,
            },
        },
        {
            stønadstype: Stønadstype.BARNETILSYN,
            viseInfotrygdKort: tidligereVedtaksperioder.infotrygd?.harTidligereBarnetilsyn,
            historikkISak: undefined,
            verdier: {
                sak: tidligereVedtaksperioder.sak?.harTidligereBarnetilsyn,
                infotrygd: tidligereVedtaksperioder.infotrygd?.harTidligereBarnetilsyn,
            },
        },
        {
            stønadstype: Stønadstype.SKOLEPENGER,
            viseInfotrygdKort: tidligereVedtaksperioder.infotrygd?.harTidligereSkolepenger,
            historikkISak: undefined,
            verdier: {
                sak: tidligereVedtaksperioder.sak?.harTidligereSkolepenger,
                infotrygd: tidligereVedtaksperioder.infotrygd?.harTidligereSkolepenger,
            },
        },
    ];

    return (
        <Container>
            {stønader.map((stonad, i) => (
                <StønadsKort key={i} stonad={stonad} />
            ))}
        </Container>
    );
};
