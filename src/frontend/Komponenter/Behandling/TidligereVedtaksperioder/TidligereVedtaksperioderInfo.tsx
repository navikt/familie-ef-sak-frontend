import React, { FC } from 'react';
import { IFinnesTidligereVedtaksperioder, ITidligereVedtaksperioder } from './typer';
import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import TabellVisning, { TabellIkon } from '../Tabell/TabellVisning';

function mapTrueFalse(bool: boolean): string {
    return bool ? 'Ja' : 'Nei';
}

const FinnesTidligereVedtaksperioder: FC<{
    finnesTidligereVedtaksperioder: IFinnesTidligereVedtaksperioder;
}> = ({ finnesTidligereVedtaksperioder }) => {
    const { overgangsstønad, barnetilsyn, skolepenger } = finnesTidligereVedtaksperioder;
    return (
        <GridTabell kolonner={3}>
            <>
                <TabellVisning
                    ikon={TabellIkon.REGISTER}
                    tittel="Har bruker historikk i Infotrygd"
                    verdier={[
                        { stønad: 'Overgangsstønad', verdi: overgangsstønad },
                        { stønad: 'Barnetilsyn', verdi: barnetilsyn },
                        { stønad: 'Skolepenger', verdi: skolepenger },
                    ]}
                    kolonner={[
                        {
                            overskrift: 'Stønad',
                            tekstVerdi: (d) => d.stønad,
                        },
                        {
                            overskrift: 'Historikk i Infotrygd',
                            tekstVerdi: (d) => mapTrueFalse(d.verdi),
                        },
                    ]}
                />
            </>
        </GridTabell>
    );
};

const TidligereVedtaksperioderInfo: FC<{ tidligereVedtaksperioder: ITidligereVedtaksperioder }> = ({
    tidligereVedtaksperioder,
}) => {
    const { infotrygd } = tidligereVedtaksperioder;

    if (!infotrygd) {
        return null;
    }

    return <FinnesTidligereVedtaksperioder finnesTidligereVedtaksperioder={infotrygd} />;
};

export default TidligereVedtaksperioderInfo;
