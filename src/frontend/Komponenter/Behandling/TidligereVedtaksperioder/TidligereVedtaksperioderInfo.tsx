import React, { FC } from 'react';
import { ITidligereInnvilgetVedtak, ITidligereVedtaksperioder } from './typer';
import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import TabellVisning, { TabellIkon } from '../Tabell/TabellVisning';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { mapTrueFalse } from '../../../App/utils/formatter';

const TabellTidligereVedtaksperioderUtenEFSak: React.FC<{
    infotrygd: ITidligereInnvilgetVedtak;
}> = ({ infotrygd }) => {
    return (
        <GridTabell kolonner={3}>
            <>
                <TabellVisning
                    ikon={TabellIkon.REGISTER}
                    tittel="Har bruker historikk i Infotrygd"
                    undertittel="(inkluderer kun EF VP, ikke PE PP)"
                    verdier={[
                        {
                            stønad: 'Overgangsstønad',
                            verdi: infotrygd.harTidligereOvergangsstønad,
                        },
                        {
                            stønad: 'Barnetilsyn',
                            verdi: infotrygd.harTidligereBarnetilsyn,
                        },
                        {
                            stønad: 'Skolepenger',
                            verdi: infotrygd.harTidligereSkolepenger,
                        },
                    ]}
                    kolonner={[
                        {
                            overskrift: 'Stønad',
                            tekstVerdi: (data) => data.verdi,
                        },
                        {
                            overskrift: 'Historikk i Infotrygd',
                            tekstVerdi: (data) => mapTrueFalse(data.verdi),
                        },
                    ]}
                />
            </>
        </GridTabell>
    );
};

const TabellTidligereVedtaksperioder: React.FC<ITidligereVedtaksperioder> = ({
    infotrygd,
    sak,
}) => {
    if (!infotrygd && !sak) {
        return null;
    }
    return (
        <GridTabell kolonner={3}>
            <>
                <TabellVisning<{
                    stønad: Stønadstype;
                    verdi: { sak?: boolean; infotrygd?: boolean };
                }>
                    ikon={TabellIkon.REGISTER}
                    tittel="Har bruker tidligere vedtaksperioder i EF Sak eller Infotrygd"
                    undertittel="(inkluderer kun EF VP, ikke PE PP)"
                    verdier={[
                        {
                            stønad: Stønadstype.OVERGANGSSTØNAD,
                            verdi: {
                                sak: sak?.harTidligereOvergangsstønad,
                                infotrygd: infotrygd?.harTidligereOvergangsstønad,
                            },
                        },
                        {
                            stønad: Stønadstype.BARNETILSYN,
                            verdi: {
                                sak: sak?.harTidligereBarnetilsyn,
                                infotrygd: infotrygd?.harTidligereBarnetilsyn,
                            },
                        },
                        {
                            stønad: Stønadstype.SKOLEPENGER,
                            verdi: {
                                sak: sak?.harTidligereSkolepenger,
                                infotrygd: infotrygd?.harTidligereSkolepenger,
                            },
                        },
                    ]}
                    kolonner={[
                        {
                            overskrift: 'Stønad',
                            tekstVerdi: (d) => stønadstypeTilTekst[d.stønad],
                        },
                        {
                            overskrift: 'Historikk i Infotrygd',
                            tekstVerdi: (d) => mapTrueFalse(!!d.verdi.infotrygd),
                        },
                        {
                            overskrift: 'Historikk i EF Sak',
                            tekstVerdi: (d) => mapTrueFalse(!!d.verdi.sak),
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
    if (tidligereVedtaksperioder.infotrygd && !tidligereVedtaksperioder.sak) {
        return (
            <TabellTidligereVedtaksperioderUtenEFSak
                infotrygd={tidligereVedtaksperioder.infotrygd}
            />
        );
    } else {
        return (
            <TabellTidligereVedtaksperioder
                infotrygd={tidligereVedtaksperioder.infotrygd}
                sak={tidligereVedtaksperioder.sak}
            />
        );
    }
};

export default TidligereVedtaksperioderInfo;
