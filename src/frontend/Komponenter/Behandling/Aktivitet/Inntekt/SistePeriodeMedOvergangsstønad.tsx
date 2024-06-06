import React from 'react';
import { periodetypeTilTekst, aktivitetTilTekst } from '../../../../App/typer/vedtak';
import {
    formaterIsoDatoTid,
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkille,
    formaterTilIsoDatoFraTilStreng,
} from '../../../../App/utils/formatter';
import TabellVisning, { Kolonner } from '../../Tabell/TabellVisning';
import { IGrunnlagsdataSistePeriodeOvergangsstønad } from '../../TidligereVedtaksperioder/typer';
import SistePeriodeTittelTekst from './SistePeriodeTittelTekst';
import { Stønadstype } from '../../../../App/typer/behandlingstema';

interface SistePeriodeMedOvergangsstønadProps {
    sistePeriodeMedOS: IGrunnlagsdataSistePeriodeOvergangsstønad | undefined;
    behandlingOpprettet: string;
    stønadstype: Stønadstype;
}

const SistePeriodeMedOvergangsstønad: React.FC<SistePeriodeMedOvergangsstønadProps> = ({
    sistePeriodeMedOS,
    behandlingOpprettet,
    stønadstype,
}) => {
    if (!sistePeriodeMedOS) {
        return <SistePeriodeTittelTekst />;
    }

    const kolonner: Kolonner<IGrunnlagsdataSistePeriodeOvergangsstønad>[] =
        stønadstype === Stønadstype.SKOLEPENGER
            ? [
                  {
                      overskrift: 'Periode',
                      tekstVerdi: (d) =>
                          formaterStrengMedStorForbokstav(
                              formaterTilIsoDatoFraTilStreng(d.fom, d.tom)
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
                              formaterTilIsoDatoFraTilStreng(d.fom, d.tom)
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
                ekstraTekstTittel={`(sist oppdatert ${formaterIsoDatoTid(behandlingOpprettet)})`}
                verdier={[sistePeriodeMedOS]}
                minimerKolonnebredde={true}
                kolonner={kolonner}
            />
        </>
    );
};

export default SistePeriodeMedOvergangsstønad;
