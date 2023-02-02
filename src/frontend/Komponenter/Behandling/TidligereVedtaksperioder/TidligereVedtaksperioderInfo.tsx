import React, { FC } from 'react';
import { ITidligereVedtaksperioder } from './typer';
import TabellVisning, { TabellIkon } from '../Tabell/TabellVisning';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { formatterBooleanEllerUkjent } from '../../../App/utils/formatter';

const TabellTidligereVedtaksperioder: React.FC<ITidligereVedtaksperioder> = ({
    infotrygd,
    sak,
}) => {
    if (!infotrygd && !sak) {
        return null;
    }
    return (
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
                    tekstVerdi: (d) => formatterBooleanEllerUkjent(d.verdi.infotrygd),
                },
                {
                    overskrift: 'Historikk i EF Sak',
                    tekstVerdi: (d) => formatterBooleanEllerUkjent(d.verdi.sak),
                },
            ]}
        />
    );
};

const TidligereVedtaksperioderInfo: FC<{ tidligereVedtaksperioder: ITidligereVedtaksperioder }> = ({
    tidligereVedtaksperioder,
}) => {
    return (
        <TabellTidligereVedtaksperioder
            infotrygd={tidligereVedtaksperioder.infotrygd}
            sak={tidligereVedtaksperioder.sak}
        />
    );
};

export default TidligereVedtaksperioderInfo;
