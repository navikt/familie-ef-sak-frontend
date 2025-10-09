import React from 'react';
import { periodetypeTilTekst, aktivitetTilTekst } from '../../../../App/typer/vedtak';
import {
    formaterIsoDatoTid,
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkille,
    formaterFraIsoDatoTilStreng,
} from '../../../../App/utils/formatter';
import TabellVisning, { Kolonner } from '../../Tabell/TabellVisning';
import { IGrunnlagsdataSistePeriodeOvergangsstønad } from '../../TidligereVedtaksperioder/typer';
import SistePeriodeTittelTekst from './SistePeriodeTittelTekst';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { Behandling } from '../../../../App/typer/fagsak';

interface Props {
    sistePeriodeMedOS: IGrunnlagsdataSistePeriodeOvergangsstønad | undefined;
    behandling: Behandling;
}

const SistePeriodeMedOvergangsstønad: React.FC<Props> = ({ sistePeriodeMedOS, behandling }) => {
    if (!sistePeriodeMedOS) {
        return <SistePeriodeTittelTekst />;
    }

    const kolonner: Kolonner<IGrunnlagsdataSistePeriodeOvergangsstønad>[] =
        behandling.stønadstype === Stønadstype.SKOLEPENGER
            ? [
                  {
                      overskrift: 'Periode',
                      tekstVerdi: (d) =>
                          formaterStrengMedStorForbokstav(
                              formaterFraIsoDatoTilStreng(d.fom, d.tom)
                          ),
                  },
                  {
                      overskrift: 'Type',
                      tekstVerdi: (d) => periodetypeTilTekst[d.vedtaksperiodeType || ''],
                  },
                  {
                      overskrift: 'Aktivitet',
                      tekstVerdi: (d) => aktivitetTilTekst[d.aktivitet || ''],
                  },
              ]
            : [
                  {
                      overskrift: 'Periode',
                      tekstVerdi: (d) =>
                          formaterStrengMedStorForbokstav(
                              formaterFraIsoDatoTilStreng(d.fom, d.tom)
                          ),
                  },
                  {
                      overskrift: 'Type',
                      tekstVerdi: (d) => periodetypeTilTekst[d.vedtaksperiodeType || ''],
                  },
                  {
                      overskrift: 'Inntekt',
                      tekstVerdi: (d) => `${formaterTallMedTusenSkille(d.inntekt ? d.inntekt : 0)}`,
                  },
                  ...(sistePeriodeMedOS.samordningsfradrag &&
                  sistePeriodeMedOS.samordningsfradrag > 0
                      ? [
                            {
                                overskrift: 'Samordning',
                                tekstVerdi: (d: IGrunnlagsdataSistePeriodeOvergangsstønad) =>
                                    `${formaterTallMedTusenSkille(d.samordningsfradrag)}`,
                            },
                        ]
                      : []),
              ];

    return (
        <>
            <TabellVisning
                tittel={`Siste periode med overgangsstønad`}
                ekstraTekstTittel={`(sist oppdatert ${formaterIsoDatoTid(behandling.opprettet)})`}
                verdier={[sistePeriodeMedOS]}
                minimerKolonnebredde={true}
                kolonner={kolonner}
            />
        </>
    );
};

export default SistePeriodeMedOvergangsstønad;
