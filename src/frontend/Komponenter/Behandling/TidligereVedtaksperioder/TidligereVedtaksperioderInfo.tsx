import React, { FC } from 'react';
import { ITidligereInnvilgetVedtak, ITidligereVedtaksperioder } from './typer';
import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import TabellVisning, { TabellIkon } from '../Tabell/TabellVisning';

function mapTrueFalse(bool: boolean): string {
    return bool ? 'Ja' : 'Nei';
}

const FinnesTidligereVedtaksperioder: FC<{
    tidligereInnvilgetVedtak: ITidligereInnvilgetVedtak;
}> = ({ tidligereInnvilgetVedtak }) => {
    const { harTidligereOvergangsstønad, harTidligereBarnetilsyn, harTidligereSkolepenger } =
        tidligereInnvilgetVedtak;
    return (
        <GridTabell kolonner={3}>
            <>
                <TabellVisning
                    ikon={TabellIkon.REGISTER}
                    tittel="Har bruker historikk i Infotrygd"
                    verdier={[
                        { stønad: 'Overgangsstønad', verdi: harTidligereOvergangsstønad },
                        { stønad: 'Barnetilsyn', verdi: harTidligereBarnetilsyn },
                        { stønad: 'Skolepenger', verdi: harTidligereSkolepenger },
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

    return <FinnesTidligereVedtaksperioder tidligereInnvilgetVedtak={infotrygd} />;
};

export default TidligereVedtaksperioderInfo;
