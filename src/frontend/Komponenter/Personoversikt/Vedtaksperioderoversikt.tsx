import React, { useState } from 'react';
import { Behandling, FagsakPerson } from '../../App/typer/fagsak';
import { HStack } from '@navikt/ds-react';
import VedtaksperioderOSBT from './Vedtaksperioder/VedtaksperioderOSBT';
import { VedtaksperioderSP } from './Vedtaksperioder/VedtaksperioderSP';
import ValgteStønaderCheckbox, { ValgtStønad } from './Vedtaksperioder/ValgteStønaderCheckbox';

export const Vedtaksperioderoversikt: React.FC<{ fagsakPerson: FagsakPerson }> = ({
    fagsakPerson,
}) => {
    const harEnFerdigBehandling = (behandlinger: Behandling[]) =>
        behandlinger.some(
            (behandling) =>
                behandling.resultat === 'INNVILGET' && behandling.status === 'FERDIGSTILT'
        );

    const utledDefaultValgtStønad = (): ValgtStønad[] => {
        const defaultStønader: ValgtStønad[] = [];

        if (
            fagsakPerson.overgangsstønad &&
            harEnFerdigBehandling(fagsakPerson.overgangsstønad.behandlinger)
        ) {
            defaultStønader.push('overgangsstønad');
        }

        if (
            fagsakPerson.barnetilsyn &&
            harEnFerdigBehandling(fagsakPerson.barnetilsyn.behandlinger)
        ) {
            defaultStønader.push('barnetilsyn');
        }

        if (
            fagsakPerson.skolepenger &&
            harEnFerdigBehandling(fagsakPerson.skolepenger.behandlinger)
        ) {
            defaultStønader.push('skolepenger');
        }

        return defaultStønader;
    };

    const [valgteStønader, settValgteStønader] = useState<ValgtStønad[]>(utledDefaultValgtStønad);

    return (
        <>
            <HStack gap="8">
                <ValgteStønaderCheckbox
                    valgteStønader={valgteStønader}
                    settValgteStønader={settValgteStønader}
                />
                {fagsakPerson.overgangsstønad && valgteStønader.includes('overgangsstønad') && (
                    <VedtaksperioderOSBT fagsak={fagsakPerson.overgangsstønad} />
                )}

                {fagsakPerson.barnetilsyn && valgteStønader.includes('barnetilsyn') && (
                    <VedtaksperioderOSBT fagsak={fagsakPerson.barnetilsyn} />
                )}

                {fagsakPerson.skolepenger && valgteStønader.includes('skolepenger') && (
                    <VedtaksperioderSP fagsak={fagsakPerson.skolepenger} />
                )}
            </HStack>
        </>
    );
};
